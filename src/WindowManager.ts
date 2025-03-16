import { NativeEventEmitter, NativeModules } from 'react-native';

const { WindowManager } = NativeModules;

if (!WindowManager) {
  throw new Error('WindowManager native module is not available');
}

type WindowManagerType = {
  openWindow: () => Promise<{ success: boolean }>;
  closeWindow: () => Promise<{ success: boolean; message?: string }>;
};

const windowManagerEmitter = new NativeEventEmitter(WindowManager);

export const useWindowManager = (): WindowManagerType & {
  onWindowClosed: (callback: () => void) => { remove: () => void };
} => {
  return {
    openWindow: WindowManager.openWindow,
    closeWindow: WindowManager.closeWindow,
    onWindowClosed: (callback: () => void) => {
      const subscription = windowManagerEmitter.addListener('onWindowClosed', callback);
      return {
        remove: () => subscription.remove(),
      };
    },
  };
};

export default WindowManager as WindowManagerType;
