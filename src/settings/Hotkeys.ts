import type { KeyboardEventCodeHotkey } from '@/systems/keyboard/Keyboard';
import { KeyCodes } from '@/systems/keyboard/KeyboardManager';
import { createJSONManager } from '@/utils/JSONManager';
import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { syncState } from '@legendapp/state';
import { observable } from '@legendapp/state';

// Default hotkey settings
const DEFAULT_HOTKEYS = {
  // Photo navigation
  Left: KeyCodes.KEY_LEFT,
  Right: KeyCodes.KEY_RIGHT,
  Up: KeyCodes.KEY_UP,
  Down: KeyCodes.KEY_DOWN,

  // Column adjustments
  'Decrease Columns': KeyCodes.KEY_MINUS,
  'Increase Columns': KeyCodes.KEY_EQUALS,

  // Photo actions
  'Open Photo': KeyCodes.KEY_RETURN,
  'Close Photo': KeyCodes.KEY_ESCAPE,
  'Close Photo-2': KeyCodes.KEY_RETURN,
  'Toggle Filmstrip': KeyCodes.KEY_F,

  // UI controls
  Sidebar: KeyCodes.KEY_S,
  Settings: KeyCodes.KEY_COMMA,
  Help: KeyCodes.KEY_SLASH,
} as const;

export type HotkeyName = keyof typeof DEFAULT_HOTKEYS;

export const HotkeyMetadata: Record<HotkeyName, { description: string; repeat?: boolean }> = {
  // Photo navigation
  Left: {
    description: 'Select previous photo',
    repeat: true,
  },
  Right: {
    description: 'Select next photo',
    repeat: true,
  },
  Up: {
    description: 'Select photo above',
    repeat: true,
  },
  Down: {
    description: 'Select photo below',
    repeat: true,
  },

  // Column adjustments
  'Decrease Columns': {
    description: 'Decrease number of columns',
    repeat: true,
  },
  'Increase Columns': {
    description: 'Increase number of columns',
    repeat: true,
  },

  // Photo actions
  'Open Photo': {
    description: 'Open selected photo in fullscreen',
  },
  'Close Photo': {
    description: 'Close fullscreen photo view',
  },
  'Close Photo-2': {
    description: 'Close fullscreen photo view',
  },
  'Toggle Filmstrip': {
    description: 'Show the filmstrip in fullscreen',
  },

  // UI controls
  Sidebar: {
    description: 'Toggle sidebar visibility',
  },
  Settings: {
    description: 'Open settings',
  },
  Help: {
    description: 'Toggle shortcut help',
  },
};

// Create the hotkeys manager
export const hotkeys$ = createJSONManager<Record<HotkeyName, KeyboardEventCodeHotkey>>({
  basePath: `${DocumentDirectoryPath}/.legendphotos/`,
  filename: 'hotkeys.json',
  initialValue: DEFAULT_HOTKEYS,
  saveDefaultToFile: true,
});

export const isHotkeysLoaded$ = observable(() => !!syncState(hotkeys$).isPersistLoaded.get());

export function getHotkey(name: HotkeyName): KeyboardEventCodeHotkey {
  return hotkeys$[name].get();
}

// Export metadata for use in UI
export function getHotkeyMetadata(name: HotkeyName) {
  return HotkeyMetadata[name];
}
