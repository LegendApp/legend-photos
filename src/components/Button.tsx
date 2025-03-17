import React from 'react';
import {
  type GestureResponderEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { NativeButton } from './NativeButton';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  className = '',
  onPress,
  style,
  ...props
}: ButtonProps) {
  // Use native macOS button
  if (Platform.OS === 'macos') {
    // Map our size to native control size
    const controlSize = {
      small: 'small',
      medium: 'regular',
      large: 'large',
    }[size] as 'small' | 'regular' | 'large';

    // Map variant to bezel style
    const bezelStyle = {
      primary: 'rounded',
      secondary: 'regular',
      danger: 'textured',
    }[variant] as 'rounded' | 'regular' | 'textured';

    // Convert the onPress handler to be compatible with NativeButton
    const handlePress = onPress
      ? (event?: GestureResponderEvent) => onPress?.(event as GestureResponderEvent)
      : undefined;

    // Add default height for the button
    const buttonStyle = StyleSheet.flatten([{ height: 30, minWidth: 100 }, style]);

    return (
      <NativeButton
        title={title}
        controlSize={controlSize}
        bezelStyle={bezelStyle}
        onPress={handlePress}
        style={buttonStyle}
        testID={props.testID}
      />
    );
  }

  // For other platforms, use the existing styled TouchableOpacity
  // Determine background color based on variant
  const bgClass = {
    primary: 'bg-[#3478F6]',
    secondary: 'bg-[#444444]',
    danger: 'bg-[#E53E3E]',
  }[variant];

  // Determine text color based on variant
  const textClass = 'text-white';

  // Determine padding based on size
  const sizeClass = {
    small: 'py-1 px-3',
    medium: 'py-1.5 px-4',
    large: 'py-2 px-5',
  }[size];

  // Determine text size based on button size
  const textSizeClass = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }[size];

  return (
    <TouchableOpacity
      className={`rounded-md ${bgClass} ${sizeClass} ${className}`}
      activeOpacity={0.7}
      onPress={onPress}
      style={style}
      {...props}
    >
      <Text className={`font-medium ${textClass} ${textSizeClass}`}>{title}</Text>
    </TouchableOpacity>
  );
}
