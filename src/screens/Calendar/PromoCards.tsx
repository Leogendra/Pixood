import React, { ReactElement, useMemo } from "react";
import { CHANGELOG_ENTRIES } from "@/data/changelog";
import { PromoCard } from "@/components/PromoCard";
import { useSettings } from "@/hooks/useSettings";
import useColors from "../../hooks/useColors";
import { Alert, View } from "react-native";
import { t } from "@/helpers/translation";
import dayjs from "dayjs";


export const PromoCards = () => {
    const colors = useColors();
    const { hasActionDone } = useSettings()

    const mostRecentChangelog = useMemo(() => {
        return CHANGELOG_ENTRIES
            .slice()
            .sort((a, b) => dayjs(b.published).valueOf() - dayjs(a.published).valueOf())
            .find(entry => !hasActionDone(entry.slug)) || null
    }, [hasActionDone])

    const promoCards: ReactElement[] = []

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
    else {
        return null;
    }

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
