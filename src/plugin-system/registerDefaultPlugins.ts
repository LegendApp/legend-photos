import { PluginFlagReject } from '../plugins/PluginFlagReject';
import { PluginFullscreenPhotoInfo } from '../plugins/PluginFullscreenPhotoInfo';
import { PluginRating } from '../plugins/PluginRating';
import { registerPlugin } from './PluginManager';

export * from './PluginManager';
export * from './PluginRenderer';
export * from './PluginTypes';

// List of default plugins
const defaultPlugins = [PluginRating, PluginFlagReject, PluginFullscreenPhotoInfo /*DeletePlugin*/];

// Register all default plugins
export function registerDefaultPlugins(): void {
  defaultPlugins.forEach(registerPlugin);
}
