import type { Observable } from '@legendapp/state';
import { use$ } from '@legendapp/state/react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Flag, X } from 'react-native-feather';
import { KeyCodes } from '../KeyboardManager';
import type { PhotoProps } from '../Photo';
import { type PhotoMetadataItem, getMetadata, metadata$, updateMetadata } from '../PhotoMetadata';
import { state$ } from '../State';
import type { Plugin } from './PluginTypes';

interface FlagRejectPluginProps {
  photo: PhotoProps;
}

const handleFlagToggle = async (photoId: string, photoMetadata$: Observable<PhotoMetadataItem>) => {
  const metadata = photoMetadata$.get();
  const newValue: PhotoMetadataItem = { flag: !metadata?.flag };
  if (newValue.flag && metadata?.reject) {
    newValue.reject = false;
  }
  await updateMetadata(photoId, newValue);
};

const handleRejectToggle = async (
  photoId: string,
  photoMetadata$: Observable<PhotoMetadataItem>
) => {
  const metadata = photoMetadata$.get();
  const newValue: PhotoMetadataItem = { reject: !metadata?.reject };
  if (newValue.reject && metadata?.flag) {
    newValue.flag = false;
  }
  await updateMetadata(photoId, newValue);
};

// Flag/Reject component
function FlagRejectComponent({ photo }: FlagRejectPluginProps) {
  const photoName = photo.photoName;
  const selectedFolder = use$(state$.selectedFolder);
  const photoId = `${selectedFolder}/${photoName}`;
  const photoMetadata$ = metadata$[photoId];
  const photoMetadata = use$(photoMetadata$);

  if (!photoMetadata) {
    // If no valid selection, show no
    return null;
  }

  return (
    <View className="absolute left-0 bottom-0 flex-row items-center gap-x-1 h-7 pl-1 opacity-80">
      {photoMetadata.flag && <Flag stroke="white" width={16} height={16} />}
      {photoMetadata.reject && <Flag stroke="#f00" width={16} height={16} />}
    </View>
  );
}

const getCurrentPhoto = () => {
  const index = state$.selectedPhotoIndex.get();
  const photosList = state$.photos.get();
  const folder = state$.selectedFolder.get();

  if (index === -1 || !photosList.length || !folder || index >= photosList.length) {
    // Check if we have a valid selection
    return {};
  }

  // Get the photo details
  const photoName = photosList[index];
  const photoId = `${folder}/${photoName}`;

  const photoMetadata$ = metadata$[photoId];
  return { photoId, photoMetadata$ };
};

// Helper function to toggle flag on the current photo
const toggleFlagCurrentPhoto = () => {
  const { photoId, photoMetadata$ } = getCurrentPhoto();
  if (photoId) {
    handleFlagToggle(photoId, photoMetadata$);
  }
};

// Helper function to toggle reject on the current photo
const toggleRejectCurrentPhoto = () => {
  const { photoId, photoMetadata$ } = getCurrentPhoto();
  if (photoId) {
    handleRejectToggle(photoId, photoMetadata$);
  }
};

// Define the Flag/Reject plugin
export const FlagRejectPlugin: Plugin = {
  id: 'flag-reject-plugin',
  name: 'Flag & Reject',
  description: 'Flag photos with Space, reject with X',
  enabled: true,
  childOf: 'photo',
  render: (props: { photo: PhotoProps }) => <FlagRejectComponent photo={props.photo} />,
  hotkeys: {
    // Use Space to toggle flag
    [KeyCodes.KEY_SPACE.toString()]: toggleFlagCurrentPhoto,
    [KeyCodes.KEY_P.toString()]: toggleFlagCurrentPhoto,
    // Use X to toggle reject
    [KeyCodes.KEY_X.toString()]: toggleRejectCurrentPhoto,
  },
};
