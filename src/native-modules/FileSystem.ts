import { NativeModules } from 'react-native';

interface FileSystemType {
  /**
   * Unzips a file to a specified destination directory
   * @param zipPath - Path to the zip file
   * @param destPath - Destination directory where the contents will be extracted
   * @returns Promise that resolves with true on success
   */
  unzipFile(zipPath: string, destPath: string): Promise<boolean>;

  /**
   * Makes a file executable (chmod +x)
   * @param filePath - Path to the file to make executable
   * @returns Promise that resolves with true on success
   */
  makeExecutable(filePath: string): Promise<boolean>;
}

const { FileSystem } = NativeModules;

export { FileSystem };
export type { FileSystemType };
