import React from 'react';
import { ScrollView, Text, View } from 'react-native';

/**
 * A simpler component for displaying keyboard shortcuts
 * In a real implementation, this would be connected to the hotkeys$ observable
 * and allow editing the keys
 */
export function HotkeySettings() {
  // For a real implementation, this would use the actual hotkeys from hotkeys$
  const coreHotkeys: Record<string, { description: string; keyText: string }> = {
    Left: { description: 'Select previous photo', keyText: '←' },
    Right: { description: 'Select next photo', keyText: '→' },
    Up: { description: 'Select photo above', keyText: '↑' },
    Down: { description: 'Select photo below', keyText: '↓' },
    'Open Photo': { description: 'Open selected photo in fullscreen', keyText: 'Return' },
    'Close Photo': { description: 'Close fullscreen photo view', keyText: 'Escape' },
    'Toggle Filmstrip': { description: 'Show the filmstrip in fullscreen', keyText: 'F' },
    Sidebar: { description: 'Toggle sidebar visibility', keyText: 'S' },
    Settings: { description: 'Open settings', keyText: ',' },
    Help: { description: 'Toggle shortcut help', keyText: '/' },
  };

  const pluginHotkeys: Record<string, { description: string; keyText: string }> = {
    'Rate 1': { description: 'Rate photo 1 star', keyText: '1' },
    'Rate 2': { description: 'Rate photo 2 stars', keyText: '2' },
    'Rate 3': { description: 'Rate photo 3 stars', keyText: '3' },
    'Rate 4': { description: 'Rate photo 4 stars', keyText: '4' },
    'Rate 5': { description: 'Rate photo 5 stars', keyText: '5' },
    'Toggle Flag': { description: 'Toggle flag on the current photo', keyText: 'Space' },
    'Toggle Reject': { description: 'Toggle reject on the current photo', keyText: 'X' },
    'Delete Photo': { description: 'Delete the selected photo', keyText: 'Delete' },
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-4">Keyboard Shortcuts</Text>

      <Text className="text-xl font-semibold mt-4 mb-2">Core Hotkeys</Text>
      {Object.entries(coreHotkeys).map(([name, info]) => (
        <HotkeyItem key={name} name={name} description={info.description} keyText={info.keyText} />
      ))}

      <Text className="text-xl font-semibold mt-6 mb-2">Plugin Hotkeys</Text>
      {Object.entries(pluginHotkeys).map(([name, info]) => (
        <HotkeyItem key={name} name={name} description={info.description} keyText={info.keyText} />
      ))}

      <View className="mt-6 p-4 bg-yellow-100 rounded">
        <Text className="italic">
          Note: In a real implementation, this screen would allow you to customize each hotkey. The
          customized hotkeys would be saved to hotkeys.json and would override the defaults.
        </Text>
      </View>
    </ScrollView>
  );
}

interface HotkeyItemProps {
  name: string;
  description: string;
  keyText: string;
}

function HotkeyItem({ name, description, keyText }: HotkeyItemProps) {
  return (
    <View className="flex-row justify-between items-center my-2">
      <View className="flex-1">
        <Text className="text-lg">{name}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
      <View className="px-4 py-2 rounded bg-gray-300">
        <Text className="text-black font-mono">{keyText}</Text>
      </View>
    </View>
  );
}
