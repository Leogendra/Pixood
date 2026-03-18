import React, { forwardRef, memo } from "react";
import { useLogState } from "../../hooks/useLogs";
import { DATE_FORMAT } from "@/constants/Config";
import CalendarMonth from "./CalendarMonth";
import { View } from "react-native";
import dayjs from "dayjs";

const MONTH_DATES = Array.from({ length: 13 }, (_, i) =>
    dayjs().subtract(12 - i, "month").format(DATE_FORMAT)
);




const Calendar = memo(forwardRef(function Calendar({ }, ref: React.RefObject<View>) {
    const logState = useLogState()

    const itemMap = {}

    logState.items.forEach(item => {
        const date = dayjs(item.dateTime).format(DATE_FORMAT)

        if (!itemMap[date]) {
            itemMap[date] = []
        }

        itemMap[date].push(item)
    })

    return (
        <View
            ref={ref}
        >
            {MONTH_DATES.map((date, index) => (
                <CalendarMonth
                    key={date}
                    dateString={date}
                    itemMap={itemMap}
                />
            ))}
        </View>
    )
}))

export default Calendar