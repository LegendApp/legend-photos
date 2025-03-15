import { KeyCodes } from './KeyboardManager';
import { state$ } from './State';
import { useKeyboard } from './useKeyboard';

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
export function usePhotosKeyboardManager() {
  // Get the current state
  const photos = state$.photos.get();

  console.log('usePhotosKeyboardManager');

  // Set up keyboard shortcuts
  useKeyboard({
    onKeyDown: (event) => {
      console.log('key down', event.keyCode);

      const selectedPhotoIndex = state$.selectedPhotoIndex.get() ?? 0;
      const numColumns = state$.numColumns.get();
      const selectedPhotoIndex$ = state$.selectedPhotoIndex;

      // Handle navigation keys
      switch (event.keyCode) {
        case KeyCodes.KEY_LEFT:
          // Previous photo
          if (selectedPhotoIndex > 0) {
            selectedPhotoIndex$.set(selectedPhotoIndex - 1);
          }
          break;

        case KeyCodes.KEY_RIGHT:
          // Next photo
          if (selectedPhotoIndex < photos.length - 1) {
            selectedPhotoIndex$.set(selectedPhotoIndex + 1);
          }
          break;

        case KeyCodes.KEY_UP:
          // Previous row
          if (selectedPhotoIndex >= numColumns) {
            selectedPhotoIndex$.set(selectedPhotoIndex - numColumns);
          }
          break;

        case KeyCodes.KEY_DOWN:
          // Next row
          if (selectedPhotoIndex < photos.length - numColumns) {
            selectedPhotoIndex$.set(selectedPhotoIndex + numColumns);
          }
          break;

        case KeyCodes.KEY_ESCAPE:
          // Exit fullscreen
          if (state$.fullscreenPhoto.get()) {
            state$.fullscreenPhoto.set(null);
          }
          break;

        // case KeyCodes.KEY_DELETE:
        // case KeyCodes.KEY_BACKSPACE:
        //   // Delete current photo
        //   if (deletePhoto && selectedPhotoIndex >= 0 && selectedPhotoIndex < photos.length) {
        //     deletePhoto(selectedPhotoIndex);
        //   }
        //   break;

        // case KeyCodes.KEY_F:
        //   // Toggle fullscreen
        //   isFullscreen$.set(!isFullscreen);
        //   break;

        // case KeyCodes.KEY_ESCAPE:
        //   // Exit fullscreen
        //   if (isFullscreen) {
        //     isFullscreen$.set(false);
        //   }
        //   break;
      }
    },
  });
}
