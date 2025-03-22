import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface SidebarButtonProps {
  label: string;
  isSelected: boolean;
  isDarkMode: boolean;
  onPress: () => void;
  indentLevel?: number;
}

export function SidebarButton({
  label,
  isSelected,
  isDarkMode,
  onPress,
  indentLevel = 0,
}: SidebarButtonProps) {
  const textColor = isSelected
    ? isDarkMode
      ? 'text-white'
      : 'text-[#333]'
    : isDarkMode
      ? 'text-[#bbb]'
      : 'text-[#333]';

  const indentPadding = 8 + indentLevel * 12;

  return (
    <Pressable
      className={`py-2 rounded-md mx-1 ${isSelected ? 'bg-white/10' : ''}`}
      onPress={onPress}
    >
      <View className="flex-row items-center" style={{ paddingLeft: indentPadding }}>
        <Text className={`text-sm ${textColor}`}>{label}</Text>
      </View>
    </Pressable>
  );
}
