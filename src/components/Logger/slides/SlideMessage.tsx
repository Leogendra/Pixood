import { Card } from '@/components/Card';
import { getLogEditMarginTop } from "@/helpers/responsive";
import { t } from "@/helpers/translation";
import useColors from "@/hooks/useColors";
import { LogEntry, useLogState } from "@/hooks/useLogs";
import { useTemporaryLog } from "@/hooks/useTemporaryLog";
import { getAverageMood } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { HelpCircle } from "react-native-feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DismissKeyboard from "../../DismisKeyboard";
import LinkButton from "../../LinkButton";
import TextArea from "../../TextArea";
import { SlideHeadline } from "../components/SlideHeadline";
import { Footer } from "./Footer";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const MAX_LENGTH = 10 * 1000;


const Tips = ({
    onClose
}: {
    onClose: () => void
}) => {
    const colors = useColors();
    const tempLog = useTemporaryLog();

    let questions: string[] = [useRef(t(`log_modal_message_placeholder_${randomInt(1, 6)}`)).current];
    const date = dayjs(tempLog.data.dateTime)

    return (
        <View
            style={{
            }}
        >
            <Card
                title={t('log_message_hint_title')}
                style={{
                    backgroundColor: colors.logCardBackground,
                    marginTop: 16,
                }}
                onClose={onClose}
            >
                {questions.map((q, index) => (
                    <Text
                        key={`q-${index}`}
                        style={{
                            fontSize: 17,
                            color: colors.textSecondary,
                            marginTop: index === 0 ? 0 : 8,
                        }}
                    >{q}</Text>
                ))}
            </Card>
        </View>
    )
}

export const SlideMessage = forwardRef(({
    onChange,
    onDisableStep,
    showDisable,
}: {
    onChange: (text: LogEntry['notes']) => void
    onDisableStep: () => void
    showDisable: boolean
}, ref: any) => {
    const insets = useSafeAreaInsets();
    const colors = useColors();
    const tempLog = useTemporaryLog();
    const marginTop = getLogEditMarginTop()

    const [showTips, setShowTips] = useState(false)

    const [shouldExpand, setShouldExpand] = useState(false);

    useEffect(() => {
        const r1 = Keyboard.addListener('keyboardWillShow', () => setShouldExpand(true))
        const r2 = Keyboard.addListener('keyboardWillHide', () => setShouldExpand(false))

        return () => {
            r1.remove()
            r2.remove()
        }
    }, [])

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={marginTop + insets.top + 16}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flex: 1
            }}
        >
            <DismissKeyboard>
                <View style={{
                    flex: 1,
                    justifyContent: "space-around"
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: colors.logBackground,
                        width: '100%',
                        position: 'relative',
                        paddingHorizontal: 20,
                        paddingBottom: insets.bottom + 16 + (shouldExpand ? 24 : 0),
                    }}>

                        <View
                            style={{
                                flex: 1,
                                marginTop: marginTop,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <SlideHeadline>{t('log_note_question')}</SlideHeadline>
                                <LinkButton
                                    onPress={() => {
                                        setShowTips(!showTips)
                                    }}
                                    style={{
                                        marginBottom: -12,
                                        marginTop: -12,
                                        marginRight: 4,
                                    }}
                                >
                                    <HelpCircle width={22} color={colors.textSecondary} />
                                </LinkButton>
                            </View>
                            {showTips && (
                                <Tips
                                    onClose={() => {
                                        setShowTips(false)
                                    }}
                                />
                            )}
                            {!showTips && (
                                <View
                                    style={{
                                        flexDirection: "column",
                                        width: "100%",
                                        marginTop: 16,
                                        flex: 1,
                                    }}
                                >
                                    <TextArea
                                        ref={ref}
                                        value={tempLog?.data?.notes}
                                        onChange={onChange}
                                        maxLength={MAX_LENGTH}
                                        style={{
                                            flex: 1,
                                            marginBottom: 0,
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                        <Footer>
                            {showDisable && (
                                <LinkButton
                                    type="secondary"
                                    onPress={onDisableStep}
                                    style={{
                                        fontWeight: '400',
                                    }}
                                >{t('log_message_disable')}</LinkButton>
                            )}
                        </Footer>
                    </View>
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    )
})
