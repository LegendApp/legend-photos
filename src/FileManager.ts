import {
  DocumentDirectoryPath,
  exists,
  readDir,
  readFile,
  stat,
} from '@dr.pogodin/react-native-fs';

const BASE_PATH = `${DocumentDirectoryPath}/photos`;

// Supported photo file extensions
const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.heic', '.webp'];

/**
 * Checks if a string ends with any of the supported photo extensions
 * @param str - The string to check
 * @returns boolean indicating if the string is a photo file
 */
function isPhotoFile(str: string): boolean {
  return PHOTO_EXTENSIONS.some((ext) => str.toLowerCase().endsWith(ext.toLowerCase()));
}

/**
 * Lists all photo files in a specified folder (non-recursive)
 * @param folderPath - Path to the folder (defaults to DocumentDirectoryPath/photos)
 * @returns Promise with an array of file names (without full path)
 */
export async function listPhotosInFolder(folderPath: string = BASE_PATH): Promise<string[]> {
  try {
    // Read the directory contents
    const files = await readDir(folderPath);

    // Filter to only include photo files and extract just the filename
    return files.filter((file) => isPhotoFile(file.name)).map((file) => file.name);
  } catch (error) {
    console.error('Error listing photos:', error);
    return [];
  }
}

/**
 * Lists all photo files in a specified folder and its subfolders
 * @param folderPath - Path to the folder (defaults to DocumentDirectoryPath/photos)
 * @returns Promise with an array of file paths (relative to the base folder)
 */
export async function listPhotosRecursive(folderPath: string = BASE_PATH): Promise<string[]> {
  try {
    const results: string[] = [];
    const items = await readDir(folderPath);

    // Process each item in the directory
    for (const item of items) {
      const itemPath = `${folderPath}/${item.name}`;
      const itemStat = await stat(itemPath);

      if (itemStat.isDirectory()) {
        // If it's a directory, recursively scan it and add results
        const subResults = await listPhotosRecursive(itemPath);
        // Add the subfolder path to each result
        const relativePath = itemPath.replace(`${BASE_PATH}/`, '');
        results.push(...subResults.map((file) => `${relativePath}/${file}`));
      } else if (isPhotoFile(item.name)) {
        // If it's a photo file, add it to results
        results.push(item.name);
      }
    }

    return results;
  } catch (error) {
    console.error('Error listing photos recursively:', error);
    return [];
  }
}
