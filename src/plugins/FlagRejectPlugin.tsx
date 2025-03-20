import type { Observable } from '@legendapp/state';
import { use$ } from '@legendapp/state/react';
import React from 'react';
import { View } from 'react-native';
import type { PhotoInfo } from '../FileManager';
import { KeyCodes } from '../KeyboardManager';
import { type PhotoMetadataItem, photoMetadatas$, updateMetadata } from '../PhotoMetadata';
import { state$ } from '../State';
import { SFSymbol } from '../components/SFSymbol';
import { settings$ } from '../settings/SettingsFile';
import type { PhotoPluginProps, Plugin } from './PluginTypes';

const handleFlagToggle = async (
  photo: PhotoInfo,
  photoMetadata$: Observable<PhotoMetadataItem>
) => {
  const metadata = photoMetadata$.get();
  const newValue: PhotoMetadataItem = { flag: !metadata?.flag };
  if (newValue.flag && metadata?.reject) {
    newValue.reject = false;
  }
  await updateMetadata(photo, newValue);
};

const handleRejectToggle = (photo: PhotoInfo, photoMetadata$: Observable<PhotoMetadataItem>) => {
  const metadata = photoMetadata$.get();
  const newValue: PhotoMetadataItem = { reject: !metadata?.reject };
  if (newValue.reject && metadata?.flag) {
    newValue.flag = false;
  }
  updateMetadata(photo, newValue);
};

// Flag/Reject component
function FlagRejectComponent({ photo, style }: PhotoPluginProps) {
  const photoMetadata$ = photoMetadatas$[photo.id];
  const photoMetadata = use$(photoMetadata$);

  return (
    <View className="flex-row items-center gap-x-1 h-8 pl-2" style={style}>
      {photoMetadata.flag && <SFSymbol name="flag.fill" size={16} color="white" />}
      {photoMetadata.reject && <SFSymbol name="flag.fill" size={16} color="#d00" />}
    </View>
  );
}

const getCurrentPhoto = () => {
  const index = state$.selectedPhotoIndex.get();
  const photosList = state$.photos.get();
  const folder = settings$.state.openFolder.get();

  if (index === -1 || !photosList.length || !folder || index >= photosList.length) {
    // Check if we have a valid selection
    return {};
  }

  // Get the photo details
  const photo = photosList[index];

  const photoMetadata$ = photoMetadatas$[photo.id];
  return { photo, photoMetadata$ };
};

// Helper function to toggle flag on the current photo
const toggleFlagCurrentPhoto = () => {
  const { photo, photoMetadata$ } = getCurrentPhoto();
  if (photo) {
    handleFlagToggle(photo, photoMetadata$);
  }
};

// Helper function to toggle reject on the current photo
const toggleRejectCurrentPhoto = () => {
  const { photo, photoMetadata$ } = getCurrentPhoto();
  if (photo) {
    handleRejectToggle(photo, photoMetadata$);
  }
};

// Define the Flag/Reject plugin
export const FlagRejectPlugin: Plugin = {
  id: 'flag-reject-plugin',
  name: 'Flag & Reject',
  description: 'Flag photos with Space, reject with X',
  enabled: true,
  childOf: 'photo',
  position: 'bl',
  component: FlagRejectComponent,
  shouldRender: ({ photo }: PhotoPluginProps) => {
    const photoMetadata$ = photoMetadatas$[photo.id];
    const photoMetadata = use$(photoMetadata$);

    return !!(photoMetadata && (photoMetadata.flag || photoMetadata.reject));
  },
  hotkeys: {
    // Use Space to toggle flag
    [KeyCodes.KEY_SPACE.toString()]: {
      action: toggleFlagCurrentPhoto,
      name: 'Toggle Flag',
      description: 'Toggle flag on the current photo',
      keyText: 'Space',
    },
    [KeyCodes.KEY_P.toString()]: {
      action: toggleFlagCurrentPhoto,
      name: 'Toggle Flag',
      description: 'Toggle flag on the current photo',
      keyText: 'P',
    },
    // Use X to toggle reject
    [KeyCodes.KEY_X.toString()]: {
      action: toggleRejectCurrentPhoto,
      name: 'Toggle Reject',
      description: 'Toggle reject on the current photo',
      keyText: 'X',
    },
  },
};
