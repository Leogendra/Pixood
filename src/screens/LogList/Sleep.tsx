import { t } from '../../helpers/translation';
import { SlideSleepButton } from '@/components/Logger/slides/SlideSleepButton';
import { LogEntry } from '@/hooks/useLogs';
import { useNavigation } from '@react-navigation/native';
// Removed t from i18n-js import
import { View } from 'react-native';
import { SectionHeader } from './SectionHeader';

export const Sleep = ({
  item,
}: {
  item: LogEntry;
}) => {
  const navigation = useNavigation();

  if (!item.sleep?.quality) return null;

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
          value={item.sleep?.quality}
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
