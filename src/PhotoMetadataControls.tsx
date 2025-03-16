import { use$, useObservable } from '@legendapp/state/react';
import React, { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { type PhotoMetadataItem, getMetadata, updateMetadata } from './PhotoMetadata';
import { state$ } from './State';

export function PhotoMetadataControls() {
  // Observe state
  const selectedIndex$ = state$.selectedPhotoIndex;
  const photos$ = state$.photos;
  const selectedFolder$ = state$.selectedFolder;
  const index = use$(selectedIndex$);
  const photosList = use$(photos$);
  const folder = use$(selectedFolder$);

  // Default metadata values
  const defaultMetadata = useMemo(
    () => ({
      rating: 0,
      tags: [],
      flag: false,
      reject: false,
    }),
    []
  );

  // Local state for the metadata
  const localMetadata$ = useObservable<PhotoMetadataItem>(defaultMetadata);
  const localMetadata = use$(localMetadata$);

  // Compute current photo info
  const photoInfo = useMemo(() => {
    // Check if we have a valid selection
    if (index === -1 || !photosList.length || !folder || index >= photosList.length) {
      return null;
    }

    // Get the photo details
    const photoName = photosList[index];
    const photoId = `${folder}/${photoName}`;

    return { photoName, photoId };
  }, [index, photosList, folder]);

  // Load metadata when photo changes
  useEffect(() => {
    if (photoInfo) {
      const metadata = getMetadata(photoInfo.photoId);
      localMetadata$.set({
        ...defaultMetadata,
        ...metadata,
      });
    }
  }, [photoInfo, defaultMetadata, localMetadata$]);

  // If no valid selection, don't render anything
  if (!photoInfo) {
    return null;
  }

  const handleRatingChange = async (rating: number) => {
    localMetadata$.rating.set(rating);
    await updateMetadata(photoInfo.photoId, { rating });
  };

  const handleFlagToggle = async () => {
    const newValue = !localMetadata$.flag.get();
    localMetadata$.flag.set(newValue);
    await updateMetadata(photoInfo.photoId, { flag: newValue });
  };

  const handleRejectToggle = async () => {
    const newValue = !localMetadata$.reject.get();
    localMetadata$.reject.set(newValue);
    await updateMetadata(photoInfo.photoId, { reject: newValue });
  };

  // Render star ratings (1-5)
  const renderRatingStars = () => {
    const stars = [];
    const currentRating = localMetadata$.rating.get() || 0;

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
      <Text className="text-white text-lg mb-2">Photo: {photoInfo.photoName}</Text>

      {renderRatingStars()}

      <View className="flex-row mt-4 space-x-4 gap-4">
        <Pressable
          onPress={handleFlagToggle}
          className={`px-4 py-2 rounded-md ${localMetadata.flag ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          <Text className="text-white">Flag</Text>
        </Pressable>

        <Pressable
          onPress={handleRejectToggle}
          className={`px-4 py-2 rounded-md ${localMetadata.reject ? 'bg-red-600' : 'bg-gray-700'}`}
        >
          <Text className="text-white">Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}
