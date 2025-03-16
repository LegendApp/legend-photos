import { registerDefaultPlugins } from '.';

// Initialize all plugins
export function initializePluginSystem(): void {
  // Register all built-in plugins
  registerDefaultPlugins();

  // Here you could also load user-installed plugins from a configuration file

  console.log('Plugin system initialized');
}
