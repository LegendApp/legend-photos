import { observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import React from 'react';
import { Animated, PlatformColor, Pressable, Text, View, useColorScheme } from 'react-native';
import { listFoldersWithPhotosRecursive } from './FileManager';
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
  const textColor = isSelected
    ? isDarkMode
      ? 'text-white'
      : 'text-[#333]'
    : isDarkMode
      ? 'text-[#bbb]'
      : 'text-[#333]';

  return (
    <Pressable
      className={`px-2 py-2 rounded-md mx-1 ${isSelected ? 'bg-white/10' : ''}`}
      onPress={() => onFileSelect(file)}
    >
      <Text className={`text-sm ${textColor}`}>{file}</Text>
    </Pressable>
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
