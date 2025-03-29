import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

// Get the native modules with fallbacks for when they're not available
const RNKeyboardManager = NativeModules.RNKeyboardManager || {};

// Create event emitter for keyboard events only if the module exists
const keyboardEventEmitter = RNKeyboardManager ? new NativeEventEmitter(RNKeyboardManager) : null;

// Define event types
export type KeyboardEvent = {
  keyCode: number;
  modifiers: number;
  eventId?: string; // Optional eventId for tracking responses
};

// Define listener types
export type KeyboardEventListener = (event: KeyboardEvent) => boolean;

// Define key codes in JavaScript instead of getting them from native
export const KeyCodes = {
  // Function Keys
  KEY_F1: 122,
  KEY_F2: 120,
  KEY_F3: 99,
  KEY_F4: 118,
  KEY_F5: 96,
  KEY_F6: 97,
  KEY_F7: 98,
  KEY_F8: 100,
  KEY_F9: 101,
  KEY_F10: 109,
  KEY_F11: 103,
  KEY_F12: 111,
  KEY_F13: 105,
  KEY_F14: 107,
  KEY_F15: 113,
  KEY_F16: 106,
  KEY_F17: 64,
  KEY_F18: 79,
  KEY_F19: 80,
  KEY_F20: 90,

  // Alphanumeric Keys
  KEY_A: 0,
  KEY_B: 11,
  KEY_C: 8,
  KEY_D: 2,
  KEY_E: 14,
  KEY_F: 3,
  KEY_G: 5,
  KEY_H: 4,
  KEY_I: 34,
  KEY_J: 38,
  KEY_K: 40,
  KEY_L: 37,
  KEY_M: 46,
  KEY_N: 45,
  KEY_O: 31,
  KEY_P: 35,
  KEY_Q: 12,
  KEY_R: 15,
  KEY_S: 1,
  KEY_T: 17,
  KEY_U: 32,
  KEY_V: 9,
  KEY_W: 13,
  KEY_X: 7,
  KEY_Y: 16,
  KEY_Z: 6,

  // Number Keys
  KEY_0: 29,
  KEY_1: 18,
  KEY_2: 19,
  KEY_3: 20,
  KEY_4: 21,
  KEY_5: 23,
  KEY_6: 22,
  KEY_7: 26,
  KEY_8: 28,
  KEY_9: 25,

  KEY_MINUS: 27,
  KEY_EQUALS: 24,

  // Special Keys
  KEY_RETURN: 36,
  KEY_TAB: 48,
  KEY_SPACE: 49,
  KEY_DELETE: 51,
  KEY_BACKSPACE: 51, // Same as DELETE on macOS
  KEY_ESCAPE: 53,
  KEY_HELP: 114,
  KEY_HOME: 115,
  KEY_PAGE_UP: 116,
  KEY_PAGE_DOWN: 121,
  KEY_END: 119,
  KEY_LEFT: 123,
  KEY_RIGHT: 124,
  KEY_DOWN: 125,
  KEY_UP: 126,

  // Punctuation Keys
  KEY_COMMA: 43,
  KEY_PERIOD: 47,
  KEY_SLASH: 44,

  // Modifiers
  MODIFIER_COMMAND: 1 << 20,
  MODIFIER_SHIFT: 1 << 17,
  MODIFIER_OPTION: 1 << 19,
  MODIFIER_CONTROL: 1 << 18,
  MODIFIER_CAPS_LOCK: 1 << 16,
  MODIFIER_FUNCTION: 1 << 23,
} as const;

export const KeyText: Record<number, string> = (() => {
  const keyText: Record<number, string> = {};

  // Create entries for all KeyCodes
  for (const [key, value] of Object.entries(KeyCodes)) {
    if (typeof value === 'number' && !key.startsWith('MODIFIER_')) {
      // Extract the name part after KEY_ prefix
      const name = key.startsWith('KEY_') ? key.substring(4) : key;

      // Format the key name (convert to title case for special keys, keep uppercase for single letters)
      if (name.length === 1) {
        keyText[value] = name;
      } else {
        // Convert to title case (first letter uppercase, rest lowercase)
        keyText[value] = name.charAt(0) + name.slice(1).toLowerCase();
      }
    }
  }

  // Special case overrides
  const overrides: Record<number, string> = {
    [KeyCodes.KEY_RETURN]: '↩',
    [KeyCodes.KEY_TAB]: '⇥',
    [KeyCodes.KEY_SPACE]: 'Space',
    [KeyCodes.KEY_DELETE]: '⌫',
    [KeyCodes.KEY_ESCAPE]: 'Esc',
    [KeyCodes.KEY_LEFT]: '←',
    [KeyCodes.KEY_RIGHT]: '→',
    [KeyCodes.KEY_DOWN]: '↓',
    [KeyCodes.KEY_UP]: '↑',
    [KeyCodes.KEY_MINUS]: '-',
    [KeyCodes.KEY_EQUALS]: '=',
    [KeyCodes.KEY_COMMA]: ',',
    [KeyCodes.KEY_PERIOD]: '.',
    [KeyCodes.KEY_SLASH]: '/',
    [KeyCodes.MODIFIER_COMMAND]: '⌘',
    [KeyCodes.MODIFIER_SHIFT]: '⇧',
    [KeyCodes.MODIFIER_OPTION]: '⌥',
    [KeyCodes.MODIFIER_CONTROL]: '⌃',
    [KeyCodes.MODIFIER_CAPS_LOCK]: '⇪',
  };

  // Apply overrides
  return { ...keyText, ...overrides };
})();

