import { remapProps } from 'nativewind';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Image } from 'react-native';
import {
  type ImageStyle,
  type NativeSyntheticEvent,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { NativeImage, type NativeImageProps } from './NativeImage';

interface ImgProps extends Exclude<NativeImageProps, 'source' | 'style'> {
  style?: ImageStyle;
  native: boolean;
}

const mapAspectRatios = new Map<string, number>();

export const Img = memo(function Img({
  imagePath,
  onLoad: onLoadProp,
  style: styleProp,
  native,
  ...props
}: ImgProps) {
  const cachedAspectRatio = mapAspectRatios.get(imagePath);
  const [_, setAspectRatio] = useState(0);
  const aspectRatio = cachedAspectRatio || 1;
  const refImagePath = useRef(imagePath);
  refImagePath.current = imagePath;

  const onLoad = useCallback(
    (e: NativeSyntheticEvent<{ source: { width: number; height: number } }>) => {
      if (!cachedAspectRatio) {
        const ratio = e.nativeEvent.source.width / e.nativeEvent.source.height;
        mapAspectRatios.set(refImagePath.current, ratio);
        setAspectRatio(ratio);
      }
      onLoadProp?.(e);
    },
    [cachedAspectRatio, onLoadProp]
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
      <Image source={{ uri: imagePath }} style={styleImage} onLoad={onLoad} {...props} />
    </View>
  );

  return <View style={style}>{image}</View>;
});

remapProps(Img, {
  className: 'style',
});
