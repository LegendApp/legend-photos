import type { PhotoInfo } from '@/systems/FileManager';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

// Define where plugins can be rendered
export type PluginLocation = 'root' | 'photosGrid' | 'photo' | 'photoFullscreen' | 'metadata';

// Define types of plugins
export type PluginType = 'display' | 'source' | 'loader';

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

// Enhanced key info with optional metadata
export interface EnhancedKeyInfo {
  action: () => void;
  description?: string;
  repeat?: boolean;
  defaultKeyCode?: number; // Default key code to use for this hotkey
}

// SimpleKeyInfo is now just a function type or an EnhancedKeyInfo object
export type SimpleKeyInfo = (() => void) | EnhancedKeyInfo;

// Render plugin interface
export interface DisplayPlugin extends Plugin {
  type: 'display';
  shouldRender?: (props: any) => boolean;
  component?: (props: any) => ReactNode;
  childOf?: PluginLocation;
  position: 'l' | 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl';
  hotkeys?: Record<string, SimpleKeyInfo>;
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
  isLoaded: () => boolean;
  // Initialize the plugin
  initialize: () => Promise<void>;
  // Get folders with photos (recursive)
  getSidebarGroups: () => SidebarGroup[];
  // Get photos in a specific folder
  getPhotos: (folderPath: string) => Promise<PhotoInfo[]>;
}

// Loader plugin interface for extending file support
export interface LoaderPlugin extends Plugin {
  type: 'loader';
  // File extensions this loader supports (without dots)
  supportedExtensions: string[];
  // Initialize the plugin
  initialize: () => Promise<void>;
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
