import { PromoCard } from "@/components/PromoCard";
import { MONTH_REPORT_SLUG, PromoCardMonth } from "@/components/PromoCardMonth";
import { PromoCardYear, YEAR_REPORT_SLUG } from "@/components/PromoCardYear";
import { DATE_FORMAT, STATISTIC_MIN_LOGS } from "@/constants/Config";
import { t } from "@/helpers/translation";
import { useSettings } from "@/hooks/useSettings";
import { CHANGELOG_ENTRIES } from "@/data/changelog";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { ReactElement, useMemo } from "react";
import { Alert, View } from "react-native";
import useColors from "../../hooks/useColors";
import { useLogState } from "../../hooks/useLogs";

export const PromoCards = () => {
  const navigation = useNavigation();
  const logState = useLogState();
  const colors = useColors();
  const { hasActionDone } = useSettings()

  const statisticsUnlocked = logState.items.length >= STATISTIC_MIN_LOGS;
  const isBeginningOfMonth = dayjs().isBetween(dayjs().startOf('month'), dayjs().startOf('month').add(3, 'day'), null, '[]');
  const isDecember = dayjs().month() === 11;
  const enoughtLogsForYearPromo = logState.items.length > 30;

  const hasMonthPromo = isBeginningOfMonth && statisticsUnlocked && !hasActionDone(MONTH_REPORT_SLUG)
  const hasYearPromo = enoughtLogsForYearPromo && isDecember && statisticsUnlocked && !hasActionDone(YEAR_REPORT_SLUG)
  const hasSleepTrackingPromo = logState.items.length > 4 && !hasActionDone('promo_sleep_tracking_closed')

  const mostRecentChangelog = useMemo(() => {
    return CHANGELOG_ENTRIES
      .slice()
      .sort((a, b) => dayjs(b.published).valueOf() - dayjs(a.published).valueOf())
      .find(entry => !hasActionDone(entry.slug)) || null
  }, [hasActionDone])

  const promoCards: ReactElement[] = []

  if (hasMonthPromo) {
    promoCards.push(
      <PromoCardMonth
        title={t('promo_card_month_title', { month: dayjs().subtract(1, 'month').format('MMMM') })}
        onPress={() => navigation.navigate('StatisticsMonth', { date: dayjs().subtract(1, 'month').startOf('month').format(DATE_FORMAT) })}
      />
    )
  }

  if (hasYearPromo) {
    promoCards.push(
      <PromoCardYear
        title={t('promo_card_year_title', { year: dayjs().format('YYYY') })}
        onPress={() => navigation.navigate('StatisticsYear', { date: dayjs().startOf('year').format(DATE_FORMAT) })}
      />
    )
  }

  if (hasSleepTrackingPromo) {
    promoCards.push(
      <PromoCard
        slug="promo_sleep_tracking_closed"
        subtitle={t('new_feature')}
        title={t('promo_sleep_tracking_title')}
        onPress={() => {
          navigation.navigate("Steps");
        }}
      />
    )
  }

  if (mostRecentChangelog) {
    promoCards.push(
      <PromoCard
        colorName="pink"
        slug={mostRecentChangelog.slug}
        subtitle={t('new_release')}
        title={mostRecentChangelog.title}
        onPress={() => {
          Alert.alert(mostRecentChangelog.title, mostRecentChangelog.summary)
        }}
      />
    )
  }

  if (promoCards.length === 0) return null;

  return (
    <View
      style={{
        borderTopColor: colors.cardBorder,
        borderTopWidth: 1,
        marginTop: 24,
        paddingTop: 24,
      }}
    >
      {promoCards.map((promoCard, index) => (
        <View
          key={`promo-card-${index}`}
          style={{
            marginTop: index === 0 ? 0 : 16,
          }}
        >
          {promoCard}
        </View>
      ))}
    </View>
  );
};
