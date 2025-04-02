import { menuManager } from '@/native-modules/NativeMenuManager';
import { settings$ } from '@/settings/SettingsFile';
import { state$ } from '@/systems/State';

export function initializeMenuManager() {
  menuManager.addListener('onMenuCommand', (e) => {
    console.log('onMenuCommand', e);
    switch (e.commandId) {
      case 'settings':
        state$.showSettings.set(true);
        break;
      case 'showSidebar':
        settings$.state.isSidebarOpen.toggle();
        break;
      case 'showFilmstrip':
        settings$.state.showFilmstrip.toggle();
        break;
    }
  });
}
