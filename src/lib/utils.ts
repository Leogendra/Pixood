import { Dimensions } from 'react-native';
import dayjs from 'dayjs';
import _ from 'lodash';
import { t } from '@/helpers/translation';
import { DATE_FORMAT } from '@/constants/Config';
import { LogDay, LogEntry } from '@/hooks/useLogs';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const getItemsCoverage = (items: LogEntry[]) => {
    let itemsCoverage = 0;

    const itemsSorted = _.sortBy(items, (item) => item.dateTime);

    if (itemsSorted.length > 0) {
        const days = dayjs().diff(dayjs(itemsSorted[0].dateTime), "day");
        itemsCoverage = Math.round((itemsSorted.length / days) * 100);
    }

    return itemsCoverage;
};

export const getAverageMood = (items: LogEntry[]): number | null => {
    if (items.length === 0) return null;

    // Flatten all ratings from all items into a single array
    const allRatings = items.flatMap(item => item.rating || []);

    if (allRatings.length === 0) return null;

    const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
    return Math.round(sum / allRatings.length);
}

export const getLogDays = (items: LogEntry[]): LogDay[] => {
    const moodsPerDay = _.groupBy(items, (item) => dayjs(item.dateTime).format(DATE_FORMAT))

    return Object.keys(moodsPerDay).map((date) => {
        const items = moodsPerDay[date]
        const avgMood = getAverageMood(items)
        // Compute average per metric (record of number[])
        const metricsAccumulator: Record<string, number[]> = {}

        items.forEach((item) => {
            Object.entries(item.metrics || {}).forEach(([key, values]) => {
                const numericValues = values.filter((v) => typeof v === 'number') as number[];
                if (numericValues.length === 0) return;
                metricsAccumulator[key] = [...(metricsAccumulator[key] || []), ...numericValues];
            })
        })

        const metricsAvg = Object.fromEntries(
            Object.entries(metricsAccumulator).map(([key, values]) => {
                const sum = values.reduce((acc, v) => acc + v, 0);
                const avg = sum / values.length;
                return [key, Math.round(avg * 100) / 100];
            })
        );

        if (avgMood === null) return null

        return {
            date,
            ratingAvg: avgMood,
            metricsAvg,
            items,
        }
    }).filter((item) => item !== null) as LogDay[]
}

export const getItemDateTitle = (dateTime: LogEntry['dateTime']) => {
    const isSmallScreen = SCREEN_WIDTH < 350;

    if (dayjs(dateTime).isSame(dayjs(), 'day')) {
        return `${t('today')}, ${dayjs(dateTime).format('HH:mm')}`
    }

    if (dayjs(dateTime).isSame(dayjs().subtract(1, 'day'), 'day')) {
        return `${t('yesterday')}, ${dayjs(dateTime).format('HH:mm')}`
    }

    return (
        isSmallScreen ?
            dayjs(dateTime).format('l - LT') :
            dayjs(dateTime).format('ddd, L - LT')
    )
}

export const getDayDateTitle = (date: LogDay['date']) => {

    if (dayjs(date).isSame(dayjs(), 'day')) {
        return t('today')
    }

    if (dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')) {
        return t('yesterday')
    }

    return dayjs(date).format('dddd, L')
}

var isoDateRegExp = new RegExp(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/);

export const isISODate = (date: string) => {
    return isoDateRegExp.test(date);
};

// Removed getMostUsedEmotions - emotions feature has been deprecated

export const wait = async (timeout: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
};

export const getItemsCountPerDayAverage = (items: LogEntry[]) => {
    if (items.length === 0) return 0;

    const itemsSorted = _.sortBy(items, (item) => item.dateTime);
    const days = dayjs().diff(dayjs(itemsSorted[0].dateTime), "day");
    return Math.round(items.length / days);
}
