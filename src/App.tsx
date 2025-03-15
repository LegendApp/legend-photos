import { observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { PlatformColor, SafeAreaView, StyleSheet, View } from 'react-native';
import { FullscreenPhoto } from './FullscreenPhoto';
import { HookWindowDimensions } from './HookWindowDimensions';
import { PhotosView } from './PhotosView';
import Sidebar from './Sidebar';

const selectedFolder$ = observable<string>('');

function App(): React.JSX.Element {
  const selectedFolder = useSelector(selectedFolder$);

  const handleFileSelect = (file: string) => {
    selectedFolder$.set(file);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Sidebar onFileSelect={handleFileSelect} selectedFile={selectedFolder || undefined} />

        <View style={styles.mainContent}>
          <PhotosView selectedFolder={selectedFolder} />
        </View>
      </View>
      <FullscreenPhoto />

      <HookWindowDimensions />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // Use PlatformColor for system-specific colors that adapt to theme changes
    // backgroundColor: PlatformColor('SystemBackgroundColor'),
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  documentContainer: {
    flex: 1,
    padding: 10,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  fileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PlatformColor('SystemLabelColor'),
  },
  loadingText: {
    fontSize: 12,
    marginLeft: 10,
    color: PlatformColor('SystemSecondaryLabelColor'),
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: PlatformColor('SystemSecondaryLabelColor'),
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default App;
