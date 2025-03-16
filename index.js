/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import SecondaryWindow from './src/SecondaryWindow';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('SecondaryWindow', () => SecondaryWindow);
