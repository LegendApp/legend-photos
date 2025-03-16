import { use$ } from '@legendapp/state/react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { metadata$, updateMetadata } from './PhotoMetadata';
import { state$ } from './State';

export function PhotoMetadataControls() {
  // Observe state
  const selectedIndex$ = state$.selectedPhotoIndex;
  const photos$ = state$.photos;
  const selectedFolder$ = state$.selectedFolder;
  const index = use$(selectedIndex$);
  const photosList = use$(photos$);
  const folder = use$(selectedFolder$);

  const photoName = photosList[index];
  const photoId = `${folder}/${photoName}`;
  const photoMetadata$ = metadata$[photoId];
  const photoMetadata = use$(photoMetadata$);

  // If no valid selection, don't render anything
  if (!photoMetadata) {
    return null;
  }

  const handleRatingChange = async (rating: number) => {
    await updateMetadata(photoId, { rating });
  };

  const handleFlagToggle = async () => {
    const newValue = !photoMetadata$.flag.get();
    photoMetadata$.flag.set(newValue);
    await updateMetadata(photoId, { flag: newValue });
  };

  const handleRejectToggle = async () => {
    const newValue = !photoMetadata$.reject.get();
    photoMetadata$.reject.set(newValue);
    await updateMetadata(photoId, { reject: newValue });
  };

  // Render star ratings (1-5)
  const renderRatingStars = () => {
    const stars = [];
    const currentRating = photoMetadata$.rating.get() || 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable
          key={i}
          onPress={() => handleRatingChange(i)}
          className="w-8 h-8 items-center justify-center"
        >
          <Text className={`text-2xl ${i <= currentRating ? 'text-yellow-400' : 'text-gray-500'}`}>
            ★
          </Text>
        </Pressable>
      );
    }

    return (
      <View className="flex-row items-center">
        <Text className="text-white mr-2">Rating:</Text>
        <View className="flex-row">{stars}</View>
      </View>
    );
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 rounded-lg">
      <Text className="text-white text-lg mb-2">Photo: {photoName}</Text>

      {renderRatingStars()}

      <View className="flex-row mt-4 space-x-4 gap-4">
        <Pressable
          onPress={handleFlagToggle}
          className={`px-4 py-2 rounded-md ${photoMetadata.flag ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          <Text className="text-white">Flag</Text>
        </Pressable>

        <Pressable
          onPress={handleRejectToggle}
          className={`px-4 py-2 rounded-md ${photoMetadata.reject ? 'bg-red-600' : 'bg-gray-700'}`}
        >
          <Text className="text-white">Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}
