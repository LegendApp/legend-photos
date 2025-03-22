import { useMountOnce } from '@legendapp/state/react';
import { type WindowOptions, useWindowManager } from '../native-modules/WindowManager';
import { state$ } from '../systems/State';
import { useOnHotkeys } from '../systems/keyboard/Keyboard';
import { KeyCodes } from '../systems/keyboard/KeyboardManager';

export const SettingsWindow = () => {
  const windowManager = useWindowManager();

  useOnHotkeys({
    [KeyCodes.KEY_COMMA]: {
      action: () => {
        state$.showSettings.set(true);
      },
      name: 'Settings',
      description: 'Open settings',
      keyText: ',',
    },
  });
  useMountOnce(() => {
    state$.showSettings.onChange(async ({ value }) => {
      if (value) {
        try {
          const options: WindowOptions = {
            title: 'Settings',
            width: 600,
            height: 480,
          };

          await windowManager.openWindow(options);
        } catch (error) {
          console.error('Failed to open window:', error);
        }
      } else {
        windowManager.closeWindow();
      }
    });

    const subscription = windowManager.onWindowClosed(() => {
      state$.showSettings.set(false);
    });

    return () => {
      subscription.remove();
    };
  });

  return null;
};