/**
 * KeyboardManager provides an interface to handle keyboard events in macOS
 */
class KeyboardManager {
  private keyDownListeners: KeyboardEventListener[] = [];
  private keyUpListeners: KeyboardEventListener[] = [];
  private isMonitoring = false;
  private isNativeModuleAvailable: boolean;

  constructor() {
    this.isNativeModuleAvailable =
      Platform.OS === 'macos' && !!RNKeyboardManager && !!keyboardEventEmitter;

    if (!this.isNativeModuleAvailable) {
      console.warn('KeyboardManager native module is not available');
      return;
    }

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up native event listeners
   */
  private setupEventListeners() {
    if (!keyboardEventEmitter) return;

    // Local key down events
    keyboardEventEmitter.addListener('onKeyDown', (event: KeyboardEvent) => {
      //   console.log('Received onKeyDown event:', event);
      // Process listeners and check if any of them handled the event
      let handled = false;
      for (const listener of this.keyDownListeners) {
        // If any listener returns true, consider the event handled
        if (listener(event)) {
          handled = true;
          break;
        }
      }

      // Send the result back to native
      if (RNKeyboardManager.respondToKeyEvent && event.eventId) {
        RNKeyboardManager.respondToKeyEvent(event.eventId, handled);
      }

      return handled;
    });

    // Local key up events
    keyboardEventEmitter.addListener('onKeyUp', (event: KeyboardEvent) => {
      //   console.log('Received onKeyUp event:', event);
      // Process listeners and check if any of them handled the event
      let handled = false;
      for (const listener of this.keyUpListeners) {
        // If any listener returns true, consider the event handled
        if (listener(event)) {
          handled = true;
          break;
        }
      }

      // Send the result back to native
      if (RNKeyboardManager.respondToKeyEvent && event.eventId) {
        RNKeyboardManager.respondToKeyEvent(event.eventId, handled);
      }

      return handled;
    });
  }

  /**
   * Start monitoring keyboard events (when app is in focus)
   */
  async startMonitoring(): Promise<boolean> {
    if (!this.isNativeModuleAvailable || this.isMonitoring) return false;

    try {
      await RNKeyboardManager.startMonitoringKeyboard();
      this.isMonitoring = true;
      return true;
    } catch (error) {
      console.error('Failed to start keyboard monitoring:', error);
      return false;
    }
  }

  /**
   * Stop monitoring keyboard events
   */
  async stopMonitoring(): Promise<boolean> {
    if (!this.isNativeModuleAvailable || !this.isMonitoring) return false;

    try {
      await RNKeyboardManager.stopMonitoringKeyboard();
      this.isMonitoring = false;
      return true;
    } catch (error) {
      console.error('Failed to stop keyboard monitoring:', error);
      return false;
    }
  }

  /**
   * Add a listener for key down events
   */
  addKeyDownListener(listener: KeyboardEventListener): () => void {
    this.keyDownListeners.push(listener);

    // Start monitoring if this is the first listener
    if (this.keyDownListeners.length === 1 && !this.isMonitoring) {
      this.startMonitoring();
    }

    // Return a function to remove the listener
    return () => {
      this.keyDownListeners = this.keyDownListeners.filter((l) => l !== listener);

      // Stop monitoring if there are no more listeners
      if (
        this.keyDownListeners.length === 0 &&
        this.keyUpListeners.length === 0 &&
        this.isMonitoring
      ) {
        this.stopMonitoring();
      }
    };
  }

  /**
   * Add a listener for key up events
   */
  addKeyUpListener(listener: KeyboardEventListener): () => void {
    this.keyUpListeners.push(listener);

    // Start monitoring if this is the first listener
    if (this.keyUpListeners.length === 1 && !this.isMonitoring) {
      this.startMonitoring();
    }

    // Return a function to remove the listener
    return () => {
      this.keyUpListeners = this.keyUpListeners.filter((l) => l !== listener);

      // Stop monitoring if there are no more listeners
      if (
        this.keyDownListeners.length === 0 &&
        this.keyUpListeners.length === 0 &&
        this.isMonitoring
      ) {
        this.stopMonitoring();
      }
    };
  }

  /**
   * Check if a modifier key is pressed in the event
   */
  hasModifier(event: KeyboardEvent, modifier: number): boolean {
    return (event.modifiers & modifier) === modifier;
  }

  /**
   * Create a modifier mask from multiple modifiers
   */
  createModifierMask(...modifiers: number[]): number {
    return modifiers.reduce((mask, modifier) => mask | modifier, 0);
  }
}

// Export a singleton instance
export default new KeyboardManager();
