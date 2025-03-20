import { syncState } from '@legendapp/state';
import { useMount, useSelector } from '@legendapp/state/react';
import type React from 'react';
import { SafeAreaView, View } from 'react-native';
import '../global.css';
import { FullscreenPhoto } from './FullscreenPhoto';
import { HookKeyboard } from './HookKeyboard';
import { HookWindowDimensions } from './HookWindowDimensions';
import { HotkeyHelp } from './HotkeyHelp';
import { MainSidebar } from './MainSidebar';
import { PhotosViewContainer } from './PhotosViewContainer';
import { TitleBar } from './TitleBar';
import { PluginRenderer } from './plugins';
import { initializePluginSystem } from './plugins/initPlugins';
import { settings$ } from './settings/SettingsFile';
import { SettingsWindow } from './settings/SettingsWindow';

function App(): React.JSX.Element {
  const settingsLoaded = useSelector(() => !!syncState(settings$).isPersistLoaded.get());

  // Initialize metadata system and plugins on app start
  useMount(() => {
    // Initialize plugin system
    initializePluginSystem();
  });

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-row">
        <MainSidebar />
        {settingsLoaded && <PhotosViewContainer />}
        <PluginRenderer location="root" className="absolute bottom-4 right-4" />
      </View>
      <FullscreenPhoto />
      <HookWindowDimensions />
      <HookKeyboard />
      <TitleBar />
      <SettingsWindow />
      <HotkeyHelp />
    </SafeAreaView>
  );
}

export default App;
