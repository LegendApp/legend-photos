import { use$ } from '@legendapp/state/react';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFileSystemWatcher } from '../hooks/useFileSystemWatcher';
import { settings$ } from '../settings/SettingsFile';

/**
 * Example component that demonstrates the FileSystemWatcher
 */
export function FileWatcherExample() {
  // Get library paths from settings
  const libraryPaths = use$(settings$.library.paths);

  // Use the file system watcher hook
  const { lastChangeEvent } = useFileSystemWatcher(libraryPaths);

  // Keep a history of events
  const [changeHistory, setChangeHistory] = useState<
    Array<{
      path: string;
      filePath: string;
      type: string;
      timestamp: number;
      id: string;
    }>
  >([]);

  // Update history when a new change event occurs
  useEffect(() => {
    if (lastChangeEvent) {
      const timestamp = Date.now();
      setChangeHistory((prev) => [
        {
          path: lastChangeEvent.path,
          filePath: lastChangeEvent.filePath,
          type: lastChangeEvent.type,
          timestamp,
          id: `${lastChangeEvent.filePath}-${lastChangeEvent.type}-${timestamp}`,
        },
        ...prev.slice(0, 49), // Keep last 50 events
      ]);
    }
  }, [lastChangeEvent]);

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl mb-4">File System Watcher</Text>
      <Text className="text-sm mb-2">Watching directories:</Text>
      {libraryPaths.map((path) => (
        <Text key={path} className="text-xs mb-1" numberOfLines={1}>
          {path}
        </Text>
      ))}

      <Text className="text-sm mt-4 mb-2">Recent changes:</Text>
      <ScrollView className="flex-1 border border-gray-200 rounded">
        {changeHistory.length > 0 ? (
          changeHistory.map((event) => (
            <View key={event.id} className="p-2 border-b border-gray-100">
              <Text className="text-xs font-bold">{event.type.toUpperCase()}</Text>
              <Text className="text-xs" numberOfLines={1}>
                File: {event.filePath}
              </Text>
              <Text className="text-xs text-gray-500" numberOfLines={1}>
                In: {event.path}
              </Text>
              <Text className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        ) : (
          <Text className="p-4 text-center text-gray-500">No changes detected yet</Text>
        )}
      </ScrollView>
    </View>
  );
}
