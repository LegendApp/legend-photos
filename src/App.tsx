import { syncState } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { SafeAreaView, View } from 'react-native';
import '../global.css';
import { HookWindowDimensions, windowDimensions$ } from '@legend-kit/react-native/windowDimensions';
import { FullscreenPhoto } from './FullscreenPhoto';
import { HookKeyboard } from './HookKeyboard';
import { HotkeyHelp } from './HotkeyHelp';
import { MainSidebar } from './MainSidebar';
import { PhotosViewContainer } from './PhotosViewContainer';
import { TitleBar } from './TitleBar';
import { initializeUpdater } from './Updater';
import { PluginRenderer, registerDefaultPlugins } from './plugin-system/registerDefaultPlugins';
import { settings$ } from './settings/SettingsFile';
import { SettingsWindow } from './settings/SettingsWindow';

registerDefaultPlugins();
initializeUpdater();

function App(): React.JSX.Element {
  const settingsLoaded = useSelector(() => !!syncState(settings$).isPersistLoaded.get());

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-row">
        <MainSidebar />
        {settingsLoaded && <PhotosViewContainer />}
        <PluginRenderer location="root" className="absolute bottom-4 right-4" />
      </View>
      <FullscreenPhoto />
      <HookWindowDimensions windowDimensions$={windowDimensions$} />
      <HookKeyboard />
      <TitleBar />
      <SettingsWindow />
      <HotkeyHelp />
    </SafeAreaView>
  );
}

export default App;
