import {
  DocumentDirectoryPath,
  exists,
  readDir,
  readFile,
} from '@dr.pogodin/react-native-fs';

const BASE_PATH = `${DocumentDirectoryPath}/md`;

/**
 * Checks if a string ends with a specific suffix, handling case sensitivity
 * @param str - The string to check
 * @param suffix - The suffix to look for
 * @returns boolean indicating if the string ends with the suffix
 */
function endsWith(str: string, suffix: string): boolean {
  return str.toLowerCase().endsWith(suffix.toLowerCase());
}

/**
 * Lists all markdown files in a specified folder
 * @param folderPath - Path to the folder (defaults to DocumentDirectoryPath/md)
 * @returns Promise with an array of file names (without full path)
 */
export async function listFilesInFolder(
  folderPath: string = BASE_PATH,
): Promise<string[]> {
  try {
    // Read the directory contents
    const files = await readDir(folderPath);

    // Filter to only include markdown files and extract just the filename
    return files
      .filter(file => endsWith(file.name, '.md'))
      .map(file => file.name);
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
}
