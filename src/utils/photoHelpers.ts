import type { PhotoInfo } from '../FileManager';
import { settings$ } from '../settings/SettingsFile';

export function getPhotoUri(photo: PhotoInfo | null | undefined) {
  if (!photo) {
    return null;
  }
  const folderPath = settings$.state.openFolder.peek();
  const { name } = photo;
  return `file://${folderPath}/${name}`;
}
