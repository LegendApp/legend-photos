import { use$ } from '@legendapp/state/react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { KeyCodes } from '../KeyboardManager';
import type { PhotoProps } from '../Photo';
import { getMetadata, metadata$, updateMetadata } from '../PhotoMetadata';
import { state$ } from '../State';
import type { Plugin } from './PluginTypes';

interface RatingPluginProps {
  photo: PhotoProps;
}

// Rating component that will be rendered
function RatingComponent({ photo }: RatingPluginProps) {
  const photoName = photo.photoName;
  const selectedFolder = use$(state$.selectedFolder);
  const photoId = `${selectedFolder}/${photoName}`;
  const photoMetadata$ = metadata$[photoId];

  const handleRatingChange = async (rating: number) => {
    await updateMetadata(photoId, { rating });
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
    <View className="absolute bottom-0 right-0 flex-row items-center justify-end pr-2 gap-x-1 h-7">
      {stars}
    </View>
  );
}

// Helper function to rate the current photo
const rateCurrentPhoto = (ratingProp: number) => {
  const index = state$.selectedPhotoIndex.get();
  const photosList = state$.photos.get();
  const folder = state$.selectedFolder.get();

  // Check if we have a valid selection
  if (index === -1 || !photosList.length || !folder || index >= photosList.length) {
    return;
  }

  // Get the photo details
  const photoName = photosList[index].name;
  const photoId = `${folder}/${photoName}`;

  const metadata = getMetadata(photoId);

  const rating = ratingProp === metadata?.rating ? 0 : ratingProp;

  // Update the metadata
  updateMetadata(photoId, { rating });
};

// Define the Rating plugin
export const RatingPlugin: Plugin = {
  id: 'rating-plugin',
  name: 'Photo Rating',
  description: 'Rate photos using hotkeys 1-5',
  enabled: true,
  childOf: 'photo',
  component: RatingComponent,
  shouldRender: ({ photo }: { photo: PhotoProps }) => {
    const photoName = photo.photoName;
    const selectedFolder = use$(state$.selectedFolder);
    const photoId = `${selectedFolder}/${photoName}`;
    const photoMetadata$ = metadata$[photoId];
    const photoMetadata = use$(photoMetadata$);
    return !!photoMetadata && photoMetadata.rating! > 0;
  },
  hotkeys: {
    // Use number keys 1-5 to set rating
    [KeyCodes.KEY_0.toString()]: () => rateCurrentPhoto(0),
    [KeyCodes.KEY_1.toString()]: () => rateCurrentPhoto(1),
    [KeyCodes.KEY_2.toString()]: () => rateCurrentPhoto(2),
    [KeyCodes.KEY_3.toString()]: () => rateCurrentPhoto(3),
    [KeyCodes.KEY_4.toString()]: () => rateCurrentPhoto(4),
    [KeyCodes.KEY_5.toString()]: () => rateCurrentPhoto(5),
  },
};
