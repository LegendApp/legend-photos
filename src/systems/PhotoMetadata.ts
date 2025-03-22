import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { createJSONManager } from '@/utils/JSONManager';
import type { PhotoInfo } from '@/systems/FileManager';

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
export const photoMetadatas$ = createJSONManager<PhotoMetadataStore>(
  `${DocumentDirectoryPath}/.legendphotos/`,
  'metadata.json',
  {}
);

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
