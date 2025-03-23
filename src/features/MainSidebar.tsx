import { Sidebar } from '@/components/Sidebar';
import { type FolderInfo, folderInfoToId, getOpenFolder } from '@/plugin-system/FileSources';
import { settings$ } from '@/settings/SettingsFile';
import { getFolderName } from '@/systems/FileManager';
import { allFolders$ } from '@/systems/FoldersManager';
import { useObserveEffect, useSelector } from '@legendapp/state/react';
import React from 'react';

// Helper function to find the parent library path for a folder
function findParentLibraryPath(folderPath: string, libraryPaths: string[]): string | undefined {
  // Sort library paths by length (descending) to prioritize more specific paths
  const sortedPaths = [...libraryPaths].sort((a, b) => b.length - a.length);

  // Find the first library path that is a parent of the folder
  return sortedPaths.find((path) => {
    if (folderPath === path) {
      return true;
    }

    const normalizedFolder = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    return normalizedFolder.startsWith(`${normalizedPath}/`);
  });
}

// Helper function to get folder depth relative to its parent library path
function getRelativeDepth(folderPath: string, parentPath: string): number {
  if (folderPath === parentPath) {
    return 0;
  }

  const normalizedFolder = folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath;
  const normalizedPath = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;

  // If the folder is not a child of the parent path, return 0
  if (!normalizedFolder.startsWith(`${normalizedPath}/`)) {
    return 0;
  }

  // Remove parent path from the folder path and count slashes
  const relativePath = normalizedFolder.slice(normalizedPath.length + 1);
  return relativePath.split('/').length - 1;
}

export function MainSidebar() {
  const selectedFolderId = useSelector(settings$.state.openFolder);
  const folders = useSelector(allFolders$) || [];
  const sidebarWidth = useSelector(settings$.state.sidebarWidth);
  const libraryPaths = useSelector(settings$.library.paths);

  const onSelectFolder = (folderId: string) => {
    settings$.state.openFolder.set(folderId);
  };

  useObserveEffect((e) => {
    if (!selectedFolderId) {
      const openFolder = getOpenFolder();
      if (openFolder) {
        const folderId = folderInfoToId(openFolder);
        onSelectFolder(folderId);
        e.cancel = true;
      } else {
        const allFolders = allFolders$.get();
        if (allFolders?.length) {
          console.log('selecting first folder');
          const firstFolderId = folderInfoToId(allFolders[0]);
          onSelectFolder(firstFolderId);
          e.cancel = true;
        }
      }
    }
  });

  // Group folders by library path
  const foldersByLibrary: Record<string, Array<{ folderInfo: FolderInfo; depth: number }>> = {};

  // Process each folder
  for (const folderInfo of folders) {
    const parentPath = findParentLibraryPath(folderInfo.path, libraryPaths);
    if (parentPath) {
      if (!foldersByLibrary[parentPath]) {
        foldersByLibrary[parentPath] = [];
      }

      const depth = getRelativeDepth(folderInfo.path, parentPath);
      foldersByLibrary[parentPath].push({ folderInfo, depth });
    }
  }

  // Transform into sidebar groups
  const sidebarGroups = Object.entries(foldersByLibrary)
    .filter(([_, items]) => items.length > 0)
    .map(([libraryPath, items]) => ({
      title: getFolderName(libraryPath),
      items: items.map(({ folderInfo, depth }) => ({
        id: folderInfoToId(folderInfo),
        label: getFolderName(folderInfo.path),
        indentLevel: depth,
      })),
    }));

  return (
    <Sidebar
      items={sidebarGroups}
      selectedItemId={selectedFolderId || ''}
      onSelectItem={onSelectFolder}
      width={sidebarWidth}
      showGroups={true}
      className="pt-10"
    />
  );
}
