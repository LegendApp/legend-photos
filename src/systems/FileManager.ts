import { type ReadDirResItemT, readDir } from '@dr.pogodin/react-native-fs';
import { observable } from '@legendapp/state';

// Supported photo file extensions
const DEFAULT_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.heic', '.webp'];

// Observable state for dynamically added extensions from loader plugins
export const additionalExtensions$ = observable<string[]>([]);

// Global map to store jpg paths for raw files
export const jpgFileMap = new Map<string, string>();

// Function to get all supported photo extensions (default + from plugins)
export function getAllPhotoExtensions(): string[] {
  return [...DEFAULT_PHOTO_EXTENSIONS, ...additionalExtensions$.get()];
}

export interface PhotoInfo extends ReadDirResItemT {
  id: string;
}

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
 * Extracts the base name of a file (without extension)
 * @param filename - The filename with extension
 * @returns The base name without extension
 */
function getBaseName(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
}

/**
 * Checks if a string ends with any of the supported photo extensions
 * @param str - The string to check
 * @returns boolean indicating if the string is a photo file
 */
function isPhotoFile(str: string): boolean {
  return getAllPhotoExtensions().some((ext) => str.toLowerCase().endsWith(ext.toLowerCase()));
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

    // Map to track the best non-jpg file for each base name
    const bestFileByBaseName = new Map<string, ReadDirResItemT>();
    // Map to track jpg files by base name
    const jpgFilesByBaseName = new Map<string, ReadDirResItemT>();

    // Process all photo files in a single pass
    for (const file of files) {
      if (!isPhotoFile(file.name)) continue;

      const baseName = getBaseName(file.name);
      const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      const fullPath = `${folderPath}/${file.name}`;

      // Track jpg files separately
      if (fileExt === '.jpg') {
        jpgFilesByBaseName.set(baseName, file);
        // Store in the global map
        jpgFileMap.set(`${folderPath}/${baseName}`, fullPath);
      }
      // Store the non-jpg file if we haven't seen this base name yet
      else if (!bestFileByBaseName.has(baseName)) {
        bestFileByBaseName.set(baseName, file);
      }
    }

    // Add jpg files that don't have a corresponding raw file
    for (const [baseName, jpgFile] of jpgFilesByBaseName) {
      if (!bestFileByBaseName.has(baseName)) {
        bestFileByBaseName.set(baseName, jpgFile);
      }
    }

    // Convert map to result array
    const result: PhotoInfo[] = Array.from(bestFileByBaseName.values()).map((file) => ({
      ...file,
      id: `${folderPath}/${file.name}`,
    }));

    // Sort by filename
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  } catch (error) {
    console.error('Error listing photos:', error);
    return [];
  }
}

/**
 * Gets the photo path, preferring jpg version if available
 * @param filePath - The original file path
 * @returns The jpg path if available, otherwise the original path
 */
export function getPhotoPath(filePath: string): string {
  const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
  const baseName = getBaseName(fileName);
  const baseKey = `${folderPath}/${baseName}`;

  // Check if we have a jpg version for this file
  const jpgPath = jpgFileMap.get(baseKey);

  return jpgPath || filePath;
}

/**
 * Lists all folders that contain photo files in the configured library paths and their subfolders
 * @returns Promise with an array of absolute folder paths
 */
export async function listFoldersWithPhotosRecursive(libraryPaths: string[]): Promise<string[]> {
  try {
    // Process each configured library path in parallel
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

    // Check if the current folder has photos (in parallel with subfolder scanning)
    const hasPhotos = checkFolderForPhotos(items);

    // Process subdirectories in parallel
    const subDirectories = items.filter((item) => item.isDirectory());
    const subFolderPromises = subDirectories.map((dir) =>
      scanFolderRecursive(`${folderPath}/${dir.name}`)
    );

    // Wait for all subfolder scans to complete
    const subFolderResults = await Promise.all(subFolderPromises);

    // Add all subfolders to our results
    for (const result of subFolderResults) {
      folders.push(...result);
    }

    // Check if the current folder has photos
    if (hasPhotos) {
      folders.push(folderPath);
    }

    return folders;
  } catch (error) {
    console.error(`Error scanning folder ${folderPath}:`, error);
    return [];
  }
}

/**
 * Helper function to check if a folder contains photo files
 * @param items - Directory items from readDir
 * @returns Promise resolving to boolean indicating if the folder has photos
 */
function checkFolderForPhotos(items: ReadDirResItemT[]): boolean {
  return items.some((item) => !item.isDirectory() && isPhotoFile(item.name));
}
