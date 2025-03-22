import { NativeModules } from 'react-native';

const { AutoUpdater } = NativeModules;

interface AutoUpdaterInterface {
  /**
   * Checks for updates immediately
   * @returns Promise that resolves when the check is initiated
   */
  checkForUpdates(): Promise<boolean>;

  /**
   * Gets whether automatic update checking is enabled
   * @returns Promise that resolves to a boolean indicating if automatic updates are enabled
   */
  getAutomaticallyChecksForUpdates(): Promise<boolean>;

  /**
   * Sets whether automatic update checking is enabled
   * @param value Whether automatic update checking should be enabled
   * @returns Promise that resolves when the setting is updated
   */
  setAutomaticallyChecksForUpdates(value: boolean): Promise<boolean>;

  /**
   * Gets the interval between automatic update checks in seconds
   * @returns Promise that resolves to the update check interval
   */
  getUpdateCheckInterval(): Promise<number>;

  /**
   * Sets the interval between automatic update checks in seconds
   * @param interval The interval in seconds
   * @returns Promise that resolves when the setting is updated
   */
  setUpdateCheckInterval(interval: number): Promise<boolean>;
}

/**
 * Module for handling app updates using Sparkle framework (macOS only)
 *
 * Setup instructions:
 * 1. The app needs to have SUFeedURL key in Info.plist pointing to your appcast.xml
 * 2. For security, set SUPublicEDKey with your Ed25519 public key in Info.plist
 * 3. Generate appcast.xml using Sparkle's tools
 */
export const AutoUpdaterModule: AutoUpdaterInterface = AutoUpdater;
