import { plugins$ } from '@/plugin-system/PluginManager';
import type { LoaderPlugin } from '@/plugin-system/PluginTypes';
import type { PhotoInfo } from '@/systems/FileManager';
import { observable } from '@legendapp/state';

// Cache for converted file paths
export const imagePathCache$ = observable<Record<string, string>>({});

/**
 * Get all registered loader plugins
 */
export function getLoaderPlugins(): LoaderPlugin[] {
  const allPlugins = plugins$.get();
  return Object.values(allPlugins).filter(
    (plugin) => plugin.type === 'loader' && plugin.enabled !== false
  ) as LoaderPlugin[];
}

/**
 * Find a loader plugin that can handle the given file path
 * @param filePath Path to the file
 * @returns The loader plugin or undefined if none found
 */
export function findLoaderForPath(filePath: string): LoaderPlugin | undefined {
  const loaders = getLoaderPlugins();
  const lowerPath = filePath.toLowerCase();

  return loaders.find((loader) =>
    loader.supportedExtensions.some((ext) => lowerPath.endsWith(ext.toLowerCase()))
  );
}

/**
 * Load an image file path via an appropriate loader plugin if needed
 * @param photo Photo info object
 * @returns Promise that resolves with the final path to display
 */
export async function loadImagePath(photo: PhotoInfo): Promise<string> {
  if (!photo) return '';

  const { path } = photo;
  const cachedPath = imagePathCache$[path].get();

  // Use cached path if available
  if (cachedPath) {
    return cachedPath;
  }

  // Find an appropriate loader plugin
  const loader = findLoaderForPath(path);
  if (!loader) {
    return path; // No loader found, return original path
  }

  try {
    // Use the loader to get a proper image path
    const processedPath = await loader.loadAsImage(path);

    // Cache the result
    imagePathCache$[path].set(processedPath);

    return processedPath;
  } catch (error) {
    console.error(`Error loading image with plugin ${loader.id}:`, error);
    return path; // Return original path on error
  }
}
