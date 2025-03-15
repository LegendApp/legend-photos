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
    [KeyCodes.KEY_LEFT]: () => {
      const idx = selectedPhotoIndex$.get();
      if (idx! > 0) {
        selectedPhotoIndex$.set((v) => v! - 1);
      }
    },
    [KeyCodes.KEY_RIGHT]: () => {
      const photos = photos$.get();
      const idx = selectedPhotoIndex$.get();
      if (idx! < photos.length - 1) {
        selectedPhotoIndex$.set((v) => v! + 1);
      }
    },
    [KeyCodes.KEY_UP]: () => {
      const numColumns = state$.numColumns.get();
      const idx = selectedPhotoIndex$.get();
      if (idx! >= numColumns) {
        selectedPhotoIndex$.set((v) => v! - numColumns);
      }
    },
    [KeyCodes.KEY_DOWN]: () => {
      const photos = photos$.get();
      const numColumns = state$.numColumns.get();
      const idx = selectedPhotoIndex$.get();
      if (idx! < photos.length - numColumns) {
        selectedPhotoIndex$.set((v) => v! + numColumns);
      }
    },
  });
}
