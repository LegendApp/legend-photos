import React, { useCallback } from 'react';
import { type NativeSyntheticEvent, type ViewProps, requireNativeComponent } from 'react-native';

interface NativeSegmentedControlProps extends ViewProps {
  segments: string[];
  selectedSegmentIndex: number;
  onChange?: (event: NativeSyntheticEvent<{ selectedSegmentIndex: number }>) => void;
  size?: 'regular' | 'small' | 'mini' | 'large';
}

const RNSegmentedControl =
  requireNativeComponent<NativeSegmentedControlProps>('RNSegmentedControl');

export interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  labelExtractor?: (value: T) => string;
  size?: NativeSegmentedControlProps['size'];
}

export function NativeSegmentedControl<T extends string>({
  options,
  selectedValue,
  onValueChange,
  labelExtractor,
  size = 'regular',
}: SegmentedControlProps<T>) {
  // Convert options to string array for native component
  const segments = options.map((option) => (labelExtractor ? labelExtractor(option) : option));

  // Find the index of the selected value
  const selectedSegmentIndex = options.indexOf(selectedValue);

  // Handle native component selection change
  const handleChange = useCallback(
    (event: NativeSyntheticEvent<{ selectedSegmentIndex: number }>) => {
      const newIndex = event.nativeEvent.selectedSegmentIndex;
      if (newIndex >= 0 && newIndex < options.length) {
        onValueChange(options[newIndex]);
      }
    },
    [options, onValueChange]
  );

  return (
    <RNSegmentedControl
      segments={segments}
      selectedSegmentIndex={selectedSegmentIndex}
      onChange={handleChange}
      size={size}
      style={{ height: size === 'mini' ? 16 : size === 'small' ? 20 : size === 'large' ? 28 : 24 }}
    />
  );
}
