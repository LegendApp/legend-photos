import type { Observable } from '@legendapp/state';
import { use$ } from '@legendapp/state/react';
import React from 'react';
import { View } from 'react-native';
import { KeyCodes } from '../KeyboardManager';
import type { PhotoProps } from '../Photo';
import { type PhotoMetadataItem, photoMetadatas$, updateMetadata } from '../PhotoMetadata';
import { state$ } from '../State';
import { SFSymbol } from '../components/SFSymbol';
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

const handleRejectToggle = (photoId: string, photoMetadata$: Observable<PhotoMetadataItem>) => {
  const metadata = photoMetadata$.get();
  const newValue: PhotoMetadataItem = { reject: !metadata?.reject };
  if (newValue.reject && metadata?.flag) {
    newValue.flag = false;
  }
  updateMetadata(photoId, newValue);
};

// Flag/Reject component
function FlagRejectComponent({ photo }: FlagRejectPluginProps) {
  const photoName = photo.photoName;
  const selectedFolder = use$(state$.selectedFolder);
  const photoId = `${selectedFolder}/${photoName}`;
  const photoMetadata$ = photoMetadatas$[photoId];
  const photoMetadata = use$(photoMetadata$);

  return (
    <View className="absolute left-0 bottom-0 flex-row items-center gap-x-1 h-8 pl-2">
      {photoMetadata.flag && <SFSymbol name="flag.fill" size={16} color="white" />}
      {photoMetadata.reject && <SFSymbol name="flag.fill" size={16} color="#d00" />}
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
  const photoName = photosList[index].name;
  const photoId = `${folder}/${photoName}`;

  const photoMetadata$ = photoMetadatas$[photoId];
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
  component: FlagRejectComponent,
  shouldRender: ({ photo }: { photo: PhotoProps }) => {
    const photoName = photo.photoName;
    const selectedFolder = use$(state$.selectedFolder);
    const photoId = `${selectedFolder}/${photoName}`;
    const photoMetadata$ = photoMetadatas$[photoId];
    const photoMetadata = use$(photoMetadata$);

    return !!(photoMetadata && (photoMetadata.flag || photoMetadata.reject));
  },
  hotkeys: {
    // Use Space to toggle flag
    [KeyCodes.KEY_SPACE.toString()]: toggleFlagCurrentPhoto,
    [KeyCodes.KEY_P.toString()]: toggleFlagCurrentPhoto,
    // Use X to toggle reject
    [KeyCodes.KEY_X.toString()]: toggleRejectCurrentPhoto,
  },
};
