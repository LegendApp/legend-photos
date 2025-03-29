import { settings$ } from '@/settings/SettingsFile';
import { state$ } from '@/systems/State';
import { useOnHotkeys } from '@/systems/keyboard/Keyboard';
import type { LegendListRef } from '@legendapp/list';
import type { RefObject } from 'react';

export function usePhotosViewKeyboard(_refList: RefObject<LegendListRef | null>) {
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
    Left: () => {
      const idx = selectedPhotoIndex$.get();
      if (idx! > 0) {
        selectedPhotoIndex$.set((v) => v! - 1);
      }
    },
    Right: () => {
      const photos = photos$.get();
      const idx = selectedPhotoIndex$.get();
      if (idx! < photos.length - 1) {
        addIndex(1);
      }
    },
    Up: () => {
      const numColumns = settings$.state.numColumns.get();
      const idx = selectedPhotoIndex$.get();
      if (idx! >= numColumns) {
        addIndex(-numColumns);
      }
    },
    Down: () => {
      const photos = photos$.get();
      const numColumns = settings$.state.numColumns.get();
      const idx = selectedPhotoIndex$.get();
      if (idx! < photos.length - numColumns) {
        addIndex(numColumns);
      }
    },
    'Decrease Columns': () => {
      const currentColumns = settings$.state.numColumns.get();
      if (currentColumns > 1) {
        settings$.state.numColumns.set(currentColumns - 1);
      }
    },
    'Increase Columns': () => {
      const currentColumns = settings$.state.numColumns.get();
      settings$.state.numColumns.set(currentColumns + 1);
    },
  });
}
