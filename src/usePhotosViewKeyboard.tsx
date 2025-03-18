import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { state$ } from './State';

/**
 * PhotosKeyboardManager handles keyboard shortcuts for the photos view
 *
 * Keyboard shortcuts:
 * - Left Arrow: Previous photo
 * - Right Arrow: Next photo
 * - Delete/Backspace: Delete current photo
 * - F: Toggle fullscreen
 * - Escape: Exit fullscreen
 */
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
        const numColumns = state$.numColumns.get();
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
        const numColumns = state$.numColumns.get();
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
  });
}
