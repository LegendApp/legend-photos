import React from 'react';
import { Platform } from 'react-native';
import {
  NativeSegmentedControl,
  type SegmentedControlProps as NativeSegmentedControlProps,
} from './NativeSegmentedControl';

type SegmentedControlProps<T extends string> = NativeSegmentedControlProps<T>;

export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  // Use the native segmented control on macOS
  if (Platform.OS === 'macos') {
    return <NativeSegmentedControl {...props} />;
  }
}
