import '../global.css';
import { useMount, useSelector } from '@legendapp/state/react';
import type React from 'react';
import { useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { FullscreenPhoto } from './FullscreenPhoto';
import { HookWindowDimensions } from './HookWindowDimensions';
import { useHookKeyboard } from './Keyboard';
import { initializeMetadata } from './PhotoMetadata';
import { PhotosViewContainer } from './PhotosViewContainer';
import Sidebar from './Sidebar';
import { state$ } from './State';
import { StoplightEnforcer } from './StoplightEnforcer';

function App(): React.JSX.Element {
  useHookKeyboard();

  const selectedFolder = useSelector(state$.selectedFolder);

  // Initialize metadata system on app start
  useMount(() => {
    initializeMetadata().catch((error) => {
      console.error('Failed to initialize metadata:', error);
    });
  });

  const handleFileSelect = (file: string) => {
    state$.selectedFolder.set(file);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-row">
        <Sidebar onFileSelect={handleFileSelect} selectedFile={selectedFolder || undefined} />
        <PhotosViewContainer />
      </View>
      <FullscreenPhoto />
      <HookWindowDimensions />
      <StoplightEnforcer />
    </SafeAreaView>
  );
}

export default App;
