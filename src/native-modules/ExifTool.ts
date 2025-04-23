import { NativeModules } from 'react-native';

interface ExifToolType {
  /**
   * Extracts a JPEG preview from a raw file using exiftool
   * @param rawFilePath - Path to the raw file
   * @returns Promise that resolves with the path to the created JPEG file
   */
  rawToJpg(rawFilePath: string): Promise<string>;
}

const { ExifTool } = NativeModules;

export { ExifTool };
export type { ExifToolType };
