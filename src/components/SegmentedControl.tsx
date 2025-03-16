import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  labelExtractor?: (value: T) => string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onValueChange,
  labelExtractor,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <View className={`flex-row rounded-md overflow-hidden border border-[#555] ${className}`}>
      {options.map((option, index) => {
        const isSelected = option === selectedValue;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        // Border radius for first and last items
        const borderRadiusClass = `${isFirst ? 'rounded-l-md' : ''} ${isLast ? 'rounded-r-md' : ''}`;

        // Border classes
        const borderClass = index < options.length - 1 ? 'border-r border-r-[#555]' : '';

        // Background and text color based on selection
        const bgClass = isSelected ? 'bg-[#3478F6]' : 'bg-[#2A2A2A]';
        const textClass = isSelected ? 'text-white font-medium' : 'text-[#CCCCCC]';

        // Label to display
        const label = labelExtractor ? labelExtractor(option) : option;

        return (
          <TouchableOpacity
            key={option}
            className={`flex-1 py-1.5 px-3 ${bgClass} ${borderClass} ${borderRadiusClass}`}
            onPress={() => onValueChange(option)}
            activeOpacity={0.7}
          >
            <Text className={`text-center text-sm ${textClass}`}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
