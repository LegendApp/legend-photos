import { useSelector } from '@legendapp/state/react';
import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import type { PhotoInfo } from './FileManager';
import { Img } from './Img';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { fullscreenView, state$ } from './State';
import { PluginRenderer } from './plugins';
import { useOnDoubleClick } from './useOnDoubleClick';
import { getPhotoUri } from './utils/photoHelpers';

export interface PhotoProps {
  photo: PhotoInfo;
  folderPath: string;
  index: number;
}

export const Photo = ({ photo, index }: PhotoProps) => {
  const photoUri = getPhotoUri(photo);
  const photoRef = useRef<View>(null);
  const selectedIndex = useSelector(state$.selectedPhotoIndex);
  const isSelected = selectedIndex === index;

  const openFullscreen = () => {
    const view = photoRef.current;
    if (view && !state$.fullscreenPhoto.get()) {
      view.measureInWindow((x, y, width, height) => {
        fullscreenView.current = view;
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
        <Img uri={photoUri!} className="w-full h-full" resizeMode={'cover'} />
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
