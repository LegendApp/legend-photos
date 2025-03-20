import { remapProps } from 'nativewind';
import React, { memo, useState } from 'react';
import {
  type ImageProps,
  type ImageStyle,
  Platform,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { NativeImage } from './NativeImage';

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
  const [_, setAspectRatio] = useState(0);
  const aspectRatio = cachedAspectRatio || 1;

  // Check if this is a local file path - starts with / or file:// or ~
  const isLocalFile = uri.startsWith('/') || uri.startsWith('file://') || uri.startsWith('~');

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

  //   Use NativeImage for local files on macOS to get better performance
  if (Platform.OS === 'macos' && isLocalFile) {
    // Clean up file:// prefix if present
    const imagePath = uri.startsWith('file://') ? uri.substring(7) : uri;

    return (
      <View style={style}>
        <View style={styleContainer}>
          <NativeImage
            imagePath={imagePath}
            style={styleImage}
            borderRadius={4}
            onLoad={(e) => {
              if (!cachedAspectRatio) {
                const ratio = e.nativeEvent.source.width / e.nativeEvent.source.height;
                mapAspectRatios.set(uri, ratio);
                setAspectRatio(ratio);
              }
              onLoadProp?.(undefined as any);
            }}
            {...props}
          />
        </View>
      </View>
    );
  }

  return null;

  //   // Default implementation for network images or other platforms
  //   const onLoad = (e: NativeImageLoadEvent) => {
  //     if (!cachedAspectRatio) {
  //       const ratio = e.nativeEvent.source.width / e.nativeEvent.source.height;
  //       mapAspectRatios.set(uri, ratio);
  //       setAspectRatio(ratio);
  //     }
  //     // onLoadProp?.(e);
  //   };

  //   const styleImage: StyleProp<ImageStyle> = {
  //     aspectRatio,
  //     maxHeight: '100%',
  //     maxWidth: '100%',
  //     flex: 1,
  //     overflow: 'hidden',
  //     borderRadius: 4,
  //   };

  //   const styleContainer: StyleProp<ViewStyle> = {
  //     aspectRatio,
  //   };

  //   const style: StyleProp<ViewStyle> = {
  //     ...styleProp,
  //     flex: 1,
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   };

  //   const imagePath = uri.startsWith('file://') ? uri.substring(7) : uri;

  //   return (
  //     // <View style={style}>
  //     //   <View style={styleContainer}>
  //     <NativeImage imagePath={imagePath} onLoad={onLoad} style={styleProp} {...props} />
  //     //   </View>
  //     // </View>
  //   );
});

remapProps(Img, {
  className: 'style',
});
