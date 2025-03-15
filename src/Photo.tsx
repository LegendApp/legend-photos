import type { ObservablePrimitive } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import React, { useRef } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { showFullscreenPhoto } from './State';

interface PhotoProps {
  photoName: string;
  folderPath: string;
  index: number;
  selectedPhotoIndex$: ObservablePrimitive<number | null>;
  isFullscreen?: boolean;
}

export const Photo = ({
  photoName,
  folderPath,
  index,
  selectedPhotoIndex$,
  isFullscreen = false,
}: PhotoProps) => {
  const photoUri = `file://${folderPath}/${photoName}`;
  const photoRef = useRef<View>(null);
  const selectedIndex = useSelector(selectedPhotoIndex$);
  const isSelected = selectedIndex === index;

  const handlePress = () => {
    selectedPhotoIndex$.set(index);
    if (photoRef.current && !isFullscreen) {
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
    <View
      ref={photoRef}
      style={[styles.photoContainer, isFullscreen && styles.fullscreenContainer]}
    >
      <Pressable onPress={handlePress} style={styles.pressable}>
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
          resizeMode={isFullscreen ? 'contain' : 'cover'}
        />
        {isSelected && <View style={styles.selectionBorder} />}
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
    borderWidth: 3,
    borderColor: 'yellow',
    borderRadius: 8,
    pointerEvents: 'none',
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
