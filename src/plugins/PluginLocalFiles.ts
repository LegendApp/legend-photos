import type { SourcePlugin } from '@/plugin-system/PluginTypes';
import { settings$ } from '@/settings/SettingsFile';
import { listFoldersWithPhotosRecursive, listPhotosInFolder } from '@/systems/FileManager';

export const PluginLocalFiles: SourcePlugin = {
  id: 'plugin-local-files',
  name: 'Local Files',
  description: 'Access photos from your local file system',
  version: '1.0.0',
  enabled: true,
  type: 'source',

  // Get a list of all folders with photos
  async getFolders(): Promise<string[]> {
    try {
      return await listFoldersWithPhotosRecursive();
    } catch (error) {
      console.error('Error listing folders in LocalFiles plugin:', error);
      return [];
    }
  },

  // Get photos from a specific folder
  async getPhotos(folderPath: string) {
    try {
      return await listPhotosInFolder(folderPath);
    } catch (error) {
      console.error('Error listing photos in LocalFiles plugin:', error);
      return [];
    }
  },

  // Settings for the plugin
  settings: {
    paths: settings$.library.paths,
  },
};
