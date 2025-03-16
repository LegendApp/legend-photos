import { observable } from '@legendapp/state';
import { useEffectOnce, useMount } from '@legendapp/state/react';
import KeyboardManager, { type KeyboardEvent } from './KeyboardManager';

type KeyboardEventCode = number;
type KeyboardEventCodeModifier = string;

export type KeyboardEventCodeHotkey =
  | `${KeyboardEventCode}`
  | `${KeyboardEventCodeModifier}+${KeyboardEventCode}`
  | `${KeyboardEventCodeModifier}+${KeyboardEventCodeModifier}+${KeyboardEventCode}`;

export const keysPressed$ = observable<Record<string, boolean>>({});

// Handle events to set current key states
const onKeyDown = (e: KeyboardEvent) => {
  const { keyCode } = e;
  // Add the pressed key if not holding Alt
  // if (!e.altKey) {
  keysPressed$[keyCode].set(true);
  // }
};
const onKeyUp = (e: KeyboardEvent) => {
  const { keyCode } = e;
  keysPressed$[keyCode].delete();

  // if (e.key === 'Meta' || e.key === 'Alt') {
  //   // If releasing Meta or Alt then we need to release all keys or they might get stuck on
  //   resetKeys();
  // }
};

export function useHookKeyboard() {
  useMount(() => {
    // Set up listeners
    let cleanupFns: (() => void)[];
    try {
      cleanupFns = [
        KeyboardManager.addKeyDownListener(onKeyDown),
        KeyboardManager.addKeyUpListener(onKeyUp),
      ];
    } catch (error) {
      console.error('Failed to set up keyboard listeners:', error);
    }

    // Return cleanup function
    return () => {
      try {
        for (const cleanup of cleanupFns) {
          cleanup();
        }
      } catch (error) {
        console.error('Failed to clean up keyboard listeners:', error);
      }
    };
  });
}

export function onHotkeys(hotkeyCallbacks: Partial<Record<KeyboardEventCodeHotkey, () => void>>) {
  const hotkeyMap = new Map<string[], () => void>();

  // Process each combination and its callback
  for (const [hotkey, callback] of Object.entries(hotkeyCallbacks)) {
    const keys = hotkey.toLowerCase().split('+');
    hotkeyMap.set(keys, callback!);
  }

  const checkHotkeys = () => {
    for (const [keys, callback] of hotkeyMap) {
      // If every key in the hotkey is pressed, call the callback
      const allKeysPressed = keys.every((key) => keysPressed$[key].get());
      if (allKeysPressed) {
        callback();
      }
    }
  };

  return keysPressed$.onChange(checkHotkeys);
}

export function useOnHotkeys(hotkeyCallbacks: Record<string, () => void>) {
  useEffectOnce(() => onHotkeys(hotkeyCallbacks), []);
}
