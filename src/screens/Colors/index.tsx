import { ScrollView, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { adjustPaletteSize, isValidHexColor } from '@/constants/Colors/PaletteUtils';
import { PageWithHeaderLayout } from '@/components/PageWithHeaderLayout';
// Removed react-native-color-picker. Using platform-specific ColorPickerWidget instead.
import MenuListHeadline from '@/components/MenuListHeadline';
import { COLOR_PALETTE_PRESETS } from '@/constants/Config';
import { useSettings } from '../../hooks/useSettings';
import { useCallback, useRef, useState } from 'react';
import ColorPickerWidget from './ColorPickerWidget';
import useColors from '../../hooks/useColors';
import TextInfo from '@/components/TextInfo';
import { t } from '@/helpers/translation';
import { Radio } from './Radio';





export const ColorsScreen = ({ navigation }) => {
    const { setSettings, settings } = useSettings()
    const colors = useColors()

    const [selectedPresetId, setSelectedPresetId] = useState(settings.palettePresetId)
    const [customPalette, setCustomPalette] = useState(settings.customPalette || adjustPaletteSize(COLOR_PALETTE_PRESETS[0].colors))
    const [pickerIndex, setPickerIndex] = useState<number | null>(null)
    const [pickerValue, setPickerValue] = useState<string>('')
    const webColorInputRef = useRef<any>(null)

    const updateCustomColor = (index: number, raw: string) => {
        const normalized = raw.startsWith('#') ? raw : `#${raw}`
        const upper = normalized.toUpperCase()

        if (!isValidHexColor(upper)) {
            return
        }

        const next = [...customPalette]
        next[index] = upper
        setCustomPalette(next)
        setSettings(prev => ({
            ...prev,
            palettePresetId: null,
            customPalette: next,
        }))
    }

    const onSelectPreset = useCallback((presetId) => {
        setSelectedPresetId(presetId)
        setSettings(prev => ({
            ...prev,
            palettePresetId: presetId,
            customPalette: null
        }))
    }, [])

    const openPicker = (index: number, current: string) => {
        setPickerIndex(index)
        setPickerValue(current)

        if (Platform.OS === 'web') {
            if (webColorInputRef.current) {
                webColorInputRef.current.value = current
                webColorInputRef.current.click()
            }
        }
    }

    const applyPickerValue = (value: string) => {
        if (pickerIndex === null) return
        const normalized = value.startsWith('#') ? value : `#${value}`
        const upper = normalized.toUpperCase()
        if (!isValidHexColor(upper)) {
            return
        }
        updateCustomColor(pickerIndex, upper)
        setPickerIndex(null)
    }

    return (
        <PageWithHeaderLayout style={{
            flex: 1,
            backgroundColor: colors.background,
        }}>
            <ScrollView
                style={{
                    padding: 20,
                }}
            >
                <MenuListHeadline>Palette Presets</MenuListHeadline>
                {COLOR_PALETTE_PRESETS.map(preset => (
                    <View key={preset.id} style={{ marginBottom: 16 }}>

                        {Platform.OS === 'web' && (
                            <input
                                ref={webColorInputRef}
                                type="color"
                                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                onChange={(e: any) => {
                                    const value = e.target.value;
                                    applyPickerValue(value);
                                }}
                            />
                        )}
                        <Radio
                            isSelected={selectedPresetId === preset.id && !settings.customPalette}
                            onPress={() => onSelectPreset(preset.id)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8 }}>
                                    {preset.name}
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {adjustPaletteSize(preset.colors).map((color, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                flex: 1,
                                                height: 40,
                                                borderRadius: 8,
                                                backgroundColor: color,
                                            }}
                                        />
                                    ))}
                                </View>
                            </View>
                        </Radio>
                    </View>
                ))}

                <MenuListHeadline>Custom Palette</MenuListHeadline>
                <TextInfo>
                    {t('customize_your_palette')}
                </TextInfo>

                {/* Color pickers for each mood */}
                <View style={{ marginTop: 16, gap: 12 }}>
                    {customPalette.map((color, index) => (
                        <View key={index} style={{
                            backgroundColor: colors.cardBackground,
                            borderRadius: 12,
                            padding: 12,
                            borderWidth: 1,
                            borderColor: colors.cardBorder,
                        }}>
                            <Text style={{
                                color: colors.text,
                                marginBottom: 8,
                                fontWeight: '500'
                            }}>
                                Mood {index + 1}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <TouchableOpacity
                                    onPress={() => openPicker(index, color)}
                                    activeOpacity={0.7}
                                    style={{
                                        height: 60,
                                        width: 60,
                                        borderRadius: 8,
                                        backgroundColor: color,
                                        borderWidth: 1,
                                        borderColor: colors.cardBorder,
                                    }}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ marginBottom: 8, height: 40 }} />
            </ScrollView>

            {/* Native fallback modal color picker */}
            <ColorPickerWidget
                visible={pickerIndex !== null}
                initial={pickerIndex !== null ? customPalette[pickerIndex] : '#FFFFFF'}
                onSelect={(hex) => applyPickerValue(hex)}
                onCancel={() => setPickerIndex(null)}
            />
        </PageWithHeaderLayout>
    );
}
