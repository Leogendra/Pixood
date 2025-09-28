import { View, Text, Pressable } from "react-native";
import { Plus } from "react-native-feather";
import useHaptics from "@/hooks/useHaptics";
import { LogItem } from "@/hooks/useLogs";
import useScale from "@/hooks/useScale";
import useColors from "@/hooks/useColors";
import { SettingsState } from "@/hooks/useSettings";
import { t } from "@/helpers/translation";
import ScaleButton from "./ScaleButton";

export default function Scale({
  type,
  value,
  onPress = null,
  allowMultiple = false,
}: {
  type: SettingsState['scaleType'];
  value?: LogItem['rating'] | LogItem['rating'][];
  onPress?: any,
  allowMultiple?: boolean;
}) {
  let { colors, labels } = useScale(type)
  const _labels = labels.slice().reverse()
  const haptics = useHaptics()
  const themeColors = useColors()

  const handleMoodPress = async (key: string) => {
    if (onPress) {
      await haptics.selection()
      
      if (allowMultiple) {
        // Pour la sélection multiple
        const currentValue = Array.isArray(value) ? value : (value ? [value] : [])
        
        if (currentValue.includes(key as LogItem['rating'])) {
          // Désélectionner si déjà sélectionné
          const newValue = currentValue.filter(v => v !== key)
          onPress(newValue.length > 0 ? newValue : null)
        } else {
          // Ajouter à la sélection
          const newValue = [...currentValue, key as LogItem['rating']]
          onPress(newValue)
        }
      } else {
        // Sélection simple classique
        onPress(key)
      }
    }
  }

  return (
    <View style={{ width: '100%' }}>
      {/* Rangée des carrés de couleur */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: allowMultiple ? 16 : 0,
        }}
      >
        {Object.keys(colors).reverse().map((key, index) => {
          const isSelected = Array.isArray(value) ?
            value.includes(key as LogItem['rating']) :
            value === key

          return (
            <ScaleButton
              accessibilityLabel={_labels[index]}
              key={key}
              isFirst={index === 0}
              isLast={index === _labels.length - 1}
              isSelected={isSelected}
              onPress={() => handleMoodPress(key)}
              backgroundColor={colors[key].background}
              textColor={colors[key].text}
            />
          );
        })}
      </View>

      {/* Bouton "Add a mood" si sélection multiple activée */}
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
            // Ce bouton permet d'ouvrir une interface pour ajouter un mood
            // Pour l'instant, on peut juste montrer un message ou une action
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
