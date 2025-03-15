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
  photos: observable<string[]>([]),
  selectedPhotoIndex: observable<number | null>(null),
  fullscreenPhoto: observable<FullscreenPhotoData | null>(null),
  sidebarWidth: observable<number>(160),
  numColumns: observable<number>(1),
});
