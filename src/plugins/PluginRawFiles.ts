import { ExifTool } from '@/native-modules/ExifTool';
import type { LoaderPlugin } from '@/plugin-system/PluginTypes';
import { additionalExtensions$ } from '@/systems/FileManager';
import {
  DocumentDirectoryPath,
  downloadFile,
  exists,
  mkdir,
  unlink,
} from '@dr.pogodin/react-native-fs';
import { Platform } from 'react-native';

// Raw file extensions to support
const RAW_FILE_EXTENSIONS = ['.cr2', '.raf'];

// Temporary URL for the ExifTool zip file download
const EXIFTOOL_DOWNLOAD_URL = 'TEMP_URL'; // Replace with actual URL when available

// ExifTool binary paths
const EXIFTOOL_BIN_DIR = `${DocumentDirectoryPath}/bin`;
const EXIFTOOL_PATH = `${EXIFTOOL_BIN_DIR}/exiftool`;
const EXIFTOOL_ZIP_PATH = `${EXIFTOOL_BIN_DIR}/exiftool.zip`;

/**
 * Check for ExifTool dependency and install if needed
 */
async function checkDependencies(): Promise<void> {
  // Only run on macOS
  if (Platform.OS !== 'macos') return;

  try {
    // First check if bin directory exists, create if not
    const binDirExists = await exists(EXIFTOOL_BIN_DIR);
    if (!binDirExists) {
      console.log('Creating ExifTool bin directory:', EXIFTOOL_BIN_DIR);
      await mkdir(EXIFTOOL_BIN_DIR);
    }

    // Check if exiftool exists
    const exiftoolExists = await exists(EXIFTOOL_PATH);
    if (exiftoolExists) {
      console.log('ExifTool found at:', EXIFTOOL_PATH);
      return;
    }

    console.log('ExifTool not found, downloading from:', EXIFTOOL_DOWNLOAD_URL);

    // Download the zip file
    const downloadResult = await downloadFile({
      fromUrl: EXIFTOOL_DOWNLOAD_URL,
      toFile: EXIFTOOL_ZIP_PATH,
      background: false,
      discretionary: false,
      progressDivider: 1,
    }).promise;

    if (downloadResult.statusCode !== 200) {
      throw new Error(`Failed to download ExifTool: HTTP ${downloadResult.statusCode}`);
    }

    console.log('ExifTool downloaded successfully, extracting...');

    // Extract the zip file using native commands via NativeModules
    // For this we would need to implement a native module method that handles unzipping
    // Alternatively, use a command execution module to run 'unzip' command

    // For now, we'll assume a hypothetical unzip function
    await unzipFile(EXIFTOOL_ZIP_PATH, EXIFTOOL_BIN_DIR);

    // Clean up the zip file
    await unlink(EXIFTOOL_ZIP_PATH);

    console.log('ExifTool installed successfully at:', EXIFTOOL_PATH);

    // Make sure the binary is executable
    await makeExecutable(EXIFTOOL_PATH);
  } catch (error) {
    console.error('Error installing ExifTool:', error);
  }
}

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

    // Check and install dependencies
    await checkDependencies();
  },

  loadAsImage: async (filePath: string) => {
    try {
      // Extract JPEG preview from RAW file with a max size of 1000px
      const jpgPath = await ExifTool.rawToJpg(filePath, 1000);
      return jpgPath;
    } catch (error) {
      console.error('Error converting RAW to JPG:', error);
      // Return original path if conversion fails
      return filePath;
    }
  },
};

// Helper function for unzipping (would need to be implemented as a native module)
async function unzipFile(zipPath: string, destPath: string): Promise<void> {
  // This should be implemented using a native module
  // For now, it's a placeholder
  console.log(`Unzipping ${zipPath} to ${destPath}`);
  // Implementation would go here
  throw new Error('Unzip functionality not implemented');
}

// Helper function to make a file executable (would need to be implemented as a native module)
async function makeExecutable(filePath: string): Promise<void> {
  // This should be implemented using a native module
  // For now, it's a placeholder
  console.log(`Making ${filePath} executable`);
  // Implementation would go here
  throw new Error('Make executable functionality not implemented');
}
