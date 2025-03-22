import { observable } from '@legendapp/state';
import { memo, useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { WindowControls } = NativeModules;
const windowControlsEmitter = new NativeEventEmitter(WindowControls);

export const isWindowFullScreen$ = observable(false);

export const HookWindowFullscreen = memo(function HookWindowFullscreen() {
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

  return null;
});
