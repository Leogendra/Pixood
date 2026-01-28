import { adjustPaletteSize, isValidHexColor } from '@/constants/Colors/PaletteUtils';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { PageWithHeaderLayout } from '@/components/PageWithHeaderLayout';
import { CustomColorPicker } from './ColorPickerWidget';
import MenuListHeadline from '@/components/MenuListHeadline';
import React, { useCallback, useState } from 'react';
import { COLOR_PALETTE_PRESETS } from '@/constants/Config';
import { ScrollView } from 'react-native-gesture-handler';
import { useSettings } from '../../hooks/useSettings';
import useColors from '../../hooks/useColors';
import { t } from '@/helpers/translation';
import { Radio } from './Radio';




export const ColorsScreen = ({ navigation }) => {
    const { setSettings, settings } = useSettings();
    const colors = useColors();

    const [selectedPresetId, setSelectedPresetId] = useState(settings.palettePresetId);
    const [customPalette, setCustomPalette] = useState(
        settings.customPalette || adjustPaletteSize(COLOR_PALETTE_PRESETS[0].colors)
    );

    const [pickerIndex, setPickerIndex] = useState<number | null>(null);
    const [pickerValue, setPickerValue] = useState<string>('#FFFFFF');

    const updateCustomColor = (index: number, raw: string) => {
        const normalized = raw.startsWith('#') ? raw : `#${raw}`;
        const upper = normalized.toUpperCase();
        if (!isValidHexColor(upper)) return;

        const next = [...customPalette];
        next[index] = upper;

        setCustomPalette(next);
        setSettings(prev => ({
            ...prev,
            palettePresetId: null,
            customPalette: next,
        }));
    };


    const onSelectPreset = useCallback((presetId: string) => {
        setSelectedPresetId(presetId);
        setSettings(prev => ({
            ...prev,
            palettePresetId: presetId,
            customPalette: null,
        }));
    }, [setSettings]);


    const openPicker = (index: number, current: string) => {
        setPickerIndex(index);
        setPickerValue(current || '#FFFFFF');
    };


    const savePicker = () => {
        applyPickerValue(pickerValue);
        setPickerIndex(null);
    };


    const normalizeColor = (value: string): string => {
        let hexColor = value.startsWith('#') ? value : `#${value}`;
        hexColor = hexColor.toUpperCase();
        let normalizedColor: string;

        if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
            normalizedColor = hexColor;
        }
        else if (/^#[0-9A-F]{3}$/i.test(hexColor)) {
            const r = hexColor[1];
            const g = hexColor[2];
            const b = hexColor[3];
            normalizedColor = `#${r}${r}${g}${g}${b}${b}`;
        }
        else if (/^#[0-9A-F]{8}$/i.test(hexColor)) {
            normalizedColor = hexColor.slice(0, 7); // Keep only #RRGGBB
        }
        else {
            return "";
        }
        return normalizedColor;
    };


    const applyPickerValue = (value: string) => {
        if (pickerIndex === null) { return; }

        const normalizedColor = normalizeColor(value);
        if (normalizedColor) {
            updateCustomColor(pickerIndex, normalizedColor);
            setPickerIndex(null);
        }

    };


    return (
        <PageWithHeaderLayout
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <ScrollView style={{ padding: 20 }}>

                <MenuListHeadline>{t('your_palette')}</MenuListHeadline>
                <View
                    style={{
                        marginTop: 12,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        borderRadius: 10,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                    }}
                >
                    {customPalette.map((c, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => openPicker(idx, c)}
                            activeOpacity={0.8}
                            style={{
                                width: 42,
                                height: 42,
                                backgroundColor: c,
                                borderRightWidth: idx === customPalette.length - 1 ? 0 : 1,
                                borderRightColor: colors.cardBorder,
                            }}
                        />
                    ))}
                </View>

                <MenuListHeadline>{t('palette_presets')}</MenuListHeadline>
                {COLOR_PALETTE_PRESETS.map(preset => (
                    <View key={preset.id} style={{ marginBottom: 5 }}>
                        <Radio
                            isSelected={selectedPresetId === preset.id && !settings.customPalette}
                            onPress={() => onSelectPreset(preset.id)}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {preset.colors.map((c, idx) => (
                                        <View
                                            key={idx}
                                            style={{
                                                flex: 1,
                                                height: 28,
                                                backgroundColor: c,
                                                borderTopLeftRadius: idx === 0 ? 8 : 0,
                                                borderBottomLeftRadius: idx === 0 ? 8 : 0,
                                                borderTopRightRadius: idx === preset.colors.length - 1 ? 8 : 0,
                                                borderBottomRightRadius: idx === preset.colors.length - 1 ? 8 : 0,
                                            }}
                                        />
                                    ))}
                                </View>
                            </View>
                        </Radio>
                    </View>
                ))}

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Color picker modal */}
            <Modal
                visible={pickerIndex !== null}
                transparent
                animationType="fade"
                onRequestClose={savePicker}
            >
                <Pressable
                    onPress={savePicker}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        padding: 20,
                        justifyContent: 'center',
                    }}
                >
                    <Pressable
                        onPress={() => { }}
                        style={{
                            backgroundColor: colors.cardBackground,
                            borderRadius: 16,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: colors.cardBorder,
                        }}
                    >
                        <CustomColorPicker
                            initialColor={pickerValue}
                            onColorChange={setPickerValue}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                            <TouchableOpacity
                                onPress={savePicker}
                                activeOpacity={0.8}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: colors.cardBorder,
                                }}
                            >
                                <Text style={{ color: colors.text, fontWeight: '600' }}>{t('save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </PageWithHeaderLayout>
    );
};