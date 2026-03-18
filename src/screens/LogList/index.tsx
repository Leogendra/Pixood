import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import { LogEntry, useLogState, useLogUpdater } from "@/hooks/useLogs"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PageModalLayout } from "@/components/PageModalLayout"
import { RootStackScreenProps } from "../../../types"
import { DATE_FORMAT } from "@/constants/Config"
import { Dimensions, View } from "react-native"
import { askToRemove } from "@/helpers/prompts"
import { getDayDateTitle } from "@/lib/utils"
import useColors from "@/hooks/useColors"
import { t } from "@/helpers/translation"
import Button from "@/components/Button"
import { Header } from "./Header"
import { Entry } from "./Entry"
import { useRef } from "react"
import dayjs from "dayjs"

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window')




export const LogList = ({ route, navigation }: RootStackScreenProps<'LogList'>) => {
    const colors = useColors()
    const { date } = route.params
    const logState = useLogState()
    const insets = useSafeAreaInsets()
    const logUpdater = useLogUpdater()

    const items = logState.items
        .filter((item) => item.date === date || dayjs(item.dateTime).format(DATE_FORMAT) === date)
        .sort((a, b) => dayjs(a.dateTime).isBefore(dayjs(b.dateTime)) ? -1 : 1)

    const close = () => {
        navigation.goBack()
    }


    const add = () => {
        navigation.navigate('LogCreate', {
            dateTime: dayjs(date).hour(dayjs().hour()).minute(dayjs().minute()).toISOString()
        })
    }


    const edit = (item: LogEntry) => {
        navigation.navigate('LogEdit', { id: item.id });
    };


    const remove = (item: LogEntry) => {
        logUpdater.deleteLog(item.id);
    };


    const _delete = (item: LogEntry) => {
        askToRemove()
            .then(() => remove(item))
            .catch(() => {}); // user cancelled
    };


    const _carouselRef = useRef<ICarouselInstance>(null)

    const PAGE_WIDTH = WINDOW_WIDTH * 0.9
    const PAGE_HEIGHT = Math.max(WINDOW_HEIGHT * 0.7, 360)

    
    return (
        <PageModalLayout
            style={{
                flex: 1,
                backgroundColor: colors.logBackground,
                paddingBottom: insets.bottom,
            }}
        >
            <Header
                title={getDayDateTitle(date)}
                onClose={close}
            />
            <View
                style={{
                    flex: 1,
                }}
            >
                <Carousel
                    loop={false}
                    ref={_carouselRef}
                    data={items}
                    defaultIndex={0}
                    renderItem={({ item }) => (
                        <View style={{ marginLeft: '2.5%', height: PAGE_HEIGHT }}>
                            <Entry
                                item={item}
                                onEdit={edit}
                                onDelete={_delete}
                            />
                        </View>
                    )}
                    panGestureHandlerProps={{
                        activeOffsetX: [-10, 10],
                    }}
                    width={PAGE_WIDTH}
                    height={PAGE_HEIGHT}
                    style={{
                        width: '100%',
                    }}
                />
            </View>
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                <Button
                    type="primary"
                    style={{
                        marginTop: 12,
                    }}
                    onPress={add}
                >
                    {t("add_entry")}
                </Button>
            </View>
        </PageModalLayout>
    )
}
