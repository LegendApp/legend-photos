import { PluginFlagReject } from '@/plugins/PluginFlagReject';
import { PluginFullscreenPhotoInfo } from '@/plugins/PluginFullscreenPhotoInfo';
import { PluginRating } from '@/plugins/PluginRating';
import { registerPlugin } from '@/plugin-system/PluginManager';

export * from '@/plugin-system/PluginManager';
export * from '@/plugin-system/PluginRenderer';
export * from '@/plugin-system/PluginTypes';

// List of default plugins
const defaultPlugins = [PluginRating, PluginFlagReject, PluginFullscreenPhotoInfo /*DeletePlugin*/];

// Register all default plugins
export function registerDefaultPlugins(): void {
  defaultPlugins.forEach(registerPlugin);
}
