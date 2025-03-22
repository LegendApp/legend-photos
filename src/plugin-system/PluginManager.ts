import { observable } from '@legendapp/state';
import { onHotkeys } from '../Keyboard';
import type { Plugin, PluginLocation, PluginRegistry } from './PluginTypes';

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

  // Register plugin hotkeys if available
  if (plugin.hotkeys) {
    // Clean up existing hotkeys for this plugin if they exist
    unregisterPluginHotkeys(plugin.id);

    // Register new hotkeys
    const unsub = onHotkeys(plugin.hotkeys);
    hotkeyUnsubscribers.set(plugin.id, unsub);
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

// Helper function to get all plugins for a specific location
export function getPluginsForLocation(location: PluginLocation): Plugin[] {
  const allPlugins = plugins$.get();
  return Object.values(allPlugins).filter(
    (plugin) => plugin.childOf === location && plugin.enabled !== false
  );
}

// Enable or disable a plugin
export function setPluginEnabled(pluginId: string, enabled: boolean): void {
  plugins$[pluginId].enabled.set(enabled);

  // If disabling, unregister hotkeys
  if (!enabled) {
    unregisterPluginHotkeys(pluginId);
  } else {
    // If enabling, register hotkeys
    const plugin = plugins$[pluginId].get();
    if (plugin.hotkeys) {
      const unsub = onHotkeys(plugin.hotkeys);
      hotkeyUnsubscribers.set(pluginId, unsub);
    }
  }
}
