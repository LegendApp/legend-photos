import React, { useRef } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { showFullscreenPhoto, sidebarWidth$ } from './State';

interface PhotoProps {
  photoName: string;
  folderPath: string;
}

export const Photo = ({ photoName, folderPath }: PhotoProps) => {
  const photoUri = `file://${folderPath}/${photoName}`;
  const photoRef = useRef<View>(null);

  const handlePress = () => {
    if (photoRef.current) {
      photoRef.current.measureInWindow((x, y, width, height) => {
        showFullscreenPhoto({
          uri: photoUri,
          initialPosition: {
            x,
            y,
            width,
            height,
          },
        });
      });
    }
  };

  return (
    <View ref={photoRef} style={styles.photoContainer}>
      <Pressable
        onPress={handlePress}
        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        style={styles.pressable}
      >
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
      </Pressable>
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
  pressable: {
    width: '100%',
    height: '100%',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
