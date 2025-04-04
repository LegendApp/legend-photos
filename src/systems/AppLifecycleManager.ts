import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

type TerminationListener = () => Promise<void>;

// Collection of termination listeners
const terminationListeners: Set<TerminationListener> = new Set();

/**
 * Initialize the app lifecycle manager
 * Sets up listeners for app termination events and handles acknowledgment
 */
export function initializeAppLifecycleManager(): void {
  // Check if we're on macOS and the module is available
  if (Platform.OS !== 'macos' || !NativeModules.AppLifecycle) {
    console.log('AppLifecycleManager: Module not available on this platform');
    return;
  }

  // Create the event emitter
  const appLifecycleEmitter = new NativeEventEmitter(NativeModules.AppLifecycle);

  // Listen for termination events from native code
  appLifecycleEmitter.addListener('willTerminate', async (event) => {
    console.log('Received termination event from native', event);
    const { eventId } = event;

    // Notify all listeners
    for (const listener of terminationListeners) {
      try {
        await listener();
      } catch (err) {
        console.error('Error in termination listener:', err);
      }
    }

    // Acknowledge that we've processed the event
    if (NativeModules.AppLifecycle?.acknowledgeTermination) {
      console.log('Acknowledging termination event:', eventId);
      NativeModules.AppLifecycle.acknowledgeTermination(eventId);
    }
  });

  console.log('AppLifecycleManager: Initialized and listening for termination events');
}

/**
 * Register a listener for app termination
 * @param listener Function to call when app is terminating
 * @returns Function to remove the listener
 */
export function onAppTerminate(listener: TerminationListener): () => void {
  terminationListeners.add(listener);

  return () => {
    terminationListeners.delete(listener);
  };
}
