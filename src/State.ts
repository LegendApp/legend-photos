import { observable, observe } from '@legendapp/state';
import { NativeModules } from 'react-native';
import type { PhotoInfo } from './FileManager';
import { settings$ } from './settings/SettingsFile';

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
  photos: [] as PhotoInfo[],
  selectedPhotoIndex: -1,
  fullscreenPhoto: null as FullscreenPhotoData | null,
  numColumns: 1 as number,
  isPhotoFullscreenCoveringControls: false,
  stoplightEnforcerHovered: false,
  showSettings: false,
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
