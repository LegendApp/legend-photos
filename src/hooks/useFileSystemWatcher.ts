import { useEffect, useState } from 'react';
import { type DirectoryChangeEvent, FileSystemWatcherModule } from '../native/FileSystemWatcher';

/**
 * Hook for watching directories for changes
 * @param directories Array of directory paths to watch
 * @returns Object containing the latest change event
 */
export function useFileSystemWatcher(directories: string[]) {
  const [lastChangeEvent, setLastChangeEvent] = useState<DirectoryChangeEvent | null>(null);

  useEffect(() => {
    // Set directories to watch
    FileSystemWatcherModule.setWatchedDirectories(directories);

    // Set up the event listener
    const removeListener = FileSystemWatcherModule.addChangeListener((event) => {
      setLastChangeEvent(event);
    });

    // Clean up when the component unmounts or directories change
    return () => {
      removeListener();
      // Clear watched directories on unmount
      FileSystemWatcherModule.setWatchedDirectories([]);
    };
  }, [directories]);

  return { lastChangeEvent };
}
