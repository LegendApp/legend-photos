import React from 'react';
import { Platform, StyleSheet, View, type ViewStyle, requireNativeComponent } from 'react-native';
import type { SFSymbols } from '../types/SFSymbols';

// Define the interface for the SFSymbol props
interface SFSymbolProps {
  name: SFSymbols;
  color?: string;
  scale?: 'small' | 'medium' | 'large';
  size?: number;
  style?: ViewStyle;
  testID?: string;
}

// Create the native component
const RNSFSymbol = requireNativeComponent<SFSymbolProps>('RNSFSymbol');

// SFSymbol component
export function SFSymbol({ name, color, scale = 'medium', size, style, ...props }: SFSymbolProps) {
  // For macOS, use the native component
  if (Platform.OS === 'macos' && RNSFSymbol) {
    // Create a base style with default height and width
    const baseStyle: ViewStyle = { height: size || 24, width: size || 24 };

    // Merge with provided style if any
    const mergedStyle = style ? StyleSheet.flatten([baseStyle, style]) : baseStyle;

    return (
      <RNSFSymbol
        name={name}
        color={color}
        scale={scale}
        size={size}
        style={mergedStyle}
        {...props}
      />
    );
  }

  // Fallback for other platforms
  return <View style={[styles.placeholder, style]} {...props} />;
}

const styles = StyleSheet.create({
  placeholder: {
    width: 24,
    height: 24,
    backgroundColor: '#EEEEEE',
  },
});
