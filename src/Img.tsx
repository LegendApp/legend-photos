import { remapProps } from 'nativewind';
import React, { memo, useState } from 'react';
import {
  Image,
  type ImageLoadEventData,
  type ImageProps,
  type ImageStyle,
  type NativeSyntheticEvent,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

interface ImgProps extends Exclude<ImageProps, 'source' | 'style'> {
  uri: string;
  style?: ImageStyle;
}

const mapAspectRatios = new Map<string, number>();

export const Img = memo(function Img({
  uri,
  onLoad: onLoadProp,
  style: styleProp,
  ...props
}: ImgProps) {
  const cachedAspectRatio = mapAspectRatios.get(uri);
  const [aspectRatio, setAspectRatio] = useState(cachedAspectRatio || 1);
  const onLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
    if (!cachedAspectRatio) {
      const ratio = e.nativeEvent.source.width / e.nativeEvent.source.height;
      mapAspectRatios.set(uri, ratio);
      setAspectRatio(ratio);
    }
    onLoadProp?.(e);
  };

  const styleImage: StyleProp<ImageStyle> = {
    aspectRatio,
    maxHeight: '100%',
    maxWidth: '100%',
    flex: 1,
    overflow: 'hidden',
    borderRadius: 4,
  };

  const styleContainer: StyleProp<ViewStyle> = {
    aspectRatio,
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
      <View style={styleContainer}>
        <Image source={{ uri }} onLoad={onLoad} {...props} style={styleImage} />
      </View>
    </View>
  );
});

remapProps(Img, {
  className: 'style',
});
