import { useSelector } from '@legendapp/state/react';
import React, { useRef } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { state$ } from './State';
import { PluginRenderer } from './plugins';
import { useOnDoubleClick } from './useOnDoubleClick';

export interface PhotoProps {
  photoName: string;
  folderPath: string;
  index: number;
}

export const Photo = (photo: PhotoProps) => {
  const { photoName, folderPath, index } = photo;
  const photoUri = `file://${folderPath}/${photoName}`;
  const photoRef = useRef<View>(null);
  const selectedIndex = useSelector(state$.selectedPhotoIndex);
  const isSelected = selectedIndex === index;

  const openFullscreen = () => {
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

  const onPress = useOnDoubleClick({
    onClick: () => state$.selectedPhotoIndex.set(index),
    onDoubleClick: openFullscreen,
  });

  useOnHotkeys({
    [KeyCodes.KEY_RETURN]: () => {
      if (state$.selectedPhotoIndex.get() === index) {
        openFullscreen();
      }
    },
  });

  return (
    <View ref={photoRef} className="aspect-square rounded-lg overflow-hidden bg-black/5">
      <Pressable onPress={onPress} className="w-full h-full">
        <Image source={{ uri: photoUri }} className="w-full h-full" resizeMode={'cover'} />
        {isSelected && (
          <View className="absolute inset-0 border-2 border-white/90 rounded-lg pointer-events-none" />
        )}

        <PluginRenderer
          location="photo"
          className="bg-black/40 absolute bottom-0 left-0 right-0 h-7"
          props={{ photo }}
        />
      </Pressable>
    </View>
  );
};
