import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { createJSONManager } from './utils/JSONManager';

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
  `${DocumentDirectoryPath}/.legendaura/`,
  'metadata.json',
  {}
);

// Get metadata for a specific photo
export function getMetadata(photoId: string): PhotoMetadataItem {
  return photoMetadatas$[photoId].get() || {};
}

// Update metadata for a specific photo
export async function updateMetadata(
  photoId: string,
  updates: Partial<PhotoMetadataItem>
): Promise<void> {
  photoMetadatas$[photoId].assign(updates);
}
