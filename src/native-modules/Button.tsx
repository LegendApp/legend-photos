import React from 'react';
import {
  type GestureResponderEvent,
  StyleSheet,
  type ViewStyle,
  requireNativeComponent,
} from 'react-native';

// Define the interface for the NativeButton props
export interface ButtonProps {
  title: string;
  bezelStyle?: 'rounded' | 'regular' | 'textured' | 'disclosure';
  controlSize?: 'mini' | 'small' | 'regular' | 'large';
  onPress?: (event?: GestureResponderEvent) => void;
  style?: ViewStyle;
  testID?: string;
}

// Create the native component
const RNNativeButton = requireNativeComponent<ButtonProps>('RNNativeButton');

// NativeButton component
export function Button({
  title,
  bezelStyle = 'rounded',
  controlSize = 'regular',
  onPress,
  style,
  ...props
}: ButtonProps) {
  // Create a base style with default height and width
  const baseStyle: ViewStyle = { height: 30, minWidth: 100 };

  // Merge with provided style if any
  const mergedStyle = style ? StyleSheet.flatten([baseStyle, style]) : baseStyle;

  return (
    <RNNativeButton
      title={title}
      bezelStyle={bezelStyle}
      controlSize={controlSize}
      onPress={onPress}
      style={mergedStyle}
      {...props}
    />
  );
}
