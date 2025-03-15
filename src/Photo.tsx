import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface PhotoProps {
  photoName: string;
  folderPath: string;
}

export const Photo = ({ photoName, folderPath }: PhotoProps) => {
  const photoUri = `file://${folderPath}/${photoName}`;

  return (
    <View style={styles.photoContainer}>
      <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
