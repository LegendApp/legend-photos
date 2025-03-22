import { use$ } from '@legendapp/state/react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { PhotoPluginProps, Plugin } from '../plugin-system/PluginTypes';
import { settings$ } from '../settings/SettingsFile';
import { getMetadata, photoMetadatas$, updateMetadata } from '../systems/PhotoMetadata';
import { state$ } from '../systems/State';
import { KeyCodes } from '../systems/keyboard/KeyboardManager';

// Rating component that will be rendered
function RatingComponent({ photo, style }: PhotoPluginProps) {
  const photoMetadata$ = photoMetadatas$[photo.id];

  const handleRatingChange = async (rating: number) => {
    await updateMetadata(photo, { rating });
  };

  // Render star ratings (1-5)
  const stars = [];
  const currentRating = photoMetadata$.rating.get() || 0;

  for (let i = 1; i <= currentRating; i++) {
    stars.push(
      <Pressable
        key={i}
        onPress={() => handleRatingChange(i)}
        className="items-center justify-center"
      >
        <Text className="text-lg text-yellow-400/80">★</Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center justify-end pr-2 gap-x-1 h-7" style={style}>
      {stars}
    </View>
  );
}

// Helper function to rate the current photo
const rateCurrentPhoto = (ratingProp: number) => {
  const index = state$.selectedPhotoIndex.get();
  const photosList = state$.photos.get();
  const folder = settings$.state.openFolder.get();

  // Check if we have a valid selection
  if (index === -1 || !photosList.length || !folder || index >= photosList.length) {
    return;
  }

  // Get the photo details
  const photo = photosList[index];

  const metadata = getMetadata(photo);

  const rating = ratingProp === metadata?.rating ? 0 : ratingProp;

  // Update the metadata
  updateMetadata(photo, { rating });
};

// Define the Rating plugin
export const PluginRating: Plugin = {
  id: 'rating-plugin',
  name: 'Photo Rating',
  description: 'Rate photos using hotkeys 1-5',
  enabled: true,
  childOf: 'photo',
  position: 'br',
  component: RatingComponent,
  shouldRender: ({ photo }: PhotoPluginProps) => {
    const photoMetadata$ = photoMetadatas$[photo.id];
    const photoMetadata = use$(photoMetadata$);
    return !!photoMetadata && photoMetadata.rating! > 0;
  },
  hotkeys: {
    // Use number keys 1-5 to set rating
    [KeyCodes.KEY_0.toString()]: {
      action: () => rateCurrentPhoto(0),
      name: 'Rate 0',
      description: 'Rate photo 0',
      keyText: '0',
    },
    [KeyCodes.KEY_1.toString()]: {
      action: () => rateCurrentPhoto(1),
      name: 'Rate 1',
      description: 'Rate photo 1',
      keyText: '1',
    },
    [KeyCodes.KEY_2.toString()]: {
      action: () => rateCurrentPhoto(2),
      name: 'Rate 2',
      description: 'Rate photo 2',
      keyText: '2',
    },
    [KeyCodes.KEY_3.toString()]: {
      action: () => rateCurrentPhoto(3),
      name: 'Rate 3',
      description: 'Rate photo 3',
      keyText: '3',
    },
    [KeyCodes.KEY_4.toString()]: {
      action: () => rateCurrentPhoto(4),
      name: 'Rate 4',
      description: 'Rate photo 4',
      keyText: '4',
    },
    [KeyCodes.KEY_5.toString()]: {
      action: () => rateCurrentPhoto(5),
      name: 'Rate 5',
      description: 'Rate photo 5',
      keyText: '5',
    },
  },
};
