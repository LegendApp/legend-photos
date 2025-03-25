import { settings$ } from '@/settings/SettingsFile';
import { state$ } from '@/systems/State';
import { useOnHotkeys } from '@/systems/keyboard/Keyboard';
import { KeyCodes } from '@/systems/keyboard/KeyboardManager';
import type { LegendListRef } from '@legendapp/list';
import type { RefObject } from 'react';

export function usePhotosViewKeyboard(_refList: RefObject<LegendListRef>) {
  // Get the current state
  const photos$ = state$.photos;
  const selectedPhotoIndex$ = state$.selectedPhotoIndex;

  const addIndex = (add: number) => {
    const newIdx = selectedPhotoIndex$.get() + add;
    selectedPhotoIndex$.set(newIdx);

    // TODO: Ensure this is in view
    // const viewOffset = add > 0 ? windowDimensions$.height.get() - 200 : 0;
    // refList.current?.scrollToIndex({ index: newIdx, animated: true, viewOffset });
  };

  useOnHotkeys({
    Left: {
      action: () => {
        const idx = selectedPhotoIndex$.get();
        if (idx! > 0) {
          selectedPhotoIndex$.set((v) => v! - 1);
        }
      },
      key: KeyCodes.KEY_LEFT,
      description: 'Select previous photo',
      keyText: '←',
      repeat: true,
    },
    Right: {
      action: () => {
        const photos = photos$.get();
        const idx = selectedPhotoIndex$.get();
        if (idx! < photos.length - 1) {
          addIndex(1);
        }
      },
      key: KeyCodes.KEY_RIGHT,
      description: 'Select next photo',
      keyText: '→',
      repeat: true,
    },
    Up: {
      action: () => {
        const numColumns = settings$.state.numColumns.get();
        const idx = selectedPhotoIndex$.get();
        if (idx! >= numColumns) {
          addIndex(-numColumns);
        }
      },
      key: KeyCodes.KEY_UP,
      description: 'Select photo above',
      keyText: '↑',
      repeat: true,
    },
    Down: {
      action: () => {
        const photos = photos$.get();
        const numColumns = settings$.state.numColumns.get();
        const idx = selectedPhotoIndex$.get();
        if (idx! < photos.length - numColumns) {
          addIndex(numColumns);
        }
      },
      key: KeyCodes.KEY_DOWN,
      description: 'Select photo below',
      keyText: '↓',
      repeat: true,
    },
    'Decrease Columns': {
      action: () => {
        const currentColumns = settings$.state.numColumns.get();
        if (currentColumns > 1) {
          settings$.state.numColumns.set(currentColumns - 1);
        }
      },
      key: KeyCodes.KEY_MINUS,
      description: 'Decrease number of columns',
      keyText: '-',
      repeat: true,
    },
    'Increase Columns': {
      action: () => {
        const currentColumns = settings$.state.numColumns.get();
        settings$.state.numColumns.set(currentColumns + 1);
      },
      key: KeyCodes.KEY_EQUALS,
      description: 'Increase number of columns',
      keyText: '+',
      repeat: true,
    },
  });
}
