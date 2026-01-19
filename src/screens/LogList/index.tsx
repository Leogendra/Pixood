import Button from "@/components/Button"
import { PageModalLayout } from "@/components/PageModalLayout"
import { askToRemove } from "@/helpers/prompts"
import { t } from "@/helpers/translation"
import useColors from "@/hooks/useColors"
import { LogItem, useLogState, useLogUpdater } from "@/hooks/useLogs"
import { getDayDateTitle } from "@/lib/utils"
import dayjs from "dayjs"
import { useRef } from "react"
import { Dimensions, View } from "react-native"
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RootStackScreenProps } from "../../../types"
import { Entry } from "./Entry"
import { Header } from "./Header"

const WINDOW_WIDTH = Dimensions.get('window').width

export const LogList = ({ route, navigation }: RootStackScreenProps<'LogList'>) => {
  const colors = useColors()
  const { date } = route.params
  const logState = useLogState()
  const insets = useSafeAreaInsets()
  const logUpdater = useLogUpdater()

  const items = logState.items
    .filter((item) => dayjs(item.dateTime).isSame(dayjs(date), 'day'))
    .sort((a, b) => dayjs(a.dateTime).isBefore(dayjs(b.dateTime)) ? -1 : 1)

  const close = () => {
    navigation.goBack()
  }

  const add = () => {
    navigation.navigate('LogCreate', {
      dateTime: dayjs(date).hour(dayjs().hour()).minute(dayjs().minute()).toISOString()
    })
  }

  const edit = (item: LogItem) => {
    navigation.navigate('LogEdit', { id: item.id });
  };

  const remove = (item: LogItem) => {
    logUpdater.deleteLog(item.id);
    // navigation.goBack();
  };

  const _delete = (item: LogItem) => {
    askToRemove().then(() => remove(item));
  };

  const _carouselRef = useRef<ICarouselInstance>(null)
  const pages = items.map((item) => (
    <Entry
      item={item}
      onEdit={edit}
      onDelete={_delete}
    />
  ))

  const PAGE_WIDTH = WINDOW_WIDTH * 0.9

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
          data={pages}
          key={pages.length}
          defaultIndex={0}
          renderItem={({ index }) => (
            <View style={{ flex: 1, marginLeft: '2.5%' }}>
              {pages[index]}
            </View>
          )}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          width={PAGE_WIDTH}
          style={{
            flex: 1,
            marginLeft: '2.5%',
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
