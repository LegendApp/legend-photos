import { useEffect } from 'react';
import { Platform } from 'react-native';
import KeyboardManager, { type KeyboardEventListener } from './KeyboardManager';

/**
 * Hook to listen for keyboard events
 *
 * @param options Configuration options for keyboard events
 * @returns void
 */
export function useKeyboard({
  onKeyDown,
  onKeyUp,
  enabled = true,
}: {
  onKeyDown?: KeyboardEventListener;
  onKeyUp?: KeyboardEventListener;
  enabled?: boolean;
} = {}) {
  useEffect(() => {
    // Only run on macOS and if enabled
    console.log('useKeyboard effect running, enabled:', enabled, 'Platform.OS:', Platform.OS);
    if (!enabled || Platform.OS !== 'macos') {
      return;
    }

    // Set up listeners
    const cleanupFns: Array<() => void> = [];

    try {
      if (onKeyDown) {
        console.log(
          'Setting up key down listener, KeyboardManager.addKeyDownListener exists:',
          !!KeyboardManager.addKeyDownListener
        );
        cleanupFns.push(KeyboardManager.addKeyDownListener(onKeyDown));
      }

      if (onKeyUp) {
        console.log('Setting up key up listener');
        cleanupFns.push(KeyboardManager.addKeyUpListener(onKeyUp));
      }
    } catch (error) {
      console.error('Failed to set up keyboard listeners:', error);
    }

    // Return cleanup function
    return () => {
      console.log('Cleaning up keyboard listeners');
      try {
        for (const cleanup of cleanupFns) {
          cleanup();
        }
      } catch (error) {
        console.error('Failed to clean up keyboard listeners:', error);
      }
    };
  }, [onKeyDown, onKeyUp, enabled]);
}
