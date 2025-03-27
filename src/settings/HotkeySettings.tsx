import { HotkeyMetadata, type HotkeyName, hotkeys$ } from '@/settings/Hotkeys';
import { HiddenTextInput } from '@/systems/keyboard/HookKeyboard';
import { type KeyboardEventCodeHotkey, keysPressed$ } from '@/systems/keyboard/Keyboard';
import { KeyCodes, KeyText } from '@/systems/keyboard/KeyboardManager';
import { use$, useObservable, useObserveEffect, useSelector } from '@legendapp/state/react';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

/**
 * A simpler component for displaying keyboard shortcuts
 * In a real implementation, this would be connected to the hotkeys$ observable
 * and allow editing the keys
 */
export function HotkeySettings() {
  const hotkeys = use$(hotkeys$);
  const hotkeyNames = Object.keys(hotkeys);

  return (
    <ScrollView contentContainerClassName="p-5">
      <HiddenTextInput />
      <Text className="text-2xl font-bold mb-4">Keyboard Shortcuts</Text>
      {hotkeyNames.map((name) => (
        <HotkeyItem
          key={name}
          name={name as HotkeyName}
          description={HotkeyMetadata[name as HotkeyName]?.description || ''}
          keyCode={hotkeys[name as HotkeyName]}
        />
      ))}
    </ScrollView>
  );
}

interface HotkeyItemProps {
  name: HotkeyName;
  description: string;
  keyCode: KeyboardEventCodeHotkey;
}

function HotkeyItem({ name, description, keyCode }: HotkeyItemProps) {
  return (
    <View className="flex-row justify-between items-center my-2">
      <View className="flex-1">
        <Text className="text-lg">{name}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
      <HotkeyInput hotkeyName={name} currentKeyCode={keyCode} />
    </View>
  );
}

interface HotkeyInputProps {
  hotkeyName: HotkeyName;
  currentKeyCode: KeyboardEventCodeHotkey;
}

function HotkeyInput({ hotkeyName, currentKeyCode }: HotkeyInputProps) {
  const isEditing$ = useObservable(false);
  const isEditing = useSelector(isEditing$);
  const accumulatedKeys$ = useObservable<number[]>([]);
  const accumulatedKeys = useSelector(accumulatedKeys$);

  // Convert current keyCode to display text
  const getDisplayText = () => {
    const currentKeys =
      typeof currentKeyCode === 'string'
        ? currentKeyCode.split('+').map(Number)
        : [Number(currentKeyCode)];
    const keys = accumulatedKeys.length > 0 ? accumulatedKeys : currentKeys;
    const sortedKeys = [...keys].sort((a, b) => {
      // Sort modifiers first
      const aIsModifier = isModifierKey(a);
      const bIsModifier = isModifierKey(b);
      if (aIsModifier && !bIsModifier) return -1;
      if (!aIsModifier && bIsModifier) return 1;
      return a - b;
    });
    return sortedKeys.map((key) => getKeyDisplayText(key)).join(' + ');
  };

  const isModifierKey = (keyCode: number) => {
    return [
      KeyCodes.MODIFIER_COMMAND,
      KeyCodes.MODIFIER_SHIFT,
      KeyCodes.MODIFIER_OPTION,
      KeyCodes.MODIFIER_CONTROL,
      KeyCodes.MODIFIER_FUNCTION,
    ].includes(keyCode);
  };

  const getKeyDisplayText = (keyCode: number) => {
    switch (keyCode) {
      case KeyCodes.MODIFIER_COMMAND:
        return '⌘';
      case KeyCodes.MODIFIER_SHIFT:
        return '⇧';
      case KeyCodes.MODIFIER_OPTION:
        return '⌥';
      case KeyCodes.MODIFIER_CONTROL:
        return '⌃';
      case KeyCodes.MODIFIER_FUNCTION:
        return 'fn';
      default:
        return KeyText[keyCode] || keyCode.toString();
    }
  };

  const displayText = getDisplayText();

  const handlePress = () => {
    if (!isEditing$.get()) {
      isEditing$.set(true);
      accumulatedKeys$.set([]);
    }
  };

  // Watch pressed keys and update hotkey when editing
  useObserveEffect(() => {
    if (!isEditing$.get()) return;

    // Get all currently pressed keys
    const pressedKeyCodes = Object.entries(keysPressed$.get())
      .filter(([_, isPressed]) => isPressed)
      .map(([keyCode]) => Number(keyCode));

    const numKeys = pressedKeyCodes.filter((key) => !isModifierKey(key)).length;

    if (numKeys === 0) {
      // If no keys are pressed and we have accumulated keys, save the hotkey
      const accumulated = accumulatedKeys$.get();
      if (accumulated.length > 0) {
        // Sort keys to ensure consistent order (modifiers first)
        const sortedKeys = [...accumulated].sort((a, b) => {
          const aIsModifier = isModifierKey(a);
          const bIsModifier = isModifierKey(b);
          if (aIsModifier && !bIsModifier) return -1;
          if (!aIsModifier && bIsModifier) return 1;
          return a - b;
        });
        // If there's only one key, use it as a number, otherwise join with +
        const newHotkey =
          sortedKeys.length === 1
            ? sortedKeys[0]
            : (sortedKeys.join('+') as KeyboardEventCodeHotkey);
        hotkeys$[hotkeyName].set(newHotkey);
        isEditing$.set(false);
        accumulatedKeys$.set([]);
      }
    } else {
      // Add any new keys that aren't already in our accumulated list
      const currentAccumulated = accumulatedKeys$.get();
      const newKeys = pressedKeyCodes.filter((key) => !currentAccumulated.includes(key));
      if (newKeys.length > 0) {
        accumulatedKeys$.push(...newKeys);
      }
    }
  });

  return (
    <Pressable
      onPress={handlePress}
      className={`px-4 py-2 rounded ${isEditing$.get() ? 'bg-blue-500' : 'bg-gray-300'}`}
    >
      <Text className={`font-mono ${isEditing$.get() ? 'text-white' : 'text-black'}`}>
        {isEditing && !accumulatedKeys.length ? 'Press keys...' : displayText}
      </Text>
    </Pressable>
  );
}
