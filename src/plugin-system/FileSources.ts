import { getSourcePlugins } from '@/plugin-system/PluginManager';
import type { PhotoInfo } from '@/systems/FileManager';
import { observable } from '@legendapp/state';

// Observable for tracking the currently active source plugin ID
export const activeSourceId$ = observable<string | null>(null);

/**
 * Get all folders with photos from all enabled source plugins
 * @returns Promise with an array of absolute folder paths
 */
export async function getAllFolders(): Promise<string[]> {
  try {
    const sourcePlugins = getSourcePlugins();

    if (sourcePlugins.length === 0) {
      console.warn('No source plugins are registered or enabled');
      return [];
    }

    // Get folders from all source plugins
    const allFoldersArrays = await Promise.all(sourcePlugins.map((plugin) => plugin.getFolders()));

    // Flatten and sort the results
    return allFoldersArrays.flat().sort();
  } catch (error) {
    console.error('Error getting folders from source plugins:', error);
    return [];
  }
}

/**
 * Get photos in a specific folder from the appropriate source plugin
 * @param folderPath - Path to the folder
 * @returns Promise with an array of photo info objects
 */
export async function getPhotosInFolder(folderPath: string): Promise<PhotoInfo[]> {
  try {
    const sourcePlugins = getSourcePlugins();

    if (sourcePlugins.length === 0) {
      console.warn('No source plugins are registered or enabled');
      return [];
    }

    // If there's an active source specified, try to use that one first
    const activeSourceId = activeSourceId$.get();
    if (activeSourceId) {
      const activePlugin = sourcePlugins.find((plugin) => plugin.id === activeSourceId);
      if (activePlugin) {
        return await activePlugin.getPhotos(folderPath);
      }
    }

    // Otherwise, try all plugins until one returns photos
    for (const plugin of sourcePlugins) {
      const photos = await plugin.getPhotos(folderPath);
      if (photos.length > 0) {
        return photos;
      }
    }

    return [];
  } catch (error) {
    console.error('Error getting photos from source plugins:', error);
    return [];
  }
}

/**
 * Set the active source plugin
 * @param sourceId - ID of the source plugin to set as active
 */
export function setActiveSource(sourceId: string | null): void {
  activeSourceId$.set(sourceId);
}
