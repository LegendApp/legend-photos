/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import { Settings } from './src/settings/Settings';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('SettingsWindow', () => Settings);
