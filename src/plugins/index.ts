import { DeletePlugin } from './DeletePlugin';
import { FlagRejectPlugin } from './FlagRejectPlugin';
import { registerPlugin } from './PluginManager';
import { RatingPlugin } from './RatingPlugin';

export * from './PluginTypes';
export * from './PluginManager';
export * from './PluginRenderer';

// List of default plugins
const defaultPlugins = [RatingPlugin, FlagRejectPlugin, DeletePlugin];

// Register all default plugins
export function registerDefaultPlugins(): void {
  defaultPlugins.forEach(registerPlugin);
  console.log('Default plugins registered');
}

// Export individual plugins
export { RatingPlugin, FlagRejectPlugin, DeletePlugin };
