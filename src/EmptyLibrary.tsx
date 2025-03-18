import React from 'react';
import { Text, View } from 'react-native';
import { addLibraryPath } from './LibraryManager';
import { FilePicker } from './components/FilePicker';
import { SFSymbol } from './components/SFSymbol';

export function EmptyLibrary() {
  const handleFolderSelected = async (path: string) => {
    addLibraryPath(path);
  };

  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-24 h-24 mb-6 items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
        <SFSymbol name="folder.fill" size={48} />
      </View>

      <Text className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
        No photos to display
      </Text>

      <Text className="text-base text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
        Get started by adding a folder containing your photos to the library
      </Text>

      <FilePicker
        title="Add Folder to Library"
        variant="primary"
        size="medium"
        pickFolder={true}
        onFileSelected={handleFolderSelected}
      />
    </View>
  );
}
