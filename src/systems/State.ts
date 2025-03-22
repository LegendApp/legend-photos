import { observable } from '@legendapp/state';
import type { View } from 'react-native';
import type { PhotoInfo } from './FileManager';

export const fullscreenView = {
  current: null as View | null,
};
// Define the interface for the fullscreen photo data
export interface FullscreenPhotoData {
  initialPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const state$ = observable({
  photos: [] as PhotoInfo[],
  selectedPhotoIndex: -1,
  fullscreenPhoto: null as FullscreenPhotoData | null,
  isPhotoFullscreenCoveringControls: false,
  titleBarHovered: false,
  showSettings: false,
  selectedPhoto: () => state$.photos[state$.selectedPhotoIndex.get()],
  openingFolder: false,
});
