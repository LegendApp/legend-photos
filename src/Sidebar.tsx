import { observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import React from 'react';
import { Animated, PlatformColor, View, useColorScheme } from 'react-native';
import { listFoldersWithPhotosRecursive } from './FileManager';
import { SidebarButton } from './SidebarButton';
import { state$ } from './State';

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
  const isSelected = selectedFile === file;

  return (
    <SidebarButton
      label={file}
      isSelected={isSelected}
      isDarkMode={isDarkMode}
      onPress={() => onFileSelect(file)}
    />
  );
}

const files$ = observable(listFoldersWithPhotosRecursive);

function Sidebar({ onFileSelect, selectedFile }: SidebarProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const files = useSelector(files$);
  const sidebarWidth = useSelector(state$.sidebarWidth);

  return (
    <Animated.View
      className="h-full pt-6 border-r border-r-[#333]"
      style={{
        width: sidebarWidth,
        backgroundColor: PlatformColor('SystemControlAcrylicWindowBrush'),
      }}
    >
      <View className="flex-1 py-2">
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
    </Animated.View>
  );
}

export default Sidebar;
