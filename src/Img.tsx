import { remapProps } from 'nativewind';
import React, { memo, useState } from 'react';
import { type ImageStyle, type StyleProp, View, type ViewStyle } from 'react-native';
import { NativeImage, type NativeImageProps } from './NativeImage';

interface ImgProps extends Exclude<NativeImageProps, 'source' | 'style'> {
  style?: ImageStyle;
}

const mapAspectRatios = new Map<string, number>();

export const Img = memo(function Img({
  imagePath,
  onLoad: onLoadProp,
  style: styleProp,
  ...props
}: ImgProps) {
  const cachedAspectRatio = mapAspectRatios.get(imagePath);
  const [_, setAspectRatio] = useState(0);
  const aspectRatio = cachedAspectRatio || 1;

  // Check if this is a local file path - starts with / or file:// or ~

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

  return (
    <View style={style}>
      <NativeImage
        imagePath={imagePath}
        style={styleImage}
        borderRadius={4}
        onLoad={(e) => {
          if (!cachedAspectRatio) {
            const ratio = e.nativeEvent.source.width / e.nativeEvent.source.height;
            mapAspectRatios.set(imagePath, ratio);
            setAspectRatio(ratio);
          }
          onLoadProp?.(e);
        }}
        {...props}
      />
    </View>
  );
});

remapProps(Img, {
  className: 'style',
});
