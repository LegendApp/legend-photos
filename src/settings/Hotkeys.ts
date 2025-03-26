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

  // Rating plugin
  'Rate 0': KeyCodes.KEY_0,
  'Rate 1': KeyCodes.KEY_1,
  'Rate 2': KeyCodes.KEY_2,
  'Rate 3': KeyCodes.KEY_3,
  'Rate 4': KeyCodes.KEY_4,
  'Rate 5': KeyCodes.KEY_5,

  // Flag/Reject plugin
  'Toggle Flag Space': KeyCodes.KEY_SPACE,
  'Toggle Flag P': KeyCodes.KEY_P,
  'Toggle Reject': KeyCodes.KEY_X,

  // Delete plugin
  'Delete Photo': KeyCodes.KEY_DELETE,
} as const;

export type HotkeyName = keyof typeof DEFAULT_HOTKEYS;

const HotkeyMetadata: Record<HotkeyName, { description: string; repeat?: boolean }> = {
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

  // Rating plugin
  'Rate 0': {
    description: 'Rate photo 0',
  },
  'Rate 1': {
    description: 'Rate photo 1',
  },
  'Rate 2': {
    description: 'Rate photo 2',
  },
  'Rate 3': {
    description: 'Rate photo 3',
  },
  'Rate 4': {
    description: 'Rate photo 4',
  },
  'Rate 5': {
    description: 'Rate photo 5',
  },

  // Flag/Reject plugin
  'Toggle Flag Space': {
    description: 'Toggle flag on the current photo',
  },
  'Toggle Flag P': {
    description: 'Toggle flag on the current photo',
  },
  'Toggle Reject': {
    description: 'Toggle reject on the current photo',
  },

  // Delete plugin
  'Delete Photo': {
    description: 'Delete the selected photo',
  },
};

// Create the hotkeys manager
export const hotkeys$ = createJSONManager<Record<HotkeyName, KeyboardEventCodeHotkey>>(
  `${DocumentDirectoryPath}/.legendphotos/`,
  'hotkeys.json',
  DEFAULT_HOTKEYS
);

export const isHotkeysLoaded$ = observable(() => !!syncState(hotkeys$).isPersistLoaded.get());

export function getHotkey(name: HotkeyName): KeyboardEventCodeHotkey {
  return hotkeys$[name].get();
}

// Export metadata for use in UI
export function getHotkeyMetadata(name: HotkeyName) {
  return HotkeyMetadata[name];
}
