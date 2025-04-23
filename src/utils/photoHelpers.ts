import { imagePathCache$ } from '@/plugin-system/PluginLoaders';
import type { PhotoInfo } from '@/systems/FileManager';

export function getPhotoUri(photo: PhotoInfo | null | undefined) {
  if (!photo) {
    return null;
  }
  const { path } = photo;
  return `file://${path}`;
}

export function getPhotoPath(photo: PhotoInfo | null | undefined) {
  if (!photo) {
    return null;
  }

  const { path } = photo;

  // Check if we have a processed path in the cache
  const processedPath = imagePathCache$[path].get();
  if (processedPath) {
    return processedPath;
  }

  // Return original path if no processed path is available yet
  return path;
}
