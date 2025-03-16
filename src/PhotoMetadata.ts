import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  readFile,
  writeFile,
} from '@dr.pogodin/react-native-fs';
import { observable } from '@legendapp/state';

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

// Create an observable state for the metadata
export const metadata$ = observable<PhotoMetadataStore>({});

// Path to the metadata file
const METADATA_FILE_PATH = `${DocumentDirectoryPath}/legendaura.json`;

// Initialize the metadata system
export async function initializeMetadata(): Promise<void> {
  try {
    // Check if the metadata file exists
    const fileExists = await exists(METADATA_FILE_PATH);

    if (fileExists) {
      // Load existing metadata
      const content = await readFile(METADATA_FILE_PATH);
      const data = JSON.parse(content);
      metadata$.set(data);
      console.log('Metadata loaded successfully');
    } else {
      // Create a new metadata file with empty data
      await ensureDirectoryExists();
      await writeFile(METADATA_FILE_PATH, JSON.stringify({}), 'utf8');
      console.log('New metadata file created');
    }
  } catch (error) {
    console.error('Error initializing metadata:', error);
  }
}

// Ensure the directory exists
async function ensureDirectoryExists(): Promise<void> {
  const directory = DocumentDirectoryPath;
  const dirExists = await exists(directory);
  if (!dirExists) {
    await mkdir(directory);
  }
}

// Get metadata for a specific photo
export function getMetadata(photoId: string): PhotoMetadataItem {
  return metadata$[photoId].get() || {};
}

// Update metadata for a specific photo
export async function updateMetadata(
  photoId: string,
  updates: Partial<PhotoMetadataItem>
): Promise<void> {
  // Get current metadata
  const current = getMetadata(photoId);

  // Update in memory
  metadata$[photoId].set({
    ...current,
    ...updates,
  });

  // Save to file
  await saveMetadataToFile();
}

// Save all metadata to file
async function saveMetadataToFile(): Promise<void> {
  try {
    const data = JSON.stringify(metadata$.get());
    await writeFile(METADATA_FILE_PATH, data, 'utf8');
    console.log('Metadata saved successfully');
  } catch (error) {
    console.error('Error saving metadata:', error);
  }
}

// Batch update multiple photos at once
export async function batchUpdateMetadata(
  updates: Record<string, Partial<PhotoMetadataItem>>
): Promise<void> {
  // Update each photo in memory
  for (const [photoId, update] of Object.entries(updates)) {
    const current = getMetadata(photoId);
    metadata$[photoId].set({
      ...current,
      ...update,
    });
  }

  // Save all changes to file
  await saveMetadataToFile();
}
