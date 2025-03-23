import { getAllFolders, getOpenFolder, getPhotosInFolder } from '@/plugin-system/FileSources';
import { registerPlugin } from '@/plugin-system/PluginManager';
import { PluginLocalFiles } from '@/plugins/PluginLocalFiles';
import { settings$ } from '@/settings/SettingsFile';
import { state$ } from '@/systems/State';
import { observable, observe } from '@legendapp/state';

// Register local files plugin when this module is imported
registerPlugin(PluginLocalFiles);

// Observable for all folders from all source plugins
export const allFolders$ = observable(async () => {
  return await getAllFolders();
});

// When the open folder changes, update the photos list
observe(async () => {
  const folder = getOpenFolder();
  if (!folder) {
    state$.photos.set([]);
    return;
  }

  // Temporary workaround for scrolling bug
  state$.openingFolder.set(true);

  try {
    const photosList = await getPhotosInFolder(folder);
    state$.photos.set(photosList);
  } catch (err) {
    console.error('Error loading photos:', err);
  } finally {
    state$.openingFolder.set(false);
  }
});

/**
 * Selects a folder to view
 * @param folderPath The path of the folder to open
 */
export function openFolder(folderPath: string): void {
  settings$.state.openFolder.set(folderPath);

  // Make sure sidebar is open
  if (!settings$.state.isSidebarOpen.get()) {
    settings$.state.isSidebarOpen.set(true);
  }
}
