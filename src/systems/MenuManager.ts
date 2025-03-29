import { menuManager } from '@/native-modules/NativeMenuManager';
import { state$ } from '@/systems/State';

export function initializeMenuManager() {
  menuManager.addListener('onShowPreferences', () => {
    state$.showSettings.set(true);
  });
}
