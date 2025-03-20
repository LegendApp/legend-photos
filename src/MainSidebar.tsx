import { observable } from '@legendapp/state';
import { useObserveEffect, useSelector } from '@legendapp/state/react';
import React from 'react';
import { getFolderName, listFoldersWithPhotosRecursive } from './FileManager';
import { Sidebar } from './Sidebar';
import { settings$ } from './settings/SettingsFile';

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

export function MainSidebar() {
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

  // Transform groupedFolders into the format expected by Sidebar
  const sidebarGroups = Object.entries(groupedFolders).map(([parentPath, folderPaths]) => ({
    title: getFolderName(parentPath),
    items: folderPaths.map((path) => ({
      id: path,
      label: getFolderName(path),
    })),
  }));

  return (
    <Sidebar
      items={sidebarGroups}
      selectedItemId={selectedFolder || ''}
      onSelectItem={onSelectFolder}
      width={sidebarWidth}
      showGroups={true}
    />
  );
}
