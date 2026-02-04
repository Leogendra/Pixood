import { ExpoConfig, ConfigContext } from '@expo/config';
import _ from 'lodash';




const CONFIG = require('./app.json')

export default ({ config }: ConfigContext): ExpoConfig => {
    const _config: ExpoConfig = { ...CONFIG.expo };

    const PROFILE = process.env.PROFILE || 'development';
    const isDevClient = process.env.DEV_CLIENT === 'true';

    if (isDevClient) {
        _config.name = 'Pixood Dev';
        _config.ios!.bundleIdentifier = `com.gatienh.pixood.dev`
        _config.android!.package = `com.gatienh.pixood.dev`
        _config.android!.icon = _config.icon = './assets/images/icon-dev.png';
    }

    return _config;
};