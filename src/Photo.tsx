import { useSelector } from '@legendapp/state/react';
import React, { useRef } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { state$ } from './State';

interface PhotoProps {
  photoName: string;
  folderPath: string;
  index: number;
}

export const Photo = ({ photoName, folderPath, index }: PhotoProps) => {
  const photoUri = `file://${folderPath}/${photoName}`;
  const photoRef = useRef<View>(null);
  const selectedIndex = useSelector(state$.selectedPhotoIndex);
  const isSelected = selectedIndex === index;

  const handlePress = () => {
    state$.selectedPhotoIndex.set(index);
    if (photoRef.current && !state$.fullscreenPhoto.get()) {
      photoRef.current.measureInWindow((x, y, width, height) => {
        state$.fullscreenPhoto.set({
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
    <View ref={photoRef} style={[styles.photoContainer]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode={'cover'} />
        {isSelected && <View style={styles.selectionBorder} />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    // margin: 4,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  fullscreenContainer: {
    margin: 0,
    aspectRatio: undefined,
    borderRadius: 0,
    flex: 1,
    backgroundColor: 'black',
  },
  selectionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    pointerEvents: 'none',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
