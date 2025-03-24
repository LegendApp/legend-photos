import { AutoUpdaterModule } from '@/native-modules/AutoUpdater';
import { settings$ } from '@/settings/SettingsFile';
import { observe } from '@legendapp/state';

export function initializeUpdater() {
  // Don't update in dev
  if (__DEV__) {
    return;
  }

  // TODO: Implement auto-updater
  let previousCheckUpdates = false;
  observe(async () => {
    const autoUpdateEnabled = settings$.general.autoUpdate.enabled.get();
    const checkInterval = settings$.general.autoUpdate.checkInterval.get() * 3600; // Convert hours to seconds

    try {
      // Configure auto-update based on settings
      await Promise.all([
        AutoUpdaterModule.setAutomaticallyChecksForUpdates(autoUpdateEnabled),
        autoUpdateEnabled
          ? AutoUpdaterModule.setUpdateCheckInterval(checkInterval)
          : Promise.resolve(true),
      ]);

      // Check for updates immediately on app start if enabled
      if (autoUpdateEnabled && !previousCheckUpdates) {
        AutoUpdaterModule.checkForUpdates();
      }
    } catch (err) {
      console.error('Failed to initialize auto-updater:', err);
    }

    previousCheckUpdates = autoUpdateEnabled;
  });
}
