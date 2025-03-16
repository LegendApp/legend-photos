import React from 'react';
import { Text, View } from 'react-native';
import { KeyCodes } from '../KeyboardManager';
import { updateMetadata } from '../PhotoMetadata';
import { state$ } from '../State';
import type { Plugin } from './PluginTypes';

// Flag/Reject component
function FlagRejectComponent() {
  return (
    <View className="flex-row items-center ml-4">
      <Text className="text-white">Flag: Space | Reject: X</Text>
    </View>
  );
}

// Helper function to toggle flag on the current photo
const toggleFlagCurrentPhoto = () => {
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

  // Get current metadata to toggle flag
  const metadata = require('../PhotoMetadata').getMetadata(photoId);
  const newFlagValue = !metadata.flag;

  // Update the metadata
  updateMetadata(photoId, { flag: newFlagValue });
};

// Helper function to toggle reject on the current photo
const toggleRejectCurrentPhoto = () => {
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

  // Get current metadata to toggle reject
  const metadata = require('../PhotoMetadata').getMetadata(photoId);
  const newRejectValue = !metadata.reject;

  // Update the metadata
  updateMetadata(photoId, { reject: newRejectValue });
};

// Define the Flag/Reject plugin
export const FlagRejectPlugin: Plugin = {
  id: 'flag-reject-plugin',
  name: 'Flag & Reject',
  description: 'Flag photos with Space, reject with X',
  enabled: true,
  childOf: 'metadata',
  render: () => <FlagRejectComponent />,
  hotkeys: {
    // Use Space to toggle flag
    [KeyCodes.KEY_SPACE.toString()]: toggleFlagCurrentPhoto,
    // Use X to toggle reject
    [KeyCodes.KEY_X.toString()]: toggleRejectCurrentPhoto,
  },
};
