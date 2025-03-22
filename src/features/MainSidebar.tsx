import { Sidebar } from '@/components/Sidebar';
import { settings$ } from '@/settings/SettingsFile';
import { getFolderName } from '@/systems/FileManager';
import { folders$ } from '@/systems/LibraryManager';
import { useObserveEffect, useSelector } from '@legendapp/state/react';
import React from 'react';

// Helper function to find the parent library path for a folder
function findParentLibraryPath(folder: string, libraryPaths: string[]): string | undefined {
  // Sort library paths by length (descending) to prioritize more specific paths
  const sortedPaths = [...libraryPaths].sort((a, b) => b.length - a.length);

  // Find the first library path that is a parent of the folder
  return sortedPaths.find((path) => {
    if (folder === path) return true;
    const normalizedFolder = folder.endsWith('/') ? folder.slice(0, -1) : folder;
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    return normalizedFolder.startsWith(`${normalizedPath}/`);
  });
}

// Helper function to get folder depth relative to its parent library path
function getRelativeDepth(folder: string, parentPath: string): number {
  if (folder === parentPath) return 0;

  const normalizedFolder = folder.endsWith('/') ? folder.slice(0, -1) : folder;
  const normalizedPath = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;

  // If the folder is not a child of the parent path, return 0
  if (!normalizedFolder.startsWith(`${normalizedPath}/`)) return 0;

  // Remove parent path from the folder path and count slashes
  const relativePath = normalizedFolder.slice(normalizedPath.length + 1);
  return relativePath.split('/').length - 1;
}

export function MainSidebar() {
  const selectedFolder = useSelector(settings$.state.openFolder);
  const folders = useSelector(folders$) || [];
  const sidebarWidth = useSelector(settings$.state.sidebarWidth);
  const libraryPaths = useSelector(settings$.library.paths);

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

  // Group folders by library path
  const foldersByLibrary: Record<string, Array<{ path: string; depth: number }>> = {};

  // Process each folder
  for (const folder of folders) {
    const parentPath = findParentLibraryPath(folder, libraryPaths);
    if (parentPath) {
      if (!foldersByLibrary[parentPath]) {
        foldersByLibrary[parentPath] = [];
      }

      const depth = getRelativeDepth(folder, parentPath);
      foldersByLibrary[parentPath].push({ path: folder, depth });
    }
  }

  // Transform into sidebar groups
  const sidebarGroups = Object.entries(foldersByLibrary)
    .filter(([_, items]) => items.length > 0)
    .map(([libraryPath, items]) => ({
      title: getFolderName(libraryPath),
      items: items.map(({ path, depth }) => ({
        id: path,
        label: getFolderName(path),
        indentLevel: depth,
      })),
    }));

  return (
    <Sidebar
      items={sidebarGroups}
      selectedItemId={selectedFolder || ''}
      onSelectItem={onSelectFolder}
      width={sidebarWidth}
      showGroups={true}
      className="pt-10"
    />
  );
}
