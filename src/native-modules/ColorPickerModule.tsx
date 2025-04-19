import { NativeModules, Platform } from 'react-native';

interface ColorPickerInterface {
  showColorPicker: (initialColor: string) => Promise<string>;
}

const NativeColorPicker =
  Platform.OS === 'macos' ? (NativeModules.ColorPicker as ColorPickerInterface) : null;

export const ColorPickerModule = {
  /**
   * Shows the native macOS color picker with the given initial color
   * @param initialColor - Initial color in hex format (e.g. #FF0000)
   * @returns Promise that resolves with the selected color in hex format, or rejects if canceled
   */
  showColorPicker: async (initialColor: string): Promise<string> => {
    if (!NativeColorPicker) {
      throw new Error('ColorPicker is not supported on this platform');
    }

    return NativeColorPicker.showColorPicker(initialColor);
  },
};
