import { settings$ } from '../settings/SettingsFile';
import type { PhotoInfo } from '../systems/FileManager';

export function getPhotoUri(photo: PhotoInfo | null | undefined) {
  if (!photo) {
    return null;
  }
  const folderPath = settings$.state.openFolder.peek();
  const { name } = photo;
  return `file://${folderPath}/${name}`;
}

export function getPhotoPath(photo: PhotoInfo | null | undefined) {
  if (!photo) {
    return null;
  }
  const folderPath = settings$.state.openFolder.peek();
  const { name } = photo;
  return `${folderPath}/${name}`;
}
