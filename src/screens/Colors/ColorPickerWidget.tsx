import ColorPicker, { Panel2, InputWidget, BrightnessSlider } from 'reanimated-color-picker';
import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';




interface ColorFormatsObject {
    hex: string;
    rgb: string;
    rgba: string;
    hsv: string;
    hsva: string;
    hwb: string;
    hwba: string;
    hsl: string;
    hsla: string;
}


export function CustomColorPicker({
    initialColor = '#FFFFFF',
    onColorChange
}: {
    initialColor?: string,
    onColorChange?: (color: string) => void
}) {
    const [displayColor, setDisplayColor] = useState(initialColor);

    const handleColorChange = (color: ColorFormatsObject) => {
        setDisplayColor(color.hex);
        if (onColorChange) {
            onColorChange(color.hex);
        }
    };

    return (
        <View>
            <View style={[colorPickerStyle.previewStyle, { backgroundColor: displayColor }]} />
            <Text style={colorPickerStyle.previewText}>{displayColor}</Text>

            <ColorPicker
                value={displayColor}
                onCompleteJS={handleColorChange}
                style={colorPickerStyle.picker}
            >
                <Panel2 style={colorPickerStyle.panelStyle} />
                <BrightnessSlider style={colorPickerStyle.sliderStyle} />
                <InputWidget inputStyle={colorPickerStyle.inputStyle} iconColor='#707070' />
            </ColorPicker>
        </View>
    );
}


const colorPickerStyle = StyleSheet.create({
    picker: {
        gap: 20,
    },
    panelStyle: {
        borderRadius: 16,
        height: 220,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sliderStyle: {
        marginTop: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    previewStyle: {
        height: 60,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    previewText: {
        fontSize: 12,
        color: '#707070',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '500',
    },
    inputStyle: {
        color: '#707070',
        paddingVertical: 2,
        borderColor: '#707070',
        fontSize: 12,
        marginLeft: 5,
    },
});
