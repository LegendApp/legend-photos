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
import { appView } from '@/systems/State';
import { initializeUpdater } from '@/systems/Updater';
import { HookKeyboard } from '@/systems/keyboard/HookKeyboard';
import { ThemeProvider } from '@/theme/ThemeProvider';
import Aptabase from '@aptabase/react-native';
import { APTABASE_KEY } from '@env';
import { HookWindowDimensions, windowDimensions$ } from '@legend-kit/react-native/windowDimensions';
import { useMountOnce, useSelector } from '@legendapp/state/react';
import type React from 'react';
import { useEffect } from 'react';
import { AppState, Platform, View } from 'react-native';
import { version } from '../package.json';

Aptabase.init(APTABASE_KEY, {
  appVersion: version,
});

registerDefaultPlugins();
initializeUpdater();
initializeMenuManager();

function App(): React.JSX.Element {
  const settingsLoaded = useSelector(isSettingsLoaded$);

  useMountOnce(() => {
    Aptabase.trackEvent('loaded');
  });

  return (
    <ThemeProvider>
      <View
        className="flex-1 bg-background-primary"
        ref={(r) => {
          appView.current = r;
        }}
      >
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
      </View>
    </ThemeProvider>
  );
}

export default App;
