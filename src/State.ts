import { observable, observe } from '@legendapp/state';
import { NativeModules } from 'react-native';

const WindowControls = NativeModules.WindowControls;

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
  isPhotoFullscreenCoveringControls: false,
  stoplightEnforcerHovered: false,
});

observe(() => {
  const isPhotoFullscreenCoveringControls = state$.isPhotoFullscreenCoveringControls.get();
  const isSidebarOpen = state$.isSidebarOpen.get();

  const hide =
    !state$.stoplightEnforcerHovered.get() && (isPhotoFullscreenCoveringControls || !isSidebarOpen);
  if (hide) {
    WindowControls.hideWindowControls();
  } else {
    WindowControls.showWindowControls();
  }
});
