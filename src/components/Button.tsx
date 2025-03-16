import React from 'react';
import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

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
  ...props
}: ButtonProps) {
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
      {...props}
    >
      <Text className={`font-medium ${textClass} ${textSizeClass}`}>{title}</Text>
    </TouchableOpacity>
  );
}
