import { getOpenFolder } from '@/plugin-system/FileSources';
import type { PhotoInfo } from '@/systems/FileManager';

export function getPhotoUri(photo: PhotoInfo | null | undefined) {
  if (!photo) {
    return null;
  }
  const { path } = getOpenFolder()!;
  const { name } = photo;
  return `file://${path}/${name}`;
}

export function getPhotoPath(photo: PhotoInfo | null | undefined) {
  if (!photo) {
    return null;
  }
  const { path } = getOpenFolder()!;
  const { name } = photo;
  return `${path}/${name}`;
}
