import { DATE_FORMAT } from '@/constants/Config';
import { askToCancel, askToDisableStep, askToRemove } from '@/helpers/prompts';
import useColors from '@/hooks/useColors';
import { useLogState, useLogUpdater } from '@/hooks/useLogs';
import { LogEntry } from '@/types/logFormat';
import { useSettings } from '@/hooks/useSettings';
import { TemporaryLogState, useTemporaryLog } from '@/hooks/useTemporaryLog';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { Keyboard, Platform, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from "uuid";
import { SlideAction } from './components/SlideAction';
import { SlideHeader } from './components/SlideHeader';
import { LoggerStep } from './config';
import { UnifiedLoggerSlide } from './slides/UnifiedLoggerSlide';

export type LoggerMode = 'create' | 'edit'
export type LoggerInterface = 'unified'

const getAvailableStepsForCreate = ({
    date,
}: {
    date: string;
}) => {
    const { hasStep, settings } = useSettings();
    const logState = useLogState();

    const slides: LoggerStep[] = [
        'rating'
    ]

    if (hasStep('tags')) slides.push('tags')
    if (hasStep('message')) slides.push('message')

    return slides;
}

const getAvailableStepsForEdit = ({
    date,
    item,
}: {
    date: string;
    item: LogEntry;
}) => {
    const { hasStep } = useSettings();
    const logState = useLogState();

    const slides: LoggerStep[] = [
        'rating'
    ]

    if (hasStep('tags') || item.tags.length > 0) slides.push('tags')
    if (hasStep('message') || item.notes.length > 0) slides.push('message')

    return slides;
}

export const LoggerEdit = ({
    id,
    initialStep,
    interfaceType = 'unified',
}: {
    id: string
    initialStep?: LoggerStep
    interfaceType?: LoggerInterface
}) => {
    const logState = useLogState()
    const LogEntry = logState?.items.find(item => item.id === id)

    if (LogEntry === undefined) {
        return (
            <View>
                <Text>Log not found</Text>
            </View>
        )
    }

    const initialItem: TemporaryLogState = {
        ...LogEntry,
    }

    const avaliableSteps = getAvailableStepsForEdit({
        date: dayjs(initialItem.dateTime).format(DATE_FORMAT),
        item: LogEntry,
    })

    return (
        <Logger
            mode="edit"
            initialItem={initialItem}
            initialStep={initialStep}
            avaliableSteps={avaliableSteps}
            interfaceType={interfaceType}
        />
    )
}

export const LoggerCreate = ({
    dateTime,
    initialStep,
    avaliableSteps,
    interfaceType = 'unified',
}: {
    dateTime: string
    initialStep?: LoggerStep
    avaliableSteps?: LoggerStep[]
    interfaceType?: LoggerInterface
}) => {
    const _id = useRef(uuidv4())
    const createdAt = useRef(dayjs().toISOString())

    const initialItem: TemporaryLogState = {
        id: _id.current,
        date: dateTime ? dayjs(dateTime).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT),
        dateTime: dateTime,
        rating: null,
        notes: '',
        metrics: {},
        tags: [],
    }

    avaliableSteps = avaliableSteps || getAvailableStepsForCreate({
        date: initialItem.date,
    })

    return (
        <Logger
            mode="create"
            initialItem={initialItem}
            initialStep={initialStep}
            avaliableSteps={avaliableSteps}
            interfaceType={interfaceType}
        />
    )
}

export const Logger = ({
    initialItem,
    initialStep,
    avaliableSteps,
    mode,
    interfaceType = 'unified',
}: {
    initialItem: TemporaryLogState,
    initialStep?: LoggerStep;
    avaliableSteps: LoggerStep[];
    mode: LoggerMode
    interfaceType?: LoggerInterface
}) => {
    const navigation = useNavigation();
    const colors = useColors()
    const insets = useSafeAreaInsets();

    const logState = useLogState()
    const logUpdater = useLogUpdater()

    const { toggleStep } = useSettings()

    const tempLog = useTemporaryLog(initialItem);

    const texAreaRef = useRef<TextInput>(null)
    const isEditing = mode === 'edit'
    const showDisable = logState.items.length <= 3 && !isEditing;

    const close = async () => {
        tempLog.reset()
        navigation.goBack();
    }

    const save = (data: TemporaryLogState) => {
        if (data.rating === null || data.rating.length === 0) {
            data.rating = [3] // neutral par défaut
        }

        if (mode === 'edit') {
            logUpdater.editLog(data.id, data as LogEntry)
        }
        else {
            logUpdater.addLog(data as LogEntry)
        }

        close()
    }

    const remove = () => {
        logUpdater.deleteLog(tempLog.data.id)
        close()
    }

    const cancel = () => {
        close()
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.logBackground,
            position: 'relative',
        }}>
            <View
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === 'android' ? insets.top : 0,
                }}
            >
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 12,
                    }}
                >
                    <SlideHeader
                        backVisible={false}
                        isDeleteable={isEditing}
                        onClose={() => {
                            if (tempLog.isDirty) {
                                askToCancel().then(() => cancel()).catch(() => { })
                            } else {
                                cancel()
                            }
                        }}
                        onDelete={() => {
                            if (
                                tempLog.data.notes.length > 0 ||
                                tempLog.data.tags.length > 0
                            ) {
                                askToRemove().then(() => remove())
                            } else {
                                remove()
                            }
                        }}
                    />
                </View>
                <UnifiedLoggerSlide
                    onRatingChange={(rating) => tempLog.update({ rating })}
                    onTagsChange={(tagIds) => tempLog.update({ selectedCategorizedTagIds: tagIds })}
                    onMessageChange={(notes) => tempLog.update({ notes })}
                    showDisable={showDisable}
                    onDisableStep={() => {
                        askToDisableStep().then(() => {
                            // TODO: Logic 
                        })
                    }}
                />
            </View>
            <SlideAction
                type="save"
                onPress={() => save(tempLog.data)}
            />
        </View>
    )
}