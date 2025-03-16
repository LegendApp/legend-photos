import '../global.css';
import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { SafeAreaView, View } from 'react-native';
import { FullscreenPhoto } from './FullscreenPhoto';
import { HookWindowDimensions } from './HookWindowDimensions';
import { useHookKeyboard } from './Keyboard';
import { PhotosViewContainer } from './PhotosViewContainer';
import Sidebar from './Sidebar';
import { state$ } from './State';
import { StoplightEnforcer } from './StoplightEnforcer';

function App(): React.JSX.Element {
  useHookKeyboard();

  const selectedFolder = useSelector(state$.selectedFolder);

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
