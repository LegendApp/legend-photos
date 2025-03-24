import { settings$ } from '@/settings/SettingsFile';
import { state$ } from '@/systems/State';
import { useOnHotkeys } from '@/systems/keyboard/Keyboard';
import { KeyCodes } from '@/systems/keyboard/KeyboardManager';

export function usePhotosViewKeyboard() {
  // Get the current state
  const photos$ = state$.photos;
  const selectedPhotoIndex$ = state$.selectedPhotoIndex;

  useOnHotkeys({
    [KeyCodes.KEY_LEFT]: {
      action: () => {
        const idx = selectedPhotoIndex$.get();
        if (idx! > 0) {
          selectedPhotoIndex$.set((v) => v! - 1);
        }
      },
      name: 'Left',
      description: 'Select previous photo',
      keyText: '←',
      repeat: true,
    },
    [KeyCodes.KEY_RIGHT]: {
      action: () => {
        const photos = photos$.get();
        const idx = selectedPhotoIndex$.get();
        if (idx! < photos.length - 1) {
          selectedPhotoIndex$.set((v) => v! + 1);
        }
      },
      name: 'Right',
      description: 'Select next photo',
      keyText: '→',
      repeat: true,
    },
    [KeyCodes.KEY_UP]: {
      action: () => {
        const numColumns = settings$.state.numColumns.get();
        const idx = selectedPhotoIndex$.get();
        if (idx! >= numColumns) {
          selectedPhotoIndex$.set((v) => v! - numColumns);
        }
      },
      name: 'Up',
      description: 'Select photo above',
      keyText: '↑',
      repeat: true,
    },
    [KeyCodes.KEY_DOWN]: {
      action: () => {
        const photos = photos$.get();
        const numColumns = settings$.state.numColumns.get();
        const idx = selectedPhotoIndex$.get();
        if (idx! < photos.length - numColumns) {
          selectedPhotoIndex$.set((v) => v! + numColumns);
        }
      },
      name: 'Down',
      description: 'Select photo below',
      keyText: '↓',
      repeat: true,
    },
    // New shortcuts for adjusting columns
    [KeyCodes.KEY_MINUS]: {
      // Minus key
      action: () => {
        const currentColumns = settings$.state.numColumns.get();
        if (currentColumns > 1) {
          settings$.state.numColumns.set(currentColumns - 1);
        }
      },
      name: 'Decrease Columns',
      description: 'Decrease number of columns',
      keyText: '-',
      repeat: true,
    },
    [KeyCodes.KEY_EQUALS]: {
      // Plus/equals key
      action: () => {
        const currentColumns = settings$.state.numColumns.get();
        settings$.state.numColumns.set(currentColumns + 1);
      },
      name: 'Increase Columns',
      description: 'Increase number of columns',
      keyText: '+',
      repeat: true,
    },
  });
}
