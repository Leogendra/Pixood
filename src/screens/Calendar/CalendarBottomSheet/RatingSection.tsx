import { View } from 'react-native';
import Scale from '@/components/Scale';
import TextHeadline from '@/components/TextHeadline';
import { t } from '@/helpers/translation';
import { LogEntry } from '../../../hooks/useLogs';
import { useSettings } from '../../../hooks/useSettings';

export const RatingSection = ({
  value,
  onChange,
  allowMultiple = false,
}: {
  value: number[];
  onChange: (value: number) => void;
  allowMultiple?: boolean;
}) => {
  const { settings } = useSettings();

  return (
    <View
      style={{
        marginBottom: 16,
      }}
    >
      <TextHeadline style={{ marginBottom: 12 }}>{t('mood')}</TextHeadline>
      <Scale 
        value={value} 
        onPress={onChange} 
        type={settings.scaleType} 
        allowMultiple={allowMultiple}
      />
    </View>
  );
};
