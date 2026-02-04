import { NotEnoughDataOverlay } from "@/components/Statistics/NotEnoughDataOverlay"
import { useLogState } from "@/hooks/useLogs"
import { t } from "@/helpers/translation"
import useColors from "@/hooks/useColors"
import { Text, View } from "react-native"
import dayjs, { Dayjs } from "dayjs"
import _ from 'lodash'


export const WorstMonth = ({
  date,
}: {
  date: Dayjs,
}) => {
  const colors = useColors()
  const logState = useLogState()

  const items = logState.items.filter((item) => dayjs(item.dateTime).isSame(date, 'year'))
    .map((item) => ({
      ...item,
      month: dayjs(item.dateTime).format('YYYY-MM'),
      ratingValue: item.rating && item.rating.length > 0 ? item.rating[0] : 0,
    }))

  const worstMonthByRatingValue = _.chain(items)
    .groupBy('month')
    .map((items, month) => ({
      month,
      ratingValue: _.sumBy(items, 'ratingValue'),
    }))
    .orderBy('ratingValue', 'asc')
    .first()
    .value()

  const month = worstMonthByRatingValue ? dayjs(worstMonthByRatingValue.month).format('MMMM') : null

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        minHeight: 80,
      }}
    >
      {!month && <NotEnoughDataOverlay showSubtitle={false} />}
      <Text
        style={{
          fontSize: 17,
          color: colors.textSecondary,
          fontWeight: '600',
          marginBottom: 8,
        }}
      >
        {t('statistics_worst_month')}
      </Text>
      <Text
        style={{
          fontSize: 24,
          color: colors.text,
          fontWeight: 'bold',
        }}
      >
        {month}
      </Text>
    </View>
  )
}
