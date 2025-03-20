import React, { memo } from 'react';
import {
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
  requireNativeComponent,
} from 'react-native';

export interface NativeImageLoadEvent {
  source: {
    width: number;
    height: number;
    path: string;
  };
}

export interface NativeImageProps {
  imagePath: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  borderRadius?: number;
  onLoad?: (event: NativeSyntheticEvent<NativeImageLoadEvent>) => void;
  onError?: (
    event: NativeSyntheticEvent<{
      error: {
        message: string;
        path: string;
      };
    }>
  ) => void;
  [key: string]: any; // Allow for additional props
}

// Import the native component
const RCTNativeImage = requireNativeComponent<NativeImageProps>('NativeImage');

export const NativeImage = memo(function NativeImage({
  imagePath,
  style,
  onLoad,
  borderRadius = 0,
  ...props
}: NativeImageProps) {
  return (
    <RCTNativeImage
      imagePath={imagePath}
      style={style}
      borderRadius={borderRadius}
      onLoad={onLoad}
      {...props}
    />
  );
});
