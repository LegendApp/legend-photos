import { DeletePlugin } from './DeletePlugin';
import { FlagRejectPlugin } from './FlagRejectPlugin';
import { photoInfoPlugin } from './PhotoInfoPlugin';
import { registerPlugin } from './PluginManager';
import { RatingPlugin } from './RatingPlugin';

export * from './PluginTypes';
export * from './PluginManager';
export * from './PluginRenderer';

// List of default plugins
const defaultPlugins = [RatingPlugin, FlagRejectPlugin, photoInfoPlugin /*DeletePlugin*/];

// Register all default plugins
export function registerDefaultPlugins(): void {
  defaultPlugins.forEach(registerPlugin);
}

// Export individual plugins
export { RatingPlugin, FlagRejectPlugin, DeletePlugin, photoInfoPlugin };
