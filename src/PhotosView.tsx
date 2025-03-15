import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { useSelector } from '@legendapp/state/react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { listPhotosInFolder } from './FileManager';
import { useBreakpoints } from './HookWindowDimensions';
import { Photo } from './Photo';
import { usePhotosKeyboardManager } from './PhotosKeyboardManager';
import { photos$, selectedPhotoIndex$ } from './State';
import { LegendList } from './src/LegendList';

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

  return columns;
};

export function PhotosView({ selectedFolder }: PhotosProps) {
  const numColumns = useGridColumns();
  const photos = useSelector(photos$);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Set up keyboard shortcuts
  usePhotosKeyboardManager(isFullscreen, setIsFullscreen, handleDeletePhoto);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!selectedFolder) {
        photos$.set([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const folderPath = `${DocumentDirectoryPath}/photos/${selectedFolder}`;
        const photosList = await listPhotosInFolder(folderPath);
        photos$.set(photosList);
      } catch (err) {
        console.error('Error loading photos:', err);
        setError('Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [selectedFolder]);

  // Function to handle photo deletion
  function handleDeletePhoto(index: number) {
    // Implement photo deletion logic here
    console.log(`Delete photo at index ${index}`);

    // For now, just remove it from the array
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    photos$.set(newPhotos);

    // Adjust selected index if needed
    const currentIndex = selectedPhotoIndex$.get() ?? 0;
    if (currentIndex >= newPhotos.length) {
      selectedPhotoIndex$.set(Math.max(0, newPhotos.length - 1));
    }
  }

  const renderPhoto = ({ item, index }: { item: string; index: number }) => {
    const folderPath = `${DocumentDirectoryPath}/photos/${selectedFolder}`;
    return (
      <Photo
        photoName={item}
        folderPath={folderPath}
        index={index}
        selectedPhotoIndex$={selectedPhotoIndex$}
        isFullscreen={isFullscreen}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading photos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!selectedFolder) {
    return (
      <View style={styles.centerContainer}>
        <Text>Select a folder to view photos</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No photos found in this folder</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreen]}>
      <LegendList
        data={photos}
        renderItem={renderPhoto}
        numColumns={isFullscreen ? 1 : numColumns}
        estimatedItemSize={isFullscreen ? 500 : 200}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 4,
  },
  photoContainer: {
    margin: 4,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: 'red',
  },
});
