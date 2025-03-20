import { useSelector } from '@legendapp/state/react';
import { remapProps } from 'nativewind';
import React, { memo, useCallback, useRef } from 'react';
import {
  Image,
  type ImageStyle,
  type NativeSyntheticEvent,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import type { PhotoInfo } from './FileManager';
import { NativeImage, type NativeImageLoadEvent, type NativeImageProps } from './NativeImage';
import { photoMetadatas$ } from './PhotoMetadata';
import { getPhotoPath } from './utils/photoHelpers';

interface ImgProps extends Exclude<NativeImageProps, 'imagePath' | 'style'> {
  style?: ImageStyle;
  native: boolean;
  photo: PhotoInfo;
}

export const Img = memo(function Img({
  photo,
  onLoad: onLoadProp,
  style: styleProp,
  native,
  ...props
}: ImgProps) {
  const imagePath = getPhotoPath(photo);
  const metadata$ = photoMetadatas$[photo.id];
  const aspectRatio = useSelector(metadata$.aspect) || 1;
  const refImagePath = useRef(imagePath);
  refImagePath.current = imagePath;

  const onLoad = useCallback(
    (e: NativeSyntheticEvent<NativeImageLoadEvent>) => {
      if (!metadata$.aspect.get()) {
        const ratio = +(e.nativeEvent.source.width / e.nativeEvent.source.height).toFixed(2);
        metadata$.aspect.set(ratio);
      }
      onLoadProp?.(e);
    },
    [metadata$, onLoadProp]
  );

  const styleImage: StyleProp<ImageStyle> = {
    aspectRatio,
    maxHeight: '100%',
    maxWidth: '100%',
    flex: 1,
    overflow: 'hidden',
    borderRadius: 4,
  };

  const style: StyleProp<ViewStyle> = {
    ...styleProp,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const image = native ? (
    <NativeImage
      imagePath={imagePath}
      style={styleImage}
      borderRadius={4}
      onLoad={onLoad}
      {...props}
    />
  ) : (
    <View className="rounded overflow-hidden">
      <Image source={{ uri: imagePath! }} style={styleImage} onLoad={onLoad} {...props} />
    </View>
  );

  return <View style={style}>{image}</View>;
});

remapProps(Img, {
  className: 'style',
});
