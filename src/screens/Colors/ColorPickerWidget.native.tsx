import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

export interface ColorPickerWidgetProps {
  visible: boolean;
  initial: string;
  onSelect: (hex: string) => void;
  onCancel: () => void;
}

const COMMON_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#008080', '#808000', '#C0C0C0', '#A52A2A',
  '#ADD8E6'
];

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
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {COMMON_COLORS.map((c) => (
              <TouchableOpacity key={c} onPress={() => setColor(c)} style={{
                width: 40,
                height: 40,
                margin: 6,
                borderRadius: 8,
                backgroundColor: c,
                borderWidth: 1,
                borderColor: '#ddd'
              }} />
            ))}
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
