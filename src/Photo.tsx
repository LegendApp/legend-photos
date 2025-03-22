import { useSelector } from '@legendapp/state/react';
import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import type { PhotoInfo } from './FileManager';
import { Img } from './Img';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { fullscreenView, state$ } from './State';
import { PluginRenderer } from './plugin-system/registerDefaultPlugins';
import { useOnDoubleClick } from './useOnDoubleClick';

export interface PhotoProps {
  photo: PhotoInfo;
  index: number;
}

export const Photo = ({ photo, index }: PhotoProps) => {
  const photoRef = useRef<View>(null);
  const isSelected = useSelector(() => state$.selectedPhotoIndex.get() === index);
  if (isSelected) {
    const view = photoRef.current;
    fullscreenView.current = view;
  }

  const openFullscreen = () => {
    const view = photoRef.current;
    if (view && !state$.fullscreenPhoto.get()) {
      fullscreenView.current = view;
      view.measureInWindow((x, y, width, height) => {
        state$.fullscreenPhoto.set({
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
    [KeyCodes.KEY_RETURN]: {
      action: () => {
        if (state$.selectedPhotoIndex.get() === index) {
          openFullscreen();
        }
      },
      name: 'Open Photo',
      description: 'Open selected photo in fullscreen',
      keyText: 'Return',
    },
  });

  return (
    <View ref={photoRef} className="aspect-square rounded-lg overflow-hidden">
      <Pressable onPress={onPress} className="w-full h-full">
        <Img photo={photo} className="w-full h-full" resizeMode={'cover'} native={false} />
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
