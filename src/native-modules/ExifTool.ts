import { NativeModules } from 'react-native';

interface ExifToolType {
  /**
   * Extracts a JPEG preview from a raw file using exiftool
   * @param rawFilePath - Path to the raw file
   * @param maxSize - Optional maximum dimension for the output image
   * @returns Promise that resolves with the path to the created JPEG file
   */
  rawToJpg(rawFilePath: string, maxSize: number): Promise<string>;
}

const { ExifTool } = NativeModules;

export { ExifTool };
export type { ExifToolType };
