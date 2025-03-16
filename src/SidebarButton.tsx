import React from 'react';
import { Pressable, Text } from 'react-native';

export interface SidebarButtonProps {
  label: string;
  isSelected: boolean;
  isDarkMode: boolean;
  onPress: () => void;
}

export function SidebarButton({ label, isSelected, isDarkMode, onPress }: SidebarButtonProps) {
  const textColor = isSelected
    ? isDarkMode
      ? 'text-white'
      : 'text-[#333]'
    : isDarkMode
      ? 'text-[#bbb]'
      : 'text-[#333]';

  return (
    <Pressable
      className={`px-2 py-2 rounded-md mx-1 ${isSelected ? 'bg-white/10' : ''}`}
      onPress={onPress}
    >
      <Text className={`text-sm ${textColor}`}>{label}</Text>
    </Pressable>
  );
}
