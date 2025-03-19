import { observable } from '@legendapp/state';
import type React from 'react';
import { memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { HookToObservable } from './HookToObservable';
import { state$ } from './State';

// Observable to store window dimensions
export const windowDimensions$ = observable({
  width: 0,
  height: 0,
});

export const HookWindowDimensions = memo(function HookWindowDimensions() {
  return (
    <HookToObservable
      hook={useWindowDimensions}
      value$={windowDimensions$}
      if={() => !state$.showSettings.get()}
      getValue={(value) => ({ width: value.width, height: value.height })}
    />
  );
});
