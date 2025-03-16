import { useSelector } from '@legendapp/state/react';
import React, { useState } from 'react';
import { Button, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  addLibraryPath,
  removeLibraryPath,
  settings$,
  updateLibrarySettings,
} from './SettingsFile';

export const LibrarySettings = () => {
  const [newPath, setNewPath] = useState('');
  const librarySettings = useSelector(settings$.library);

  const handleAddPath = async () => {
    if (newPath.trim()) {
      await addLibraryPath(newPath.trim());
      setNewPath('');
    }
  };

  const handleRemovePath = async (path: string) => {
    await removeLibraryPath(path);
  };

  const handlePreviewSizeChange = async (size: 'small' | 'medium' | 'large') => {
    await updateLibrarySettings({ previewSize: size });
  };

  const handleShowFilenamesChange = async (show: boolean) => {
    await updateLibrarySettings({ showFilenames: show });
  };

  const handleSortChange = async (sortBy: 'name' | 'date' | 'size' | 'type') => {
    await updateLibrarySettings({ sortBy });
  };

  const handleSortDirectionChange = async (sortDirection: 'asc' | 'desc') => {
    await updateLibrarySettings({ sortDirection });
  };

  return (
    <View>
      <Text className="text-2xl font-bold text-white mb-5">Library Settings</Text>

      {/* Library Paths */}
      <View className="mb-6">
        <Text className="text-lg text-white mb-2">Library Paths</Text>
        <View className="flex-row mb-2">
          <TextInput
            className="flex-1 bg-[#333] text-white px-3 py-2 rounded-md mr-2"
            value={newPath}
            onChangeText={setNewPath}
            placeholder="Add a new library path..."
            placeholderTextColor="#999"
          />
          <Button title="Add" onPress={handleAddPath} />
        </View>

        <FlatList
          data={librarySettings.paths}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between bg-[#222] p-2 rounded-md mb-1">
              <Text className="text-white">{item}</Text>
              <TouchableOpacity onPress={() => handleRemovePath(item)}>
                <Text className="text-red-500">Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-gray-400 italic">No library paths added yet</Text>
          }
          className="max-h-40"
        />
      </View>

      {/* Preview Size */}
      <View className="mb-4">
        <Text className="text-lg text-white mb-2">Preview Size</Text>
        <View className="flex-row">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <TouchableOpacity
              key={size}
              className={`px-4 py-2 rounded-md mr-2 ${
                librarySettings.previewSize === size ? 'bg-blue-600' : 'bg-[#333]'
              }`}
              onPress={() => handlePreviewSizeChange(size)}
            >
              <Text className="text-white capitalize">{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Show Filenames */}
      <View className="mb-4">
        <Text className="text-lg text-white mb-2">Show Filenames</Text>
        <View className="flex-row">
          {[true, false].map((show) => (
            <TouchableOpacity
              key={String(show)}
              className={`px-4 py-2 rounded-md mr-2 ${
                librarySettings.showFilenames === show ? 'bg-blue-600' : 'bg-[#333]'
              }`}
              onPress={() => handleShowFilenamesChange(show)}
            >
              <Text className="text-white">{show ? 'Yes' : 'No'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sort Options */}
      <View className="mb-4">
        <Text className="text-lg text-white mb-2">Sort By</Text>
        <View className="flex-row flex-wrap">
          {(['name', 'date', 'size', 'type'] as const).map((sort) => (
            <TouchableOpacity
              key={sort}
              className={`px-4 py-2 rounded-md mr-2 mb-2 ${
                librarySettings.sortBy === sort ? 'bg-blue-600' : 'bg-[#333]'
              }`}
              onPress={() => handleSortChange(sort)}
            >
              <Text className="text-white capitalize">{sort}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sort Direction */}
      <View>
        <Text className="text-lg text-white mb-2">Sort Direction</Text>
        <View className="flex-row">
          {(['asc', 'desc'] as const).map((direction) => (
            <TouchableOpacity
              key={direction}
              className={`px-4 py-2 rounded-md mr-2 ${
                librarySettings.sortDirection === direction ? 'bg-blue-600' : 'bg-[#333]'
              }`}
              onPress={() => handleSortDirectionChange(direction)}
            >
              <Text className="text-white capitalize">
                {direction === 'asc' ? 'Ascending' : 'Descending'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
