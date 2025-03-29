import { type WindowOptions, useWindowManager } from '@/native-modules/WindowManager';
import { state$ } from '@/systems/State';
import { useOnHotkeys } from '@/systems/keyboard/Keyboard';
import { useMountOnce } from '@legendapp/state/react';

export const SettingsWindowManager = () => {
  const windowManager = useWindowManager();

  useOnHotkeys({
    Settings: () => {
      state$.showSettings.set(true);
    },
  });
  useMountOnce(() => {
    state$.showSettings.onChange(async ({ value }) => {
      if (value) {
        try {
          const options: WindowOptions = {
            title: 'Settings',
            width: 600,
            height: 680,
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
