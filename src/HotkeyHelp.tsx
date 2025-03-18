import { useObservable, useSelector } from '@legendapp/state/react';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { hotkeyRegistry$, keysPressed$, useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';

export function HotkeyHelp() {
  const hotkeyHelpVisible$ = useObservable(() => keysPressed$[KeyCodes.KEY_SLASH].get());
  const isVisible = useSelector(hotkeyHelpVisible$);
  const hotkeys = useSelector(() => Object.values(hotkeyRegistry$.get()));

  // Toggle visibility when / is pressed
  useOnHotkeys({
    [KeyCodes.KEY_SLASH]: () => {
      // Don't do anything, this is handled by hotkeyHelpVisible$
      // We just want this here to be in the list of hotkeys
    },
    options: {
      description: 'Toggle hotkey help',
    },
  });

  return isVisible ? (
    <View className="absolute bottom-4 right-4 bg-gray-800/80 rounded-lg p-4 shadow-lg max-w-md max-h-96 border border-gray-700">
      <Text className="text-white text-lg font-bold mb-2">Keyboard Shortcuts</Text>
      <ScrollView className="max-h-80">
        {hotkeys.length > 0 ? (
          hotkeys.map((hotkey, index) => (
            <View
              key={`hotkey-${hotkey.keys}-${index}`}
              className="flex-row justify-between py-1.5 border-b border-gray-700"
            >
              <Text className="text-white flex-1">{hotkey.description}</Text>
              <Text className="text-white font-mono bg-gray-700 px-2 rounded ml-4">
                {formatKeyCombo(hotkey.keys)}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 italic">No hotkeys registered</Text>
        )}
      </ScrollView>
    </View>
  ) : null;
}

// Helper function to format key combinations for display
function formatKeyCombo(combo: string): string {
  return combo
    .split('+')
    .map((key) => {
      // Convert key codes to readable names
      const keyNum = Number(key);
      if (!Number.isNaN(keyNum)) {
        return getKeyName(keyNum);
      }
      // Format modifier keys
      return key.charAt(0).toUpperCase() + key.slice(1);
    })
    .join(' + ');
}

// Convert keycodes to readable names
function getKeyName(keyCode: number): string {
  // Common keys mapping
  const keyMap: Record<number, string> = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
    20: 'Caps Lock',
    27: 'Esc',
    32: 'Space',
    37: '←',
    38: '↑',
    39: '→',
    40: '↓',
    46: 'Delete',
    191: '/',
  };

  // Letters
  if (keyCode >= 65 && keyCode <= 90) {
    return String.fromCharCode(keyCode);
  }

  // Numbers
  if (keyCode >= 48 && keyCode <= 57) {
    return String(keyCode - 48);
  }

  return keyMap[keyCode] || `Key ${keyCode}`;
}
