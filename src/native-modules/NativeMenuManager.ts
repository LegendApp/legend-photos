import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

// Get the native module
const { MenuEvents } = NativeModules;

// Define event types
type MenuEvent = 'onShowPreferences';

/**
 * MenuManager provides an interface to handle native menu events in macOS
 */
class MenuManager {
  private eventEmitter: NativeEventEmitter | null = null;
  private eventSubscriptions: { [key: string]: any } = {};
  private isNativeModuleAvailable: boolean;

  constructor() {
    // Check if we're on macOS and if the native module is available
    this.isNativeModuleAvailable = Platform.OS === 'macos' && !!MenuEvents;

    if (!this.isNativeModuleAvailable) {
      console.warn('MenuManager: Native module is not available');
      return;
    }

    // Set up the event emitter
    this.eventEmitter = new NativeEventEmitter(MenuEvents);
  }

  /**
   * Add a listener for a menu event
   */
  public addListener(event: MenuEvent, callback: () => void) {
    if (!this.eventEmitter) return;

    // Remove existing subscription if any
    this.removeListener(event);

    // Add new subscription
    this.eventSubscriptions[event] = this.eventEmitter.addListener(event, callback);
  }

  /**
   * Remove a listener for a menu event
   */
  public removeListener(event: MenuEvent) {
    const subscription = this.eventSubscriptions[event];
    if (subscription) {
      subscription.remove();
      delete this.eventSubscriptions[event];
    }
  }

  /**
   * Remove all listeners
   */
  public removeAllListeners() {
    for (const event in this.eventSubscriptions) {
      this.eventSubscriptions[event].remove();
    }
    this.eventSubscriptions = {};
  }
}

// Create singleton instance
export const menuManager = new MenuManager();
