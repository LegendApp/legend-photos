import {
  DocumentDirectoryPath,
  type ReadDirResItemT,
  readDir,
  stat,
} from '@dr.pogodin/react-native-fs';

const BASE_PATH = `${DocumentDirectoryPath}/photos`;

// Supported photo file extensions
const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.heic', '.webp'];

export type PhotoInfo = ReadDirResItemT;

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
export async function listPhotosInFolder(folderPath: string = BASE_PATH): Promise<PhotoInfo[]> {
  try {
    // Read the directory contents
    const files = await readDir(folderPath);

    // Filter to only include photo files and extract just the filename
    return files.filter((file) => isPhotoFile(file.name));
  } catch (error) {
    console.error('Error listing photos:', error);
    return [];
  }
}

/**
 * Lists all folders that contain photo files in a specified folder and its subfolders
 * @param folderPath - Path to the folder (defaults to DocumentDirectoryPath/photos)
 * @returns Promise with an array of folder paths (relative to the base folder)
 */
export async function listFoldersWithPhotosRecursive(
  folderPath: string = BASE_PATH
): Promise<string[]> {
  try {
    const folders: string[] = [];
    const items = await readDir(folderPath);

    let hasPhotos = false;

    // Process each item in the directory
    for (const item of items) {
      const itemPath = `${folderPath}/${item.name}`;
      const itemStat = await stat(itemPath);

      if (itemStat.isDirectory()) {
        // If it's a directory, recursively scan it
        const subFolders = await listFoldersWithPhotosRecursive(itemPath);
        // Add the subfolder paths to results
        folders.push(...subFolders);
      } else if (!hasPhotos && isPhotoFile(item.name)) {
        // If this folder has at least one photo, mark it
        hasPhotos = true;
      }
    }

    // If this folder has photos, add it to the results
    if (hasPhotos) {
      // Get the relative path from the base
      const relativePath = folderPath === BASE_PATH ? '' : folderPath.replace(`${BASE_PATH}/`, '');
      folders.push(relativePath);
    }

    folders.sort();

    return folders;
  } catch (error) {
    console.error('Error listing folders with photos:', error);
    return [];
  }
}
