import { ColorPickerModule } from '@/native-modules/ColorPickerModule';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  label?: string;
}

export const ColorPicker = ({ color, onColorChange, label }: ColorPickerProps) => {
  const [inputValue, setInputValue] = useState(color);

  const handleColorChange = (text: string) => {
    // Validate hex color format
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(text);

    setInputValue(text);

    if (isValidHex) {
      onColorChange(text);
    }
  };

  console.log('color', color);

  const handleColorSwatchPress = async () => {
    try {
      console.log('open swatch');
      // Show the native color picker with current color
      const selectedColor = await ColorPickerModule.showColorPicker(color);

      // Update the input field and notify parent
      setInputValue(selectedColor);
      onColorChange(selectedColor);
    } catch (error) {
      // Color picker was cancelled or there was an error
      console.log('Color picker cancelled or error:', error);
    }
  };

  return (
    <View className="flex-row items-center mb-4">
      {label && <Text className="text-text-primary mr-3 w-24">{label}</Text>}
      <View className="flex-row items-center border border-border rounded-md overflow-hidden">
        <TextInput
          value={inputValue}
          onChangeText={handleColorChange}
          className="px-3 py-1 text-text-primary bg-background-secondary"
          placeholder="#RRGGBB"
          placeholderTextColor="#777"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          className="size-8"
          style={{ backgroundColor: color }}
          onPress={handleColorSwatchPress}
          accessibilityLabel="Select color"
          accessibilityHint="Opens the color picker dialog"
        >
          <View className="w-8 h-full" style={{ backgroundColor: color }} />
        </Pressable>
      </View>
    </View>
  );
};
