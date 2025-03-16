import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { useSelector } from '@legendapp/state/react';
import { remapProps } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { type PhotoInfo, listPhotosInFolder } from './FileManager';
import { useBreakpoints } from './HookWindowDimensions';
import { Photo } from './Photo';
import { state$ } from './State';
import { ax } from './ax';
import { LegendList } from './src/LegendList';
import { usePhotosViewKeyboard } from './usePhotosViewKeyboard';

interface PhotosProps {
  selectedFolder: string;
}

const breakpoints = {
  640: 'sm',
  768: 'md',
  1024: 'lg',
  1280: 'xl',
} as const;

// Calculate the number of columns based on screen width
const useGridColumns = () => {
  const { breakpointWidth } = useBreakpoints(breakpoints);
  // Adjust these values based on desired photo size
  const PHOTO_MAX_SIZE = 200;

  // Calculate columns based on available width
  const columns = Math.max(1, Math.floor(breakpointWidth / PHOTO_MAX_SIZE));

  useEffect(() => {
    state$.numColumns.set(columns);
  }, [columns]);

  return columns;
};

remapProps(LegendList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

export function PhotosView({ selectedFolder }: PhotosProps) {
  const numColumns = useGridColumns();
  const photos = useSelector(state$.photos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let minDate: Date | undefined;
  let maxDate: Date | undefined;
  for (let i = 0; i < photos.length; i++) {
    const ctime = photos[i].ctime;
    if (ctime && (!minDate || ctime < minDate)) {
      minDate = ctime;
    }
    if (ctime && (!maxDate || ctime > maxDate)) {
      maxDate = ctime;
    }
  }
  let dateRange: string | undefined;
  if (minDate && maxDate) {
    if (minDate.getDate() === maxDate.getDate()) {
      dateRange = minDate.toLocaleDateString();
    } else {
      dateRange = `${minDate.toLocaleDateString()} - ${maxDate.toDateString()}`;
    }
  }

  // Set up keyboard shortcuts
  usePhotosViewKeyboard();

  useEffect(() => {
    const loadPhotos = async () => {
      if (!selectedFolder) {
        state$.photos.set([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const folderPath = `${DocumentDirectoryPath}/photos/${selectedFolder}`;
        const photosList = await listPhotosInFolder(folderPath);
        state$.photos.set(photosList);
      } catch (err) {
        console.error('Error loading photos:', err);
        setError('Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [selectedFolder]);

  const renderPhoto = ({ item, index }: { item: PhotoInfo; index: number }) => {
    const folderPath = `${DocumentDirectoryPath}/photos/${selectedFolder}`;
    return <Photo photoName={item.name} folderPath={folderPath} index={index} />;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading photos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  if (!selectedFolder) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Select a folder to view photos</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No photos found in this folder</Text>
      </View>
    );
  }

  const subtitle = ax(dateRange, `${photos.length} photos`);

  return (
    <View className="flex-1 bg-[#111]">
      <View className="flex-1">
        <LegendList
          data={photos}
          renderItem={renderPhoto}
          numColumns={numColumns}
          estimatedItemSize={200}
          keyExtractor={(item) => item.name}
          contentContainerClassName="px-4 pb-4 m-0"
          // eslint-disable-next-line react-native/no-inline-styles
          columnWrapperStyle={{ gap: 12 }}
          className="mt-[-28px]"
          ListHeaderComponent={
            <View className="py-3">
              <Text className="text-3xl font-medium text-white">{selectedFolder}</Text>
              <View className="gap-x-3 flex-row">
                {subtitle.map((t) => (
                  <Text key={t} className="text-xs font-medium text-white/60 pt-2">
                    {t}
                  </Text>
                ))}
              </View>
            </View>
          }
        />
      </View>
    </View>
  );
}
