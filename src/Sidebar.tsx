import { observable } from '@legendapp/state';
import { useObserveEffect, useSelector } from '@legendapp/state/react';
import React from 'react';
import { Animated, PlatformColor, Text, View, useColorScheme } from 'react-native';
import { getFolderName, listFoldersWithPhotosRecursive } from './FileManager';
import { SidebarButton } from './SidebarButton';
import { settings$ } from './settings/SettingsFile';

function Folder({
  file,
  isDarkMode,
  selectedFolder,
  onSelectFolder,
}: {
  file: string;
  isDarkMode: boolean;
  selectedFolder: string | undefined | null;
  onSelectFolder: (file: string) => void;
}) {
  const isSelected = selectedFolder === file;
  const displayName = getFolderName(file);

  return (
    <SidebarButton
      label={displayName}
      isSelected={isSelected}
      isDarkMode={isDarkMode}
      onPress={() => onSelectFolder(file)}
    />
  );
}

// Helper function to get parent directory path
function getParentPath(filePath: string): string {
  // Handle trailing slash
  const normalizedPath = filePath.endsWith('/') ? filePath.slice(0, -1) : filePath;
  const lastSlashIndex = normalizedPath.lastIndexOf('/');
  return lastSlashIndex !== -1 ? normalizedPath.substring(0, lastSlashIndex) : '';
}

// Helper function to group folders by parent path
function groupFoldersByParent(folders: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const folder of folders) {
    const parentPath = getParentPath(folder);
    if (!grouped[parentPath]) {
      grouped[parentPath] = [];
    }
    grouped[parentPath].push(folder);
  }

  return grouped;
}

const folders$ = observable(listFoldersWithPhotosRecursive);

function Sidebar() {
  const isDarkMode = useColorScheme() === 'dark';
  const selectedFolder = useSelector(settings$.state.openFolder);
  const folders = useSelector(folders$) || [];
  const sidebarWidth = useSelector(settings$.state.sidebarWidth);

  const onSelectFolder = (folder: string) => {
    settings$.state.openFolder.set(folder);
  };

  useObserveEffect((e) => {
    if (!selectedFolder) {
      const openFolder = settings$.state.openFolder.get();
      if (openFolder) {
        onSelectFolder(openFolder);
        e.cancel = true;
      } else if (folders$.get()?.length) {
        console.log('selecting first folder');
        onSelectFolder(folders$.get()[0]);
        e.cancel = true;
      }
    }
  });

  // Group folders by parent path
  const groupedFolders = groupFoldersByParent(folders);

  return (
    <Animated.View
      className="h-full pt-6 border-r border-r-[#333]"
      style={{
        width: sidebarWidth,
        backgroundColor: PlatformColor('SystemControlAcrylicWindowBrush'),
      }}
    >
      <View className="flex-1 py-2">
        {Object.entries(groupedFolders).map(([parentPath, folderGroup]) => (
          <View key={parentPath} className="mb-2">
            <Text
              className={`px-3 py-1 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {getFolderName(parentPath)}
            </Text>
            {folderGroup.map((file) => (
              <Folder
                key={file}
                file={file}
                isDarkMode={isDarkMode}
                selectedFolder={selectedFolder}
                onSelectFolder={onSelectFolder}
              />
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default Sidebar;
