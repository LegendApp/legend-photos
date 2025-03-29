import type { PhotoInfo } from '@/systems/FileManager';
import { createJSONManager } from '@/utils/JSONManager';
import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';

// Define the metadata structure for a single photo
export interface PhotoMetadataItem {
  rating?: number;
  tags?: string[];
  flag?: boolean;
  reject?: boolean;
  aspect?: number;
}

// Define the structure for all metadata
export interface PhotoMetadataStore {
  [photoId: string]: PhotoMetadataItem;
}

// Create the metadata manager
export const photoMetadatas$ = createJSONManager<PhotoMetadataStore>({
  basePath: `${DocumentDirectoryPath}/.legendphotos/`,
  filename: 'metadata.json',
  initialValue: {},
  saveDefaultToFile: false,
});

// Get metadata for a specific photo
export function getMetadata(photo: PhotoInfo): PhotoMetadataItem {
  return photoMetadatas$[photo.id].get() || {};
}

// Update metadata for a specific photo
export async function updateMetadata(
  photo: PhotoInfo,
  updates: Partial<PhotoMetadataItem>
): Promise<void> {
  photoMetadatas$[photo.id].assign(updates);
}
