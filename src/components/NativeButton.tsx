import React from 'react';
import {
  type GestureResponderEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
  requireNativeComponent,
} from 'react-native';

// Define the interface for the NativeButton props
interface NativeButtonProps {
  title: string;
  bezelStyle?: 'rounded' | 'regular' | 'textured' | 'disclosure';
  controlSize?: 'mini' | 'small' | 'regular' | 'large';
  onPress?: (event?: GestureResponderEvent) => void;
  style?: ViewStyle;
  testID?: string;
}

// Create the native component
const RNNativeButton =
  Platform.OS === 'macos' ? requireNativeComponent<NativeButtonProps>('RNNativeButton') : null;

// NativeButton component
export function NativeButton({
  title,
  bezelStyle = 'rounded',
  controlSize = 'regular',
  onPress,
  style,
  ...props
}: NativeButtonProps) {
  // For macOS, use the native button
  if (Platform.OS === 'macos' && RNNativeButton) {
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

  // Fallback for other platforms
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.7}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3478F6',
    padding: 8,
    borderRadius: 6,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
