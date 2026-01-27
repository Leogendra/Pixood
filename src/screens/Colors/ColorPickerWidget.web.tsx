import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { HexColorPicker } from 'react-colorful';

export interface ColorPickerWidgetProps {
  visible: boolean;
  initial: string;
  onSelect: (hex: string) => void;
  onCancel: () => void;
}

export default function ColorPickerWidget({ visible, initial, onSelect, onCancel }: ColorPickerWidgetProps) {
  const [color, setColor] = React.useState<string>(initial || '#FFFFFF');

  React.useEffect(() => {
    setColor(initial);
  }, [initial]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: '#00000080', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 }}>
          <Text style={{ color: '#111', fontWeight: '600', fontSize: 16, marginBottom: 12 }}>Choose a color</Text>
          <View style={{ backgroundColor: '#fff' }}>
            <HexColorPicker color={color} onChange={setColor} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={{ color: '#111' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSelect(color)}>
              <Text style={{ color: '#111', fontWeight: '600' }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
