import { NotEnoughDataOverlay } from "@/components/Statistics/NotEnoughDataOverlay";
import { LogEntry, RATING_KEYS, useLogState } from "../../../hooks/useLogs";
import { DATE_FORMAT } from "@/constants/Config";
import { BigCard } from "@/components/BigCard";
import { t } from "@/helpers/translation";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { XAxis } from "./XAxis";
import { Dayjs } from "dayjs";
import { Row } from "./Row";
import _ from "lodash";


const MIN_ITEMS = 30;

const YearDotsContent = ({
    date,
    items,
}: {
    date: Dayjs;
    items: LogEntry[];
}) => {
    const DAY_COUNT = 31;

    const rows: ReactNode[] = []

    for (let i = 1; i <= DAY_COUNT; i++) {
        rows.push(
            <Row items={items} date={date} dayCount={i} key={i} />
        )
    }
    return (
        <>
            {rows}
        </>
    )
}

const YearInPixels = ({
    date
}: {
    date: Dayjs;
}) => {
    const logState = useLogState();

    const items = logState.items.filter(item => {
        return date.isSame(item.dateTime, 'year')
    })

    const dummyItems = _.range(0, 365).map((i) => ({
        id: `${i}`,
        date: date.add(i, 'day').format(DATE_FORMAT),
        rating: _.sample(RATING_KEYS.slice(0, 6)),
        message: 'I am feeling',
        createdAt: date.add(i, 'day').toISOString(),
    }) as LogEntry)

    return (
        <BigCard
            title={t('year_in_pixels')}
            subtitle={t('year_in_pixels_description', { year: date.format('YYYY') })}
            isShareable
        >
            <>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <XAxis />
                </View>
                {items.length < MIN_ITEMS && (
                    <NotEnoughDataOverlay limit={MIN_ITEMS - items.length} />
                )}
                {items.length >= MIN_ITEMS ? (
                    <YearDotsContent
                        date={date}
                        items={items}
                    />
                ) : (
                    <YearDotsContent
                        date={date}
                        items={dummyItems}
                    />
                )}
            </>
        </BigCard>
    )
}

export default YearInPixels