import { useObservable, useSelector } from '@legendapp/state/react';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { hotkeyRegistry$, useOnHotkeys } from './Keyboard';

const KEY_SLASH = 191; // The keycode for the '/' key

export function HotkeyHelp() {
  const hotkeyHelpVisible$ = useObservable(() => true); //keysPressed$[KeyCodes.KEY_SLASH].get());
  const isVisible = useSelector(hotkeyHelpVisible$);
  const hotkeys = useSelector(() => Object.values(hotkeyRegistry$.get()));

  // Toggle visibility when / is pressed
  useOnHotkeys({
    [KEY_SLASH]: {
      action: () => {
        // No-op, it's handled by the hotkeyHelpVisible$ obsrvable
        // Just want this registered in the list so it shows in the popup and settings
      },
      name: 'Keyboard Shortcuts',
      description: 'Toggle shortcut help',
      keyText: '/',
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
              className="py-1.5 border-b border-gray-700"
            >
              <View className="flex-row justify-between mb-1">
                <Text className="text-white font-medium">{hotkey.name}</Text>
                <Text className="text-white font-mono bg-gray-700 px-2 rounded ml-4">
                  {hotkey.keyText}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 italic">No hotkeys registered</Text>
        )}
      </ScrollView>
    </View>
  ) : null;
}
