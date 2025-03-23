import { syncState } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { SafeAreaView, View } from 'react-native';
import '@/../global.css';
import { FullscreenPhoto } from '@/features/FullscreenPhoto';
import { HotkeyHelp } from '@/features/HotkeyHelp';
import { MainSidebar } from '@/features/MainSidebar';
import { PhotosViewContainer } from '@/features/PhotosViewContainer';
import { TitleBar } from '@/features/TitleBar';
import { PluginRenderer, registerDefaultPlugins } from '@/plugin-system/registerDefaultPlugins';
import { PhotoKitExample } from '@/plugins/PhotoKitExample';
import { settings$ } from '@/settings/SettingsFile';
import { SettingsWindow } from '@/settings/SettingsWindow';
import { initializeUpdater } from '@/systems/Updater';
import { HookKeyboard } from '@/systems/keyboard/HookKeyboard';
import { HookWindowDimensions, windowDimensions$ } from '@legend-kit/react-native/windowDimensions';

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
      <PhotoKitExample />
    </SafeAreaView>
  );
}

export default App;
