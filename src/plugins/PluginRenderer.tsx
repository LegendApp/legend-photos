import { useSelector } from '@legendapp/state/react';
import React, { createElement } from 'react';
import { View } from 'react-native';
import { plugins$ } from './PluginManager';
import type { PluginLocation } from './PluginTypes';

interface PluginRendererProps {
  location: PluginLocation;
  className?: string;
  props?: Record<string, any>;
}

export function PluginRenderer({ location, className = '', props = {} }: PluginRendererProps) {
  const allPlugins = useSelector(plugins$);

  // Filter plugins for this location
  const locationPlugins = Object.values(allPlugins).filter(
    (plugin) =>
      plugin.childOf === location &&
      plugin.enabled !== false &&
      plugin.component &&
      (!plugin.shouldRender || plugin.shouldRender(props))
  );

  // If no plugins, return null
  if (locationPlugins.length === 0) {
    return null;
  }

  return (
    <View className={className}>
      {locationPlugins.map((plugin) =>
        createElement(plugin.component!, { ...props, key: plugin.id })
      )}
    </View>
  );
}
