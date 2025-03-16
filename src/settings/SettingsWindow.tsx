import { useMountOnce } from '@legendapp/state/react';
import { useOnHotkeys } from '../Keyboard';
import { KeyCodes } from '../KeyboardManager';
import { state$ } from '../State';
import { type WindowOptions, useWindowManager } from '../WindowManager';

export const SettingsWindow = () => {
  const windowManager = useWindowManager();

  useOnHotkeys({
    [KeyCodes.KEY_COMMA]: () => {
      state$.showSettings.set(true);
    },
  });
  useMountOnce(() => {
    state$.showSettings.onChange(async ({ value }) => {
      if (value) {
        try {
          const options: WindowOptions = {
            title: 'Settings',
            width: 800,
            height: 600,
          };

          const result = await windowManager.openWindow(options);
          console.log('Window opened:', result);
        } catch (error) {
          console.error('Failed to open window:', error);
        }
      } else {
        windowManager.closeWindow();
      }
    });

    const subscription = windowManager.onWindowClosed(() => {
      console.log('Window was closed');
      state$.showSettings.set(false);
    });

    return () => {
      subscription.remove();
    };
  });

  return null;
};
