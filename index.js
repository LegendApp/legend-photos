/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from '@/App';
import { Settings } from '@/settings/Settings';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('SettingsWindow', () => Settings);
