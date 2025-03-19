import { remapProps } from 'nativewind';
import React, { useState } from 'react';
import {
  Image,
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

export function Img({ uri, onLoad: onLoadProp, style: styleProp, ...props }: ImgProps) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const onLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
    setAspectRatio(e.nativeEvent.source.width / e.nativeEvent.source.height);
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
}

remapProps(Img, {
  className: 'style',
});
