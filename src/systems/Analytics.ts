import { initializeAppLifecycleManager, onAppTerminate } from '@/systems/AppLifecycleManager';
import Aptabase from '@aptabase/react-native';
// @ts-expect-error - env is not typed
import { APTABASE_KEY } from '@env';
import { NativeModules, Platform } from 'react-native';
import { version } from '../../package.json';

/**
 * Listen for app termination events
 *
 * @param listener Function to call when app is terminating
 * @returns Cleanup function to remove the listener
 */
export function initializeAnalytics() {
  if (__DEV__) {
    // Disable analytics in dev mode
    return;
  }
  // Only works on macOS and if module is available
  if (Platform.OS !== 'macos' || !NativeModules.AppLifecycle) {
    console.log('App termination detection not available on this platform');
    return;
  }

  initializeAppLifecycleManager();

  Aptabase.init(APTABASE_KEY, {
    appVersion: version,
  });

  Aptabase.trackEvent('loaded');

  onAppTerminate(async () => {
    Aptabase.trackEvent('unloaded');
    // Dispose which also flushes the events (added in the patched package)
    await Aptabase.dispose();
  });
}
