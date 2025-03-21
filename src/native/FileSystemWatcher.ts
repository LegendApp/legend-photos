import { NativeEventEmitter, NativeModules } from 'react-native';

const { FileSystemWatcher } = NativeModules;

export interface DirectoryChangeEvent {
  path: string; // The directory being watched where the change occurred
  filePath: string; // The specific file that was changed
  type: 'add' | 'change' | 'delete'; // Type of change
}

class FileSystemWatcherClass {
  private eventEmitter: NativeEventEmitter;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(FileSystemWatcher);
  }

  /**
   * Set the directories to watch for changes
   * Watches each directory and all its subdirectories recursively
   * @param directories Array of root directory paths to watch
   */
  setWatchedDirectories(directories: string[]): void {
    FileSystemWatcher.setWatchedDirectories(directories);
  }

  /**
   * Check if a directory is currently being watched
   * @param directory Directory path to check
   * @returns Promise that resolves to a boolean indicating if the directory is being watched
   */
  isWatchingDirectory(directory: string): Promise<boolean> {
    return FileSystemWatcher.isWatchingDirectory(directory);
  }

  /**
   * Add a listener for directory change events
   * Detects changes in watched directories and all their subdirectories
   * Events include the specific file path that changed and the type of change
   * @param callback Function to call when a file change is detected
   * @returns Function to remove the listener
   */
  addChangeListener(callback: (event: DirectoryChangeEvent) => void): () => void {
    const subscription = this.eventEmitter.addListener('onDirectoryChanged', callback);
    return () => subscription.remove();
  }
}

export const FileSystemWatcherModule = new FileSystemWatcherClass();
