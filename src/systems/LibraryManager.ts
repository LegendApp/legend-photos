import { batch, event, observable, observe, when } from '@legendapp/state';
import * as FileSystemWatcher from '../native-modules/FileSystemWatcher';
import { settings$ } from '../settings/SettingsFile';
import { timeoutOnce } from '../utils/timeoutOnce';
import {
  listFoldersWithPhotosRecursive,
  listPhotosInFolder,
  scanFolderRecursive,
} from './FileManager';
import { state$ } from './State';

export async function addLibraryPath(path: string) {
  const childFolders = await scanFolderRecursive(path);
  if (childFolders.length > 0) {
    batch(() => {
      const currentPaths = settings$.library.paths.get();
      if (!currentPaths.includes(path)) {
        settings$.library.paths.push(path);
      }
      // Set the selected folder as the open folder
      if (!settings$.state.openFolder.get()) {
        settings$.state.openFolder.set(childFolders[0]);
      }
      if (!settings$.state.isSidebarOpen.get()) {
        // Open the sidebar if it's closed
        settings$.state.isSidebarOpen.set(true);
      }
    });
  } else {
    // TODO: Error handling, this folder has no child folders with photos
  }
}

const eventFolderChange = event();

export const folders$ = observable(async () => {
  // When filesystem watcher detects a change, update the folders list
  eventFolderChange.get();

  const folders = await listFoldersWithPhotosRecursive();

  return folders;
});

// Set up file system watcher
export function initializeFileSystemWatcher() {
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

// Initialize the file system watcher when the library paths are set
when(
  () => settings$.library.paths.get().length > 0,
  () => {
    initializeFileSystemWatcher();
    settings$.library.paths.onChange(({ value }) => {
      // Update the watched directories
      FileSystemWatcher.setWatchedDirectories(value);
    });
  }
);

// Observe the open folder and update the photos list when it changes
observe(async () => {
  const folder = settings$.state.openFolder.get();
  if (!folder) {
    state$.photos.set([]);
    return;
  }

  // TODO: This is a temporary workaround for a bug where changing the photos
  // immediately would scroll to -28. Need to investigate why that was happenign.
  state$.openingFolder.set(true);

  // When filesystem watcher detects a change, update the photos list
  eventFolderChange.get();

  try {
    const photosList = await listPhotosInFolder(folder);
    state$.photos.set(photosList);
  } catch (err) {
    console.error('Error loading photos:', err);
  } finally {
    state$.openingFolder.set(false);
  }
});
