import { observable } from '@legendapp/state';
import type React from 'react';
import { memo, useEffect } from 'react';
import { NativeEventEmitter, NativeModules, useWindowDimensions } from 'react-native';
import { HookToObservable } from './HookToObservable';
import { state$ } from './State';

const { WindowControls } = NativeModules;
const windowControlsEmitter = new NativeEventEmitter(WindowControls);

// Observable to store window dimensions
export const windowDimensions$ = observable({
  width: 0,
  height: 0,
});

export const isWindowFullScreen$ = observable(false);

export const HookWindowDimensions = memo(function HookWindowDimensions() {
  // Listen for fullscreen status changes
  useEffect(() => {
    // Get initial fullscreen status
    WindowControls.isWindowFullScreen()
      .then((isFullScreen: boolean) => {
        isWindowFullScreen$.set(isFullScreen);
      })
      .catch((error: Error) => {
        console.error('Failed to get initial fullscreen status:', error);
      });

    // Listen for fullscreen change events
    const subscription = windowControlsEmitter.addListener(
      'fullscreenChange',
      (event: { isFullscreen: boolean }) => {
        isWindowFullScreen$.set(event.isFullscreen);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <HookToObservable
      hook={useWindowDimensions}
      value$={windowDimensions$}
      if={() => !state$.showSettings.get()}
      getValue={(value) => ({ width: value.width, height: value.height })}
    />
  );
});
