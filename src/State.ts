import { observable } from '@legendapp/state';

// Define the interface for the fullscreen photo data
export interface FullscreenPhotoData {
  uri: string;
  initialPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const state$ = observable({
  photos: [] as string[],
  selectedFolder: '',
  selectedPhotoIndex: null as number | null,
  fullscreenPhoto: null as FullscreenPhotoData | null,
  sidebarWidth: 160 as number,
  isSidebarOpen: true,
  numColumns: 1 as number,
});
