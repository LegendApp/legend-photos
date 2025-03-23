import * as FileSystemWatcher from '@/native-modules/FileSystemWatcher';
import type { SourcePlugin } from '@/plugin-system/PluginTypes';
import { settings$ } from '@/settings/SettingsFile';
import {
  listFoldersWithPhotosRecursive,
  listPhotosInFolder,
  scanFolderRecursive,
} from '@/systems/FileManager';
import { timeoutOnce } from '@/utils/timeoutOnce';
import { event, observable, observe } from '@legendapp/state';

// Event for folder changes detected by file system watcher
export const eventFolderChange = event();

// Initialize file system watcher
function initializeFileSystemWatcher() {
  const paths = settings$.library.paths.get();
  if (paths.length > 0) {
    FileSystemWatcher.setWatchedDirectories(paths);
    FileSystemWatcher.addChangeListener(() => {
      timeoutOnce(
        'updateFolders',
        () => {
          eventFolderChange.fire();
        },
        100
      );
    });
  }
}

// Initialize watcher when plugin is loaded
initializeFileSystemWatcher();

// Listen for changes to library paths
settings$.library.paths.onChange(({ value }) => {
  // Update the watched directories
  FileSystemWatcher.setWatchedDirectories(value);
});

const folders$ = observable<string[]>([]);

observe(async () => {
  try {
    // Use the folder change event to trigger refresh
    eventFolderChange.get();
    const libraryPaths = settings$.library.paths.get();

    if (libraryPaths.length > 0) {
      const ret = await listFoldersWithPhotosRecursive(libraryPaths);

      folders$.set(ret);
    }
  } catch (error) {
    console.error('Error listing folders in LocalFiles plugin:', error);
  }
  return [];
});

folders$.get();

export const PluginLocalFiles: SourcePlugin = {
  id: 'plugin-local-files',
  name: 'Local Files',
  description: 'Access photos from your local file system',
  version: '1.0.0',
  enabled: true,
  type: 'source',

  // Get a list of all folders with photos
  getFolders: () => {
    return folders$.get() || [];
  },

  // Get photos from a specific folder
  async getPhotos(folderPath: string) {
    try {
      // Use the folder change event to trigger refresh
      eventFolderChange.get();
      return await listPhotosInFolder(folderPath);
    } catch (error) {
      console.error('Error listing photos in LocalFiles plugin:', error);
      return [];
    }
  },

  // Add a path to the library
};

export async function addLibraryPath(path: string): Promise<boolean> {
  try {
    const childFolders = await scanFolderRecursive(path);
    if (childFolders.length > 0) {
      const currentPaths = settings$.library.paths.get();
      if (!currentPaths.includes(path)) {
        settings$.library.paths.push(path);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding library path:', error);
    return false;
  }
}
