import useColors from '@/hooks/useColors';
import { LogEntry } from '@/hooks/useLogs';
import useScale from '@/hooks/useScale';
import { View } from 'react-native';

export const RatingDot = ({
  rating,
}: {
  rating: LogEntry['rating'];
}) => {
  const { colors: scale } = useScale();

  // Calculate average rating to get the color
  const avgRating = rating && rating.length > 0
    ? Math.round(rating.reduce((a, b) => a + b, 0) / rating.length)
    : 4; // default to neutral

  const backgroundColor = scale[avgRating]?.background || scale.empty.background;

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
}