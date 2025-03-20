import { use$ } from '@legendapp/state/react';
import React from 'react';
import { Text, View } from 'react-native';
import { state$ } from '../State';
import type { Plugin } from './PluginTypes';

/**
 * Component that shows the name and created date of the currently selected photo
 */
function PhotoInfo() {
  const selectedPhoto = use$(state$.selectedPhoto);

  if (!selectedPhoto) {
    return null;
  }

  // Format the creation date if available
  let creationDate = 'Date unknown';

  if (selectedPhoto.mtime) {
    try {
      const date = new Date(selectedPhoto.mtime);
      creationDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
    }
  }

  return (
    <View className="absolute top-0 left-0 right-0 flex items-center pt-2">
      <View className="bg-black/50 px-4 py-1 rounded-md flex-row items-center gap-x-4">
        <Text className="text-white font-medium text-lg text-center">{selectedPhoto.name}</Text>
        <Text className="text-white/80 text-sm text-center">{creationDate}</Text>
      </View>
    </View>
  );
}

// Export plugin configuration
export const photoInfoPlugin: Plugin = {
  id: 'photo-info',
  name: 'Photo Info',
  description: 'Displays the name and created date of the currently selected photo',
  enabled: true,
  childOf: 'photoFullscreen',
  component: PhotoInfo,
};
