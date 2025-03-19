import { type ReadDirResItemT, readDir, stat } from '@dr.pogodin/react-native-fs';
import { settings$ } from './settings/SettingsFile';

// Supported photo file extensions
const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.heic', '.webp'];

export type PhotoInfo = ReadDirResItemT;

/**
 * Extracts the folder name from a full path
 * @param path - The full path
 * @returns The folder name (last segment of the path)
 */
export function getFolderName(path: string): string {
  // Handle trailing slash
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  // Get the last segment after splitting by forward slash
  const segments = normalizedPath.split('/');
  return segments[segments.length - 1] || path;
}

/**
 * Checks if a string ends with any of the supported photo extensions
 * @param str - The string to check
 * @returns boolean indicating if the string is a photo file
 */
function isPhotoFile(str: string): boolean {
  return PHOTO_EXTENSIONS.some((ext) => str.toLowerCase().endsWith(ext.toLowerCase()));
}

function sortFilesByName(a: ReadDirResItemT, b: ReadDirResItemT) {
  return a.name.localeCompare(b.name);
}

/**
 * Lists all photo files in a specified folder (non-recursive)
 * @param folderPath - Path to the folder
 * @returns Promise with an array of file names (without full path)
 */
export async function listPhotosInFolder(folderPath: string): Promise<PhotoInfo[]> {
  try {
    // Read the directory contents
    const files = await readDir(folderPath);

    files.sort(sortFilesByName);

    // Filter to only include photo files and extract just the filename
    return files.filter((file) => isPhotoFile(file.name));
  } catch (error) {
    console.error('Error listing photos:', error);
    return [];
  }
}

/**
 * Lists all folders that contain photo files in the configured library paths and their subfolders
 * @returns Promise with an array of absolute folder paths
 */
export async function listFoldersWithPhotosRecursive(): Promise<string[]> {
  try {
    const libraryPaths = settings$.library.paths.get();

    // Process each configured library path
    const allFolders = await Promise.all(libraryPaths.map(scanFolderRecursive));

    return allFolders.flat().sort();
  } catch (error) {
    console.error('Error listing folders with photos:', error);
    return [];
  }
}

/**
 * Helper function to scan a folder recursively for photos
 * @param folderPath - Path to scan
 * @returns Promise with an array of absolute folder paths that contain photos
 */
export async function scanFolderRecursive(folderPath: string): Promise<string[]> {
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
        const subFolders = await scanFolderRecursive(itemPath);
        // Add the subfolder paths to results
        folders.push(...subFolders);
      } else if (!hasPhotos && isPhotoFile(item.name)) {
        // If this folder has at least one photo, mark it
        hasPhotos = true;
      }
    }

    // If this folder has photos, add it to the results
    if (hasPhotos) {
      folders.push(folderPath);
    }

    return folders;
  } catch (error) {
    console.error(`Error scanning folder ${folderPath}:`, error);
    return [];
  }
}
