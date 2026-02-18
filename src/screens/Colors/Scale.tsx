import { View } from 'react-native';
import useColors from '../../hooks/useColors';
import useScale from '../../hooks/useScale';
import { NUMBER_OF_RATINGS } from '../../constants/Config';
import { ColorDot } from './ColorDot';

export function Scale() {
  const { colors: scaleColors } = useScale();
  const scaleKeys = Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => NUMBER_OF_RATINGS - i)

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {scaleKeys.map((key, index) => (
        <ColorDot
          key={key}
          color={scaleColors[key].background} />
      ))}
    </View>
  );
}
