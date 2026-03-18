import { Dimensions, Platform, Pressable, View } from 'react-native';
import { NUMBER_OF_RATINGS } from '@/constants/Config';
import { Check } from 'react-native-feather';
import useHaptics from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import useScale from '@/hooks/useScale';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const PADDING = 40; // 20 on each side
const GAP = 8;



export const SlideMoodButton = ({
    rating, selected, onPress
}: {
    rating: number;
    selected: boolean;
    onPress: () => void;
}) => {
    const haptics = useHaptics();
    const { colors: scale } = useScale();
    const theme = useTheme();

    const width = Math.min(
        50,
        Math.max(
            30,
            (SCREEN_WIDTH - PADDING - (GAP * (NUMBER_OF_RATINGS - 1))) / NUMBER_OF_RATINGS
        )
    );

    return (
        <Pressable
            onPress={async () => {
                await haptics.selection();
                onPress();
            }}
            style={({ pressed }) => ({
                backgroundColor: scale[rating]?.background || '#ccc',
                borderWidth: Platform.OS === 'android' && theme === 'dark' ? 0 : 1,
                borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                marginBottom: 8,
                width,
                aspectRatio: 1,
                opacity: pressed ? 0.8 : 1,
                alignItems: 'center',
                justifyContent: 'center',
            })}
        >
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Check
                    color={selected ? (scale[rating]?.text || '#000') : 'transparent'}
                    width={24}
                    height={24} />
            </View>
        </Pressable>
    );
};
