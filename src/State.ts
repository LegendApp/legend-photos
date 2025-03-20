import { observable, observe } from '@legendapp/state';
import { NativeModules, type View } from 'react-native';
import type { PhotoInfo } from './FileManager';
import { settings$ } from './settings/SettingsFile';

const WindowControls = NativeModules.WindowControls;

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
  stoplightEnforcerHovered: false,
  showSettings: false,
  selectedPhoto: () => state$.photos[state$.selectedPhotoIndex.get()],
});

observe(() => {
  const isPhotoFullscreenCoveringControls = state$.isPhotoFullscreenCoveringControls.get();
  const isSidebarOpen = settings$.state.isSidebarOpen.get();

  const hide =
    !state$.stoplightEnforcerHovered.get() && (isPhotoFullscreenCoveringControls || !isSidebarOpen);
  if (hide) {
    WindowControls.hideWindowControls();
  } else {
    WindowControls.showWindowControls();
  }
});
