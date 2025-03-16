import { useMount, useSelector } from '@legendapp/state/react';
import type React from 'react';
import { SafeAreaView, View } from 'react-native';
import '../global.css';
import { FullscreenPhoto } from './FullscreenPhoto';
import { HookWindowDimensions } from './HookWindowDimensions';
import { useHookKeyboard } from './Keyboard';
import { initializeMetadata } from './PhotoMetadata';
import { PhotosViewContainer } from './PhotosViewContainer';
import Sidebar from './Sidebar';
import { state$ } from './State';
import { StoplightEnforcer } from './StoplightEnforcer';
import { PluginRenderer } from './plugins';
import { initializePluginSystem } from './plugins/initPlugins';

function App(): React.JSX.Element {
  useHookKeyboard();

  const selectedFolder = useSelector(state$.selectedFolder);

  // Initialize metadata system and plugins on app start
  useMount(() => {
    // Initialize metadata
    initializeMetadata().catch((error) => {
      console.error('Failed to initialize metadata:', error);
    });

    // Initialize plugin system
    initializePluginSystem();
  });

  const handleFileSelect = (file: string) => {
    state$.selectedFolder.set(file);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-row">
        <Sidebar onFileSelect={handleFileSelect} selectedFile={selectedFolder || undefined} />
        <PhotosViewContainer />
        <PluginRenderer location="root" className="absolute bottom-4 right-4" />
      </View>
      <FullscreenPhoto />
      <HookWindowDimensions />
      <StoplightEnforcer />
    </SafeAreaView>
  );
}

export default App;
