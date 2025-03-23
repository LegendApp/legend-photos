import type { PhotoInfo } from '@/systems/FileManager';
import type { KeyInfo, KeyboardEventCodeHotkey } from '@/systems/keyboard/Keyboard';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

// Define where plugins can be rendered
export type PluginLocation = 'root' | 'photosGrid' | 'photo' | 'photoFullscreen' | 'metadata';

// Define types of plugins
export type PluginType = 'display' | 'source';

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
  type: PluginType;
}

// Render plugin interface
export interface DisplayPlugin extends Plugin {
  type: 'display';
  shouldRender?: (props: any) => boolean;
  component?: (props: any) => ReactNode;
  childOf?: PluginLocation;
  position: 'l' | 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl';
  hotkeys?: Record<KeyboardEventCodeHotkey, KeyInfo>;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  path: string;
  text: string;
  depth: number;
}

// Source plugin interface
export interface SourcePlugin extends Plugin {
  type: 'source';
  // Initialize the plugin
  initialize: () => Promise<void>;
  // Get folders with photos (recursive)
  getSidebarGroups: () => SidebarGroup[];
  // Get photos in a specific folder
  getPhotos: (folderPath: string) => Promise<PhotoInfo[]>;
}

// Plugin registry
export interface PluginRegistry {
  [id: string]: Plugin;
}

export interface PluginProps {
  style: ViewStyle;
}

export interface PhotoPluginProps extends PluginProps {
  photo: PhotoInfo;
}
