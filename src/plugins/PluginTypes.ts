import type { ReactNode } from 'react';
import type { PhotoInfo } from '../FileManager';
import type { KeyInfo, KeyboardEventCodeHotkey } from '../Keyboard';

// Define where plugins can be rendered
export type PluginLocation = 'root' | 'photosGrid' | 'photo' | 'photoFullscreen' | 'metadata';

// Plugin settings interface
export interface PluginSettings {
  [key: string]: any;
}

// Base plugin interface
export interface Plugin {
  id: string;
  name: string;
  description?: string;
  version?: string;
  enabled?: boolean;
  shouldRender?: (props: any) => boolean;
  component?: (props: any) => ReactNode;
  childOf?: PluginLocation;
  hotkeys?: Record<KeyboardEventCodeHotkey, KeyInfo>;
  settings?: PluginSettings;
}

// Plugin registry
export interface PluginRegistry {
  [id: string]: Plugin;
}

export interface PhotoPluginProps {
  photo: PhotoInfo;
}
