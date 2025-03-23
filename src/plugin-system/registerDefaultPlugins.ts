import { registerPlugin } from '@/plugin-system/PluginManager';
import { PluginFlagReject } from '@/plugins/PluginFlagReject';
import { PluginFullscreenPhotoInfo } from '@/plugins/PluginFullscreenPhotoInfo';
import { PluginLocalFiles } from '@/plugins/PluginLocalFiles';
import { PluginRating } from '@/plugins/PluginRating';

export * from '@/plugin-system/PluginManager';
export * from '@/plugin-system/PluginRenderer';
export * from '@/plugin-system/PluginTypes';

// List of default plugins
const defaultPlugins = [
  PluginLocalFiles,
  PluginRating,
  PluginFlagReject,
  PluginFullscreenPhotoInfo,
];

// Register all default plugins
export function registerDefaultPlugins(): void {
  defaultPlugins.forEach(registerPlugin);
}
