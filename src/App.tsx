import '@/../global.css';
import { FullscreenPhoto } from '@/features/FullscreenPhoto';
import { HotkeyHelp } from '@/features/HotkeyHelp';
import { MainSidebar } from '@/features/MainSidebar';
import { PhotosViewContainer } from '@/features/PhotosViewContainer';
import { TitleBar } from '@/features/TitleBar';
import { PluginRenderer, registerDefaultPlugins } from '@/plugin-system/registerDefaultPlugins';
import { isSettingsLoaded$ } from '@/settings/SettingsFile';
import { SettingsWindowManager } from '@/settings/SettingsWindowManager';
import { initializeMenuManager } from '@/systems/MenuManager';
import { initializeUpdater } from '@/systems/Updater';
import { HookKeyboard } from '@/systems/keyboard/HookKeyboard';
import { HookWindowDimensions, windowDimensions$ } from '@legend-kit/react-native/windowDimensions';
import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { SafeAreaView, View } from 'react-native';

registerDefaultPlugins();
initializeUpdater();
initializeMenuManager();

function App(): React.JSX.Element {
  const settingsLoaded = useSelector(isSettingsLoaded$);

  return (
    <SafeAreaView className="flex-1 bg-[#111]">
      <View className="flex-1 flex-row">
        <MainSidebar />
        {settingsLoaded && <PhotosViewContainer />}
        <PluginRenderer location="root" className="absolute bottom-4 right-4" />
      </View>
      <FullscreenPhoto />
      <HookWindowDimensions windowDimensions$={windowDimensions$} />
      <HookKeyboard />
      <TitleBar />
      <SettingsWindowManager />
      <HotkeyHelp />
      {/* <PhotoKitExample /> */}
    </SafeAreaView>
  );
}

export default App;
