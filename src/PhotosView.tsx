import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { useSelector } from '@legendapp/state/react';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { listPhotosInFolder } from './FileManager';
import { useBreakpoints } from './HookWindowDimensions';
import { Photo } from './Photo';
import { state$ } from './State';
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

export function PhotosView({ selectedFolder }: PhotosProps) {
  const numColumns = useGridColumns();
  const photos = useSelector(state$.photos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const renderPhoto = ({ item, index }: { item: string; index: number }) => {
    const folderPath = `${DocumentDirectoryPath}/photos/${selectedFolder}`;
    return <Photo photoName={item} folderPath={folderPath} index={index} />;
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
    <View style={[styles.container]}>
      <LegendList
        data={photos}
        renderItem={renderPhoto}
        numColumns={numColumns}
        estimatedItemSize={200}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  list: {
    marginTop: -28,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
    margin: 0,
  },
  columnWrapper: {
    gap: 12,
  },

  photo: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: 'red',
  },
});
