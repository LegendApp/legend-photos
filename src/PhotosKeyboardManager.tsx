import { KeyCodes } from './KeyboardManager';
import { photos$, selectedPhotoIndex$ } from './State';
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
export function usePhotosKeyboardManager(
  isFullscreen: boolean,
  setIsFullscreen: (value: boolean) => void,
  deletePhoto?: (index: number) => void
) {
  // Get the current state
  const selectedPhotoIndex = selectedPhotoIndex$.get() ?? 0;
  const photos = photos$.get();

  console.log('usePhotosKeyboardManager');

  // Set up keyboard shortcuts
  useKeyboard({
    onKeyDown: (event) => {
      console.log('key down', event.keyCode);
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

        case KeyCodes.KEY_DELETE:
        case KeyCodes.KEY_BACKSPACE:
          // Delete current photo
          if (deletePhoto && selectedPhotoIndex >= 0 && selectedPhotoIndex < photos.length) {
            deletePhoto(selectedPhotoIndex);
          }
          break;

        case KeyCodes.KEY_F:
          // Toggle fullscreen
          setIsFullscreen(!isFullscreen);
          break;

        case KeyCodes.KEY_ESCAPE:
          // Exit fullscreen
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
      }
    },
  });
}
