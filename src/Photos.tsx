import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { observable } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { listPhotosInFolder } from './FileManager';
import { LegendList } from './src/LegendList';

interface PhotosProps {
  selectedFolder: string;
}

// Observable state for photos
const photos$ = observable<string[]>([]);

// Calculate the number of columns based on screen width
const useGridColumns = () => {
  const { width } = useWindowDimensions();
  // Adjust these values based on desired photo size
  const PHOTO_MAX_SIZE = 200;

  // Calculate columns based on available width
  const columns = Math.max(1, Math.floor(width / PHOTO_MAX_SIZE));
  return columns;
};

function PhotosApp({ selectedFolder }: PhotosProps) {
  const numColumns = useGridColumns();
  const photos = useSelector(photos$);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const renderPhoto = ({ item }: { item: string; index: number }) => {
    const folderPath = `${DocumentDirectoryPath}/photos/${selectedFolder}`;
    const photoUri = `file://${folderPath}/${item}`;

    return (
      <View style={styles.photoContainer}>
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
      </View>
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
    <View style={styles.container}>
      <LegendList
        data={photos}
        renderItem={renderPhoto}
        numColumns={numColumns}
        estimatedItemSize={200}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 4,
  },
  photoContainer: {
    flex: 1,
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

export default PhotosApp;
