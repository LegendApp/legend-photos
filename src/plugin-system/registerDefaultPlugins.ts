import { registerPlugin } from '@/plugin-system/PluginManager';
import type { DisplayPlugin, LoaderPlugin, SourcePlugin } from '@/plugin-system/PluginTypes';
import { PluginFlagReject } from '@/plugins/PluginFlagReject';
import { PluginFullscreenPhotoInfo } from '@/plugins/PluginFullscreenPhotoInfo';
import { PluginLocalFiles } from '@/plugins/PluginLocalFiles';
import { PluginPhotoKit } from '@/plugins/PluginPhotoKit';
import { PluginRating } from '@/plugins/PluginRating';
import { PluginRawFiles } from '@/plugins/PluginRawFiles';

export * from '@/plugin-system/PluginManager';
export * from '@/plugin-system/PluginRenderer';
export * from '@/plugin-system/PluginTypes';

// List of default plugins
const defaultPlugins: (DisplayPlugin | SourcePlugin | LoaderPlugin)[] = [
  PluginLocalFiles,
  PluginPhotoKit,
  PluginRating,
  PluginFlagReject,
  PluginFullscreenPhotoInfo,
  PluginRawFiles,
];

// Register all default plugins
export function registerDefaultPlugins(): void {
  for (const plugin of defaultPlugins) {
    registerPlugin(plugin);
  }
}
