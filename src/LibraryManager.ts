import { batch } from '@legendapp/state';
import { scanFolderRecursive } from './FileManager';
import { settings$ } from './settings/SettingsFile';

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
