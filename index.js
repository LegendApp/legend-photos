/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from '@/App';
import { SettingsContainer } from '@/settings/SettingsContainer';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('SettingsWindow', () => SettingsContainer);
