import useColors from '@/hooks/useColors';
import { LogEntry } from '@/hooks/useLogs';
import { useSettings } from '@/hooks/useSettings';
import { View } from 'react-native';

export const RatingDot = ({
  rating,
}: {
  rating: LogEntry['rating'];
}) => {
  const colors = useColors();
  const { settings } = useSettings();

  const backgroundColor = colors.scales[settings.scaleType][rating].background;

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderRadius: 6,
        backgroundColor: backgroundColor,
        width: 32,
        aspectRatio: 1,
      }}
    />
  )

};
