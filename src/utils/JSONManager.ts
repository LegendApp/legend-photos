import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  readFile,
  writeFile,
} from '@dr.pogodin/react-native-fs';
import { type Observable, observable } from '@legendapp/state';

/**
 * Creates a manager for a JSON file with observable state
 * @param filename The name of the JSON file (without path)
 * @param initialValue The initial value for the observable
 * @returns An object with the observable and utility functions
 */
export function createJSONManager<T extends object>(filename: string, initialValue: T) {
  // Create an observable state
  const data$ = observable(initialValue);

  // Path to the file
  const filePath = `${DocumentDirectoryPath}/.legendaura/${filename}`;

  // Initialize the data system
  async function initialize(): Promise<void> {
    try {
      // Check if the file exists
      const fileExists = await exists(filePath);

      if (fileExists) {
        // Load existing data
        const content = await readFile(filePath);
        const loadedData = JSON.parse(content);
        // Update the observable with the loaded data
        (data$ as Observable<object>).set(loadedData);
        console.log(`${filename} loaded successfully`);
      } else {
        // Create a new file with initial data
        await ensureDirectoryExists(filePath);
        await writeFile(filePath, JSON.stringify(initialValue), 'utf8');
        console.log(`New ${filename} file created`);
      }
    } catch (error) {
      console.error(`Error initializing ${filename}:`, error);
    }
  }

  // Ensure all directories in the path exist
  async function ensureDirectoryExists(filePath: string): Promise<void> {
    // Extract the directory path from the file path
    const directoryPath = filePath.substring(0, filePath.lastIndexOf('/'));

    // Check if the directory exists
    const dirExists = await exists(directoryPath);

    if (!dirExists) {
      // Split the path into segments
      const pathSegments = directoryPath.split('/');
      let currentPath = '';

      // Create each directory segment if it doesn't exist
      for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `${pathSegments[i]}/`;

        // Skip empty segments
        if (pathSegments[i] === '') continue;

        // Check if this segment exists
        const segmentExists = await exists(currentPath);

        if (!segmentExists) {
          try {
            await mkdir(currentPath);
            console.log(`Created directory: ${currentPath}`);
          } catch (error) {
            // If the directory was created by another process in the meantime, continue
            if (await exists(currentPath)) {
              console.log(`Directory already exists: ${currentPath}`);
            } else {
              throw error;
            }
          }
        }
      }
    }
  }

  // Save data to file
  async function saveToFile(): Promise<void> {
    try {
      // Ensure the directory exists before saving
      await ensureDirectoryExists(filePath);

      const jsonData = JSON.stringify(data$.get());
      await writeFile(filePath, jsonData, 'utf8');
      console.log(`${filename} saved successfully`);
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
    }
  }

  // Update data
  async function update(updater: (current: T) => T): Promise<void> {
    console.log('updater');
    // Update the observable with the updated data
    (data$ as Observable<object>).set(updater);

    console.log('updated', data$.get());

    // Save to file
    await saveToFile();
  }

  return {
    data$,
    initialize,
    update,
    saveToFile,
  };
}
