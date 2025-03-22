import { FlagRejectPlugin } from '../plugins/FlagRejectPlugin';
import { photoInfoPlugin } from '../plugins/PhotoInfoPlugin';
import { RatingPlugin } from '../plugins/RatingPlugin';
import { registerPlugin } from './PluginManager';

export * from './PluginManager';
export * from './PluginRenderer';
export * from './PluginTypes';

// List of default plugins
const defaultPlugins = [RatingPlugin, FlagRejectPlugin, photoInfoPlugin /*DeletePlugin*/];

// Register all default plugins
export function registerDefaultPlugins(): void {
  defaultPlugins.forEach(registerPlugin);
}
