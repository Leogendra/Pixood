import { useNavigation } from '@react-navigation/native';
import { DATE_FORMAT } from '@/constants/Config';
import { useLogState } from '@/hooks/useLogs';
import dayjs from 'dayjs';




export const useCalendarNavigation = () => {
    const navigation = useNavigation();
    const logsState = useLogState()

    const openDay = (date: string) => {
        const items = logsState.items.filter((log) => dayjs(log.dateTime).format(DATE_FORMAT) === date)

        if (items.length === 0) {
            navigation.navigate('LogCreate', {
                dateTime: dayjs(date).hour(dayjs().hour()).minute(dayjs().minute()).toISOString()
            })
            return;
        }
        else {
            navigation.navigate('LogList', { date })
        }

    }

    return {
        openDay,
    }
}