import { getOpenFolder } from '@/plugin-system/FileSources';
import type { DisplayPlugin, PhotoPluginProps } from '@/plugin-system/PluginTypes';
import { getMetadata, photoMetadatas$, updateMetadata } from '@/systems/PhotoMetadata';
import { state$ } from '@/systems/State';
import { use$ } from '@legendapp/state/react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

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
  const folder = getOpenFolder();

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
export const PluginRating: DisplayPlugin = {
  type: 'display',
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
    'Rate 0': () => rateCurrentPhoto(0),
    'Rate 1': () => rateCurrentPhoto(1),
    'Rate 2': () => rateCurrentPhoto(2),
    'Rate 3': () => rateCurrentPhoto(3),
    'Rate 4': () => rateCurrentPhoto(4),
    'Rate 5': () => rateCurrentPhoto(5),
  },
};
