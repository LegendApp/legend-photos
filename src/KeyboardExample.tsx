import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useGlobalShortcut, useKeyboard } from './Keyboard';
import KeyboardManager, { KeyCodes } from './KeyboardManager';

export function KeyboardExample() {
  const [lastKeyDown, setLastKeyDown] = useState<string>('None');
  const [lastKeyUp, setLastKeyUp] = useState<string>('None');
  const [lastGlobalKey, setLastGlobalKey] = useState<string>('None');
  const [shortcutTriggered, setShortcutTriggered] = useState(0);

  // Use the keyboard hook to listen for keyboard events
  useKeyboard({
    onKeyDown: (event) => {
      const hasCommand = KeyboardManager.hasModifier(event, KeyCodes.MODIFIER_COMMAND);
      const hasShift = KeyboardManager.hasModifier(event, KeyCodes.MODIFIER_SHIFT);
      const hasOption = KeyboardManager.hasModifier(event, KeyCodes.MODIFIER_OPTION);
      const hasControl = KeyboardManager.hasModifier(event, KeyCodes.MODIFIER_CONTROL);

      const modifiers = [];
      if (hasCommand) modifiers.push('⌘');
      if (hasShift) modifiers.push('⇧');
      if (hasOption) modifiers.push('⌥');
      if (hasControl) modifiers.push('⌃');

      const keyName = getKeyName(event.keyCode);
      const modifierText = modifiers.length > 0 ? `${modifiers.join(' + ')} + ` : '';

      setLastKeyDown(`${modifierText}${keyName} (Code: ${event.keyCode})`);
    },
    onKeyUp: (event) => {
      const keyName = getKeyName(event.keyCode);
      setLastKeyUp(`${keyName} (Code: ${event.keyCode})`);
    },
    onGlobalKey: (event) => {
      const keyName = getKeyName(event.keyCode);
      setLastGlobalKey(`${keyName} (Code: ${event.keyCode})`);
    },
  });

  // Register a global shortcut for Command+Shift+P
  useGlobalShortcut(
    KeyCodes.KEY_P,
    KeyboardManager.createModifierMask(KeyCodes.MODIFIER_COMMAND, KeyCodes.MODIFIER_SHIFT),
    () => {
      setShortcutTriggered((prev) => prev + 1);
    }
  );

  // Show a message if not on macOS
  if (Platform.OS !== 'macos') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Keyboard Events Example</Text>
        <Text style={styles.errorText}>Keyboard shortcuts are only supported on macOS.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keyboard Events Example</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Local Keyboard Events</Text>
        <Text style={styles.eventText}>Last Key Down: {lastKeyDown}</Text>
        <Text style={styles.eventText}>Last Key Up: {lastKeyUp}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Global Keyboard Events</Text>
        <Text style={styles.eventText}>Last Global Key: {lastGlobalKey}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Global Shortcut</Text>
        <Text style={styles.eventText}>Command+Shift+P triggered: {shortcutTriggered} times</Text>
        <Text style={styles.hint}>This works even when the app is not in focus!</Text>
      </View>
    </View>
  );
}

// Helper function to get a human-readable key name
function getKeyName(keyCode: number): string {
  // Find the key name in KeyCodes
  for (const [key, value] of Object.entries(KeyCodes)) {
    if (value === keyCode && key.startsWith('KEY_')) {
      return key.replace('KEY_', '');
    }
  }

  return `Unknown (${keyCode})`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventText: {
    fontSize: 16,
    marginBottom: 5,
  },
  hint: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});
