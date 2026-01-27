import { Platform } from 'react-native';

// Bridge to platform-specific implementations
let Impl: any;
if (Platform.OS === 'web') {
  Impl = require('./ColorPickerWidget.web').default;
} else {
  Impl = require('./ColorPickerWidget.native').default;
}

export default Impl;
