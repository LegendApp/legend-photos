import { useSelector } from '@legendapp/state/react';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { SegmentedControl } from '../components/SegmentedControl';
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
    console.log('on button');
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
    <View className="space-y-8">
      <Text className="text-2xl font-bold text-white mb-2">Library Settings</Text>

      {/* Library Paths */}
      <View className="pb-8">
        <Text className="text-base font-medium text-white mb-3">Library Paths</Text>
        <View className="flex-row mb-3">
          <TextInput
            className="flex-1 bg-[#333] text-white px-3 py-2 rounded-md mr-2 border border-[#555]"
            value={newPath}
            onChangeText={setNewPath}
            placeholder="Add a new library path..."
            placeholderTextColor="#999"
          />
          <Button
            title="Add"
            onPress={handleAddPath}
            disabled={!newPath.trim()}
            variant={newPath.trim() ? 'primary' : 'secondary'}
          />
        </View>

        <FlatList
          data={librarySettings.paths}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between bg-[#222] p-2 rounded-md mb-1 border border-[#444]">
              <Text className="text-white">{item}</Text>
              <Button
                title="Remove"
                variant="danger"
                size="small"
                onPress={() => handleRemovePath(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="py-3 px-4 bg-[#222] rounded-md border border-[#444]">
              <Text className="text-gray-400 text-center">No library paths added yet</Text>
            </View>
          }
          className="max-h-40"
        />
      </View>

      {/* Preview Size */}
      <View className="pb-8 w-64">
        <Text className="text-base font-medium text-white mb-6">Preview Size</Text>
        <SegmentedControl
          options={['small', 'medium', 'large'] as const}
          selectedValue={librarySettings.previewSize}
          onValueChange={handlePreviewSizeChange}
          labelExtractor={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          size="large"
        />
      </View>

      {/* Show Filenames */}
      <View className="pb-8 w-32">
        <Text className="text-base font-medium text-white mb-6">Show Filenames</Text>
        <SegmentedControl
          options={['yes', 'no'] as const}
          selectedValue={librarySettings.showFilenames ? 'yes' : 'no'}
          onValueChange={(value) => {
            console.log('value');
            handleShowFilenamesChange(value === 'yes');
          }}
          size="large"
        />
      </View>

      {/* Sort Options */}
      <View className="pb-8 w-64">
        <Text className="text-base font-medium text-white mb-6">Sort By</Text>
        <SegmentedControl
          options={['name', 'date', 'size', 'type'] as const}
          selectedValue={librarySettings.sortBy}
          onValueChange={handleSortChange}
          labelExtractor={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          size="large"
        />
      </View>

      {/* Sort Direction */}
      <View className="w-56">
        <Text className="text-base font-medium text-white mb-6">Sort Direction</Text>
        <SegmentedControl
          options={['asc', 'desc'] as const}
          selectedValue={librarySettings.sortDirection}
          onValueChange={handleSortDirectionChange}
          labelExtractor={(value) => (value === 'asc' ? 'Ascending' : 'Descending')}
          size="large"
        />
      </View>
    </View>
  );
};
