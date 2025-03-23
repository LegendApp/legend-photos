import type {
  Plugin,
  PluginLocation,
  PluginRegistry,
  RenderPlugin,
  SourcePlugin,
} from '@/plugin-system/PluginTypes';
import { onHotkeys } from '@/systems/keyboard/Keyboard';
import { observable } from '@legendapp/state';

// Create an observable state for plugin registry
export const plugins$ = observable<PluginRegistry>({});

// Create observable for plugin settings
export const pluginSettings$ = observable<Record<string, any>>({});

// Track active hotkey unsubscribers
const hotkeyUnsubscribers = new Map<string, () => void>();

// Register a plugin with the system
export function registerPlugin(plugin: Plugin): void {
  // Store the plugin in the registry
  plugins$[plugin.id].set(plugin);

  // Initialize plugin settings if available
  if (plugin.settings) {
    pluginSettings$[plugin.id].set(plugin.settings);
  }

  // Register plugin hotkeys if available (only for render plugins)
  if (plugin.type === 'render') {
    const renderPlugin = plugin as RenderPlugin;
    if (renderPlugin.hotkeys) {
      // Clean up existing hotkeys for this plugin if they exist
      unregisterPluginHotkeys(plugin.id);

      // Register new hotkeys
      const unsub = onHotkeys(renderPlugin.hotkeys);
      hotkeyUnsubscribers.set(plugin.id, unsub);
    }
  }
}

// Unregister a plugin
export function unregisterPlugin(pluginId: string): void {
  // Clean up hotkeys
  unregisterPluginHotkeys(pluginId);

  // Remove from registry
  plugins$[pluginId].delete();
}

// Unregister plugin hotkeys
function unregisterPluginHotkeys(pluginId: string): void {
  const unsub = hotkeyUnsubscribers.get(pluginId);
  if (unsub) {
    unsub();
    hotkeyUnsubscribers.delete(pluginId);
  }
}

// Helper function to get all render plugins for a specific location
export function getPluginsForLocation(location: PluginLocation): RenderPlugin[] {
  const allPlugins = plugins$.get();
  return Object.values(allPlugins).filter(
    (plugin) =>
      plugin.type === 'render' &&
      (plugin as RenderPlugin).childOf === location &&
      plugin.enabled !== false
  ) as RenderPlugin[];
}

// Helper function to get all source plugins
export function getSourcePlugins(): SourcePlugin[] {
  const allPlugins = plugins$.get();
  return Object.values(allPlugins).filter(
    (plugin) => plugin.type === 'source' && plugin.enabled !== false
  ) as SourcePlugin[];
}

// Enable or disable a plugin
export function setPluginEnabled(pluginId: string, enabled: boolean): void {
  plugins$[pluginId].enabled.set(enabled);

  // If disabling, unregister hotkeys
  if (!enabled) {
    unregisterPluginHotkeys(pluginId);
  } else {
    // If enabling and it's a render plugin with hotkeys, register them
    const plugin = plugins$[pluginId].get();
    if (plugin.type === 'render') {
      const renderPlugin = plugin as RenderPlugin;
      if (renderPlugin.hotkeys) {
        const unsub = onHotkeys(renderPlugin.hotkeys);
        hotkeyUnsubscribers.set(pluginId, unsub);
      }
    }
  }
}
