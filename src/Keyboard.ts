import { event, observable } from '@legendapp/state';
import { useEffectOnce, useMount } from '@legendapp/state/react';
import KeyboardManager, { type KeyboardEvent } from './KeyboardManager';
import { ax } from './ax';

type KeyboardEventCode = number;
type KeyboardEventCodeModifier = string;

export type KeyboardEventCodeHotkey =
  | `${KeyboardEventCode}`
  | `${KeyboardEventCodeModifier}+${KeyboardEventCode}`
  | `${KeyboardEventCodeModifier}+${KeyboardEventCodeModifier}+${KeyboardEventCode}`;

export const keysPressed$ = observable<Record<string, boolean>>({});
const keyRepeat$ = event();

const keysToPreventDefault = new Set<KeyboardEventCode>();

// Handle events to set current key states
const onKeyDown = (e: KeyboardEvent) => {
  const { keyCode } = e;
  // Add the pressed key if not holding Alt
  // if (!e.altKey) {
  const isAlreadyPressed = keysPressed$[keyCode].get();
  keysPressed$[keyCode].set(true);

  if (isAlreadyPressed) {
    keyRepeat$.fire();
  }

  console.log('keydown', keyCode, keysToPreventDefault.has(keyCode));
  // }

  return keysToPreventDefault.has(keyCode);
};
const onKeyUp = (e: KeyboardEvent) => {
  const { keyCode } = e;
  keysPressed$[keyCode].delete();

  // if (e.key === 'Meta' || e.key === 'Alt') {
  //   // If releasing Meta or Alt then we need to release all keys or they might get stuck on
  //   resetKeys();
  // }

  return keysToPreventDefault.has(keyCode);
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

interface KeyboardHotkeyOptions {
  repeat?: boolean;
}

type HotkeyCallbacks = Partial<Record<KeyboardEventCodeHotkey, () => void>> & {
  options: KeyboardHotkeyOptions;
};

export function onHotkeys(hotkeyCallbacks: HotkeyCallbacks) {
  const hotkeyMap = new Map<string[], () => void>();
  const { options } = hotkeyCallbacks;
  // Process each combination and its callback
  for (const [hotkey, callback] of Object.entries(hotkeyCallbacks)) {
    if (hotkey === 'options') {
    } else {
      const keys = hotkey.toLowerCase().split('+');
      keysToPreventDefault.add(Number(keys[keys.length - 1]));
      hotkeyMap.set(keys, callback as () => void);
    }
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

  const unsubs = ax(
    keysPressed$.onChange(checkHotkeys),
    options?.repeat && keyRepeat$.on(checkHotkeys)
  );

  return () => {
    for (const unsub of unsubs) {
      unsub();
    }
  };
}
export function useOnHotkeys(hotkeyCallbacks: HotkeyCallbacks) {
  useEffectOnce(() => onHotkeys(hotkeyCallbacks), []);
}
