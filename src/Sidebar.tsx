import { observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import React from 'react';
import { PlatformColor, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { listFoldersWithPhotosRecursive } from './FileManager';
import { sidebarWidth$ } from './State';

interface SidebarProps {
  onFileSelect: (fileName: string) => void;
  selectedFile: string | undefined;
}

function File({
  file,
  isDarkMode,
  selectedFile,
  onFileSelect,
}: {
  file: string;
  isDarkMode: boolean;
  selectedFile: string | undefined;
  onFileSelect: (file: string) => void;
}) {
  return (
    <Pressable
      style={[styles.fileItem, selectedFile === file && styles.selectedFileItem]}
      onPress={() => onFileSelect(file)}
    >
      <Text
        style={[
          styles.fileText,
          {
            color:
              selectedFile === file ? (isDarkMode ? '#fff' : '#333') : isDarkMode ? '#bbb' : '#333',
          },
          selectedFile === file && styles.selectedFileText,
        ]}
      >
        {file}
      </Text>
    </Pressable>
  );
}

const files$ = observable(listFoldersWithPhotosRecursive);

function Sidebar({ onFileSelect, selectedFile }: SidebarProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const files = useSelector(files$);
  const sidebarWidth = useSelector(sidebarWidth$);

  return (
    <View style={[styles.container, { width: sidebarWidth }]}>
      <View style={styles.fileList}>
        {files?.map((file) => (
          <File
            key={file}
            file={file}
            isDarkMode={isDarkMode}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width is now controlled by sidebarWidth$ observable
    // borderRightWidth: 1,
    // borderRightColor: 'rgba(0,0,0,0.1)',
    height: '100%',
    backgroundColor: PlatformColor('SystemControlAcrylicWindowBrush'),
    paddingTop: 24,
  },
  fileList: {
    flex: 1,
    paddingVertical: 8,
  },
  fileItem: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    // marginBottom: 4,
  },
  selectedFileItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  fileText: {
    fontSize: 14,
  },
  selectedFileText: {
    // fontWeight: 'bold',
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
    padding: 10,
  },
  errorMessage: {
    textAlign: 'center',
    padding: 10,
  },
});

export default Sidebar;
