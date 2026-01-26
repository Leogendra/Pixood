import { View, Text, Pressable } from "react-native";
import { Plus } from "react-native-feather";
import useHaptics from "@/hooks/useHaptics";
import { LogEntry } from "@/hooks/useLogs";
import useScale from "@/hooks/useScale";
import useColors from "@/hooks/useColors";
import { SettingsState } from "@/hooks/useSettings";
import { t } from "@/helpers/translation";
import ScaleButton from "./ScaleButton";
import { NUMBER_OF_RATINGS } from "@/constants/Config";


export default function Scale({
    type,
    value,
    onPress = null,
    allowMultiple = false,
}: {
    type: SettingsState['scaleType'];
    value?: number | number[];
    onPress?: any,
    allowMultiple?: boolean;
}) {
    let { colors, labels } = useScale(type)
    const haptics = useHaptics()
    const themeColors = useColors()

    const handleMoodPress = async (rating: number) => {
        if (onPress) {
            await haptics.selection()

            if (allowMultiple) {
                // For multiple selection
                const currentValue = Array.isArray(value) ? value : (value ? [value] : [])

                if (currentValue.includes(rating)) {
                    // Deselect if already selected
                    const newValue = currentValue.filter(v => v !== rating)
                    onPress(newValue.length > 0 ? newValue : null)
                } 
                else {
                    // Add to selection
                    const newValue = [...currentValue, rating]
                    onPress(newValue)
                }
            } 
            else {
                // Classic simple selection
                onPress(rating)
            }
        }
    }

    return (
        <View style={{ width: '100%' }}>
            {/* Color squares row */}
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: allowMultiple ? 16 : 0,
                }}
            >
                {labels.map((rating, index) => {
                    const isSelected = Array.isArray(value) ?
                        value.includes(rating) :
                        value === rating

                    return (
                        <ScaleButton
                            accessibilityLabel={`Rating ${rating}`}
                            key={rating}
                            isFirst={index === 0}
                            isLast={index === labels.length - 1}
                            isSelected={isSelected}
                            onPress={() => handleMoodPress(rating)}
                            backgroundColor={colors[rating].background}
                            textColor={colors[rating].text}
                        />
                    );
                })}
            </View>

            {/* "Add a mood" button if multiple selection is enabled */}
            {allowMultiple && (
                <Pressable
                    style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderStyle: 'dashed',
                        borderColor: themeColors.text + '40',
                        backgroundColor: pressed ? themeColors.text + '10' : 'transparent',
                        opacity: pressed ? 0.8 : 1,
                    })}
                    onPress={() => {
                        // This button allows opening an interface to add a mood
                        // For now, we can just show a message or an action
                        haptics.selection()
                    }}
                >
                    <Plus
                        width={16}
                        height={16}
                        color={themeColors.text}
                        style={{ marginRight: 8 }}
                    />
                    <Text style={{
                        color: themeColors.text,
                        fontSize: 16,
                        fontWeight: '500'
                    }}>
                        {t('add_a_mood')}
                    </Text>
                </Pressable>
            )}
        </View>
    )
}
