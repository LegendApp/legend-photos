import React from 'react';
import { Text, View } from 'react-native';
import { KeyCodes } from '../KeyboardManager';
import { updateMetadata } from '../PhotoMetadata';
import { state$ } from '../State';
import type { Plugin } from './PluginTypes';

// Rating component that will be rendered
function RatingComponent() {
  // Simplified component without unused variables
  return (
    <View className="flex-row items-center">
      <Text className="text-white mr-2">Rating: Use keys 1-5 to rate</Text>
    </View>
  );
}

// Helper function to rate the current photo
const rateCurrentPhoto = (rating: number) => {
  const index = state$.selectedPhotoIndex.get();
  const photosList = state$.photos.get();
  const folder = state$.selectedFolder.get();

  // Check if we have a valid selection
  if (index === -1 || !photosList.length || !folder || index >= photosList.length) {
    return;
  }

  // Get the photo details
  const photoName = photosList[index];
  const photoId = `${folder}/${photoName}`;

  // Update the metadata
  updateMetadata(photoId, { rating });
};

// Define the Rating plugin
export const RatingPlugin: Plugin = {
  id: 'rating-plugin',
  name: 'Photo Rating',
  description: 'Rate photos using hotkeys 1-5',
  enabled: true,
  childOf: 'metadata',
  render: () => <RatingComponent />,
  hotkeys: {
    // Use number keys 1-5 to set rating
    [KeyCodes.KEY_1.toString()]: () => rateCurrentPhoto(1),
    [KeyCodes.KEY_2.toString()]: () => rateCurrentPhoto(2),
    [KeyCodes.KEY_3.toString()]: () => rateCurrentPhoto(3),
    [KeyCodes.KEY_4.toString()]: () => rateCurrentPhoto(4),
    [KeyCodes.KEY_5.toString()]: () => rateCurrentPhoto(5),
  },
};
