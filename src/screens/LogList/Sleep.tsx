import { SlideSleepButton } from '@/components/Logger/slides/SlideSleepButton';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from './SectionHeader';
import { t } from '../../helpers/translation';
import { LogEntry } from '@/hooks/useLogs';
import { View } from 'react-native';


export const Sleep = ({
    item,
}: {
    item: LogEntry;
}) => {
    const navigation = useNavigation();
    const sleepValues = item.metrics?.sleep ?? [];
    if (!sleepValues || sleepValues.length === 0) return null;
    const sleepQuality = Math.round(sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length);

    return (
        <View
            style={{
            }}
        >
            <SectionHeader
                title={t('view_log_sleep')}
                onEdit={() => {
                    navigation.navigate('LogEdit', {
                        id: item.id,
                        step: 'sleep',
                    });
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                <SlideSleepButton
                    value={sleepQuality}
                    style={{
                        flex: 0,
                        minWidth: 80,
                        margin: -4,
                    }}
                />
            </View>
        </View>
    );
};
