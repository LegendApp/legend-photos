import { registerDefaultPlugins } from '.';

// Initialize all plugins
export function initializePluginSystem(): void {
  // Register all built-in plugins
  registerDefaultPlugins();
}
