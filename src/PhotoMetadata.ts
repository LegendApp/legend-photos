import { createJSONManager } from './utils/JSONManager';

// Define the metadata structure for a single photo
export interface PhotoMetadataItem {
  rating?: number;
  tags?: string[];
  flag?: boolean;
  reject?: boolean;
}

// Define the structure for all metadata
export interface PhotoMetadataStore {
  [photoId: string]: PhotoMetadataItem;
}

// Create the metadata manager
const metadataManager = createJSONManager<PhotoMetadataStore>('metadata.json', {});

// Export the metadata observable and functions
export const metadata$ = metadataManager.data$;
export const initializeMetadata = metadataManager.initialize;

// Get metadata for a specific photo
export function getMetadata(photoId: string): PhotoMetadataItem {
  return metadata$[photoId].get() || {};
}

// Update metadata for a specific photo
export async function updateMetadata(
  photoId: string,
  updates: Partial<PhotoMetadataItem>
): Promise<void> {
  await metadataManager.update((current) => {
    const currentPhotoData = current[photoId] || {};
    return {
      ...current,
      [photoId]: {
        ...currentPhotoData,
        ...updates,
      },
    };
  });
}

// Batch update multiple photos at once
export async function batchUpdateMetadata(
  updates: Record<string, Partial<PhotoMetadataItem>>
): Promise<void> {
  await metadataManager.update((current) => {
    const updated = { ...current };

    for (const [photoId, update] of Object.entries(updates)) {
      const currentPhotoData = current[photoId] || {};
      updated[photoId] = {
        ...currentPhotoData,
        ...update,
      };
    }

    return updated;
  });
}
