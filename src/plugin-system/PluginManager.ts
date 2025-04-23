import type {
  DisplayPlugin,
  LoaderPlugin,
  PluginLocation,
  PluginRegistry,
  SourcePlugin,
} from '@/plugin-system/PluginTypes';
import { HotkeyMetadata, type HotkeyName, hotkeys$ } from '@/settings/Hotkeys';
import { onHotkeys } from '@/systems/keyboard/Keyboard';
import { observable } from '@legendapp/state';

// Create an observable state for plugin registry
export const plugins$ = observable<PluginRegistry>({});

// Create observable for plugin settings
export const pluginSettings$ = observable<Record<string, any>>({});

// Track active hotkey unsubscribers
const hotkeyUnsubscribers = new Map<string, () => void>();

// Register a plugin with the system
export function registerPlugin(plugin: DisplayPlugin | SourcePlugin | LoaderPlugin): void {
  // Store the plugin in the registry
  plugins$[plugin.id].set(plugin);

  // Register plugin hotkeys if available (only for render plugins)
  if (plugin.type === 'display') {
    if (plugin.hotkeys) {
      // Clean up existing hotkeys for this plugin if they exist
      unregisterPluginHotkeys(plugin.id);

      // Convert hotkeys to a format compatible with onHotkeys
      const processedHotkeys: Partial<Record<HotkeyName, () => void>> = {};

      // Process each hotkey
      for (const [hotkeyName, hotkeyValue] of Object.entries(plugin.hotkeys)) {
        if (typeof hotkeyValue === 'function') {
          // Simple function hotkey
          processedHotkeys[hotkeyName as HotkeyName] = hotkeyValue;
        } else if (hotkeyValue && typeof hotkeyValue === 'object') {
          // Enhanced hotkey with metadata
          processedHotkeys[hotkeyName as HotkeyName] = hotkeyValue.action;

          // If there's a description or repeat option, update the metadata
          const metadata = {} as {
            description: string;
            repeat?: boolean;
          };
          if (hotkeyValue.description) {
            metadata.description = hotkeyValue.description;
          }
          if (hotkeyValue.repeat !== undefined) {
            metadata.repeat = hotkeyValue.repeat;
          }
          HotkeyMetadata[hotkeyName as HotkeyName] = metadata;

          // Set default key code if provided and not already set by user
          if (hotkeyValue.defaultKeyCode !== undefined) {
            const currentKeyCode = hotkeys$[hotkeyName as HotkeyName].get();

            // Only set the default if the hotkey doesn't exist or has been reset to default
            if (currentKeyCode === undefined) {
              hotkeys$[hotkeyName as HotkeyName].set(hotkeyValue.defaultKeyCode);
            }
          }
        }
      }

      // Register the processed hotkeys
      const unsub = onHotkeys(processedHotkeys);
      hotkeyUnsubscribers.set(plugin.id, unsub);
    }
  } else if (plugin.type === 'source' || plugin.type === 'loader') {
    plugin.initialize();
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
export function getPluginsForLocation(location: PluginLocation): DisplayPlugin[] {
  const allPlugins = plugins$.get();
  return Object.values(allPlugins).filter(
    (plugin) =>
      plugin.type === 'display' &&
      (plugin as DisplayPlugin).childOf === location &&
      plugin.enabled !== false
  ) as DisplayPlugin[];
}

// Helper function to get all source plugins
export function getSourcePlugins(): SourcePlugin[] {
  // TODO: Create this once so it doesn't filter every time
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
    if (plugin.type === 'display') {
      const displayDisplayPlugin = plugin as DisplayPlugin;
      if (displayDisplayPlugin.hotkeys) {
        const unsub = onHotkeys(displayDisplayPlugin.hotkeys);
        hotkeyUnsubscribers.set(pluginId, unsub);
      }
    }
  }
}
