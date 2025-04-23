import type { LoaderPlugin } from '@/plugin-system/PluginTypes';
import { additionalExtensions$ } from '@/systems/FileManager';

// Raw file extensions to support
const RAW_FILE_EXTENSIONS = ['.cr2', '.raf'];

export const PluginRawFiles: LoaderPlugin = {
  id: 'plugin-raw-files',
  name: 'RAW Files Support',
  description: 'Adds support for RAW image formats like Canon CR2 and Fuji RAF',
  version: '1.0.0',
  enabled: true,
  type: 'loader',
  supportedExtensions: RAW_FILE_EXTENSIONS,

  initialize: async () => {
    // Add our supported extensions to the global list
    additionalExtensions$.set([...additionalExtensions$.get(), ...RAW_FILE_EXTENSIONS]);
    console.log('RAW files plugin initialized with extensions:', RAW_FILE_EXTENSIONS);
  },
};
