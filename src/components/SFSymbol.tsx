import React from 'react';
import { Platform, StyleSheet, View, type ViewStyle, requireNativeComponent } from 'react-native';

// Define the interface for the SFSymbol props
interface SFSymbolProps {
  name: string;
  color?: string;
  weight?: 'ultralight' | 'light' | 'thin' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';
  scale?: 'small' | 'medium' | 'large';
  size?: number;
  multicolor?: boolean;
  style?: ViewStyle;
  testID?: string;
}

// Create the native component
const RNSFSymbol =
  Platform.OS === 'macos' ? requireNativeComponent<SFSymbolProps>('RNSFSymbol') : null;

// SFSymbol component
export function SFSymbol({
  name,
  color,
  weight = 'regular',
  scale = 'medium',
  size,
  multicolor = false,
  style,
  ...props
}: SFSymbolProps) {
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
        weight={weight}
        scale={scale}
        size={size}
        multicolor={multicolor}
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
