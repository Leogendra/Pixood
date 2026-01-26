import { Dayjs } from "dayjs"
import { LogEntry } from "@/hooks/useLogs"
import { NotEnoughDataOverlay } from "../NotEnoughDataOverlay"
import { BigCard } from "../../BigCard"
import { Content } from "./Content"
import { NUMBER_OF_RATINGS } from "@/constants/Config"

const MIN_ITEMS = 14

export const MoodCounts = ({
    title,
    subtitle,
    date,
    items,
}: {
    title: string,
    subtitle: string,
    date: Dayjs
    items: LogEntry[]
}) => {
    // Count occurrences of each rating value (1-7)
    const ratingCounts: {
        [key: number]: number
    } = {}
    
    for (let i = 1; i <= NUMBER_OF_RATINGS; i++) {
        ratingCounts[i] = items.reduce((acc, item) => {
            return acc + (item.rating?.filter(r => r === i).length || 0);
        }, 0);
    }

    const total = Object.values(ratingCounts).reduce((acc: number, count: number) => acc + count, 0) || 0

    const data = {
        values: ratingCounts,
        total,
    }

    const dummyData = {
        values: {
            1: 2,
            2: 1,
            3: 2,
            4: 4,
            5: 3,
            6: 5,
            7: 1,
        },
        total: 18,
    }

    return (
        <BigCard
            title={title}
            subtitle={subtitle}
            isShareable
        >
            {total < MIN_ITEMS && (
                <NotEnoughDataOverlay limit={MIN_ITEMS - total} />
            )}
            {total >= MIN_ITEMS ? (
                <Content
                    data={data}
                />
            ) : (
                <Content
                    data={dummyData}
                />
            )}
        </BigCard>
    )
}