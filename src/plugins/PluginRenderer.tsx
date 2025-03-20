import { useSelector } from '@legendapp/state/react';
import React, { createElement } from 'react';
import { View, type ViewStyle } from 'react-native';
import { plugins$ } from './PluginManager';
import type { Plugin, PluginLocation } from './PluginTypes';

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
        createElement(plugin.component!, {
          ...props,
          key: plugin.id,
          style: getPluginStyle(plugin),
        })
      )}
    </View>
  );
}

function getPluginStyle(plugin: Plugin) {
  const style: ViewStyle = {
    position: 'absolute',
  };

  const { position } = plugin;
  if (position === 't') {
    style.left = 0;
    style.top = 0;
    style.right = 0;
  }
  if (position === 'br') {
    style.right = 0;
    style.bottom = 0;
  }
  if (position === 'bl') {
    style.left = 0;
    style.bottom = 0;
  }

  return style;
}
