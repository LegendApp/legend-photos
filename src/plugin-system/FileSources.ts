import { getSourcePlugins } from '@/plugin-system/PluginManager';
import { settings$ } from '@/settings/SettingsFile';
import type { PhotoInfo } from '@/systems/FileManager';

// Define the folder info interface
export interface FolderInfo {
  path: string;
  source: string;
}

/**
 * Convert FolderInfo to a string ID in format "source:path"
 */
export function folderInfoToId(info: FolderInfo): string {
  return `${info.source}:${info.path}`;
}

/**
 * Parse a folder ID string back to FolderInfo
 */
export function parseFolderId(id: string): FolderInfo {
  const [source, ...pathParts] = id.split(':');
  return {
    source,
    path: pathParts.join(':'), // Rejoin in case path contains colons
  };
}

/**
 * Get all folders with photos from all enabled source plugins
 * @returns Promise with an array of folder info objects
 */
export async function getAllFolders(): Promise<FolderInfo[]> {
  try {
    const sourcePlugins = getSourcePlugins();

    if (sourcePlugins.length === 0) {
      console.warn('No source plugins are registered or enabled');
      return [];
    }

    // Get folders from all source plugins with their source IDs
    const results = sourcePlugins.map((plugin) => {
      const folders = plugin.getFolders();
      // Map each folder path to an object with path and source
      return folders.map((path) => ({
        path,
        source: plugin.id,
      }));
    });

    // Flatten and sort the results by path
    return results.flat().sort((a, b) => a.path.localeCompare(b.path));
  } catch (error) {
    console.error('Error getting folders from source plugins:', error);
    return [];
  }
}

/**
 * Get photos in a specific folder
 * @param folderId - The folder ID string in format "source:path"
 * @returns Promise with an array of photo info objects
 */
export async function getPhotosInFolder(folder: FolderInfo): Promise<PhotoInfo[]> {
  try {
    const { source, path } = folder;
    const sourcePlugins = getSourcePlugins();

    if (sourcePlugins.length === 0) {
      console.warn('No source plugins are registered or enabled');
      return [];
    }

    // Try to use the specified source plugin
    if (source) {
      const plugin = sourcePlugins.find((p) => p.id === source);
      if (plugin) {
        return await plugin.getPhotos(path);
      }
    }

    // If source plugin not found or specified, try all plugins
    for (const plugin of sourcePlugins) {
      const photos = await plugin.getPhotos(path);
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
 * Get the currently open folder as a FolderInfo object
 * @returns The folder info, or null if no folder is open
 */
export function getOpenFolder(): FolderInfo | null {
  const folderId = settings$.state.openFolder.get();
  if (!folderId) return null;
  return parseFolderId(folderId);
}
