import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import React, { useState } from 'react';
import { PlatformColor, ScrollView, View, useColorScheme } from 'react-native';
import { SidebarButton } from '../SidebarButton';
import { GeneralSettings } from './GeneralSettings';
import { HotkeySettings } from './HotkeySettings';
import { LibrarySettings } from './LibrarySettings';
import { PluginSettings } from './PluginSettings';
import { ThemeSettings } from './ThemeSettings';

// Define the categories for settings
const SETTING_CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'hotkeys', label: 'Hotkeys' },
  { id: 'themes', label: 'Themes' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'library', label: 'Library' },
  // Add more categories as needed
];

export const Settings = () => {
  const [selectedCategory, setSelectedCategory] = useState('library');
  const isDarkMode = useColorScheme() === 'dark';

  const renderContent = () => {
    switch (selectedCategory) {
      case 'general':
        return <GeneralSettings />;
      case 'hotkeys':
        return <HotkeySettings />;
      case 'themes':
        return <ThemeSettings />;
      case 'plugins':
        return <PluginSettings />;
      case 'library':
        return <LibrarySettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <VibrancyView blendingMode="behindWindow" material="sidebar" style={{ flex: 1 }}>
      <View className="flex flex-1 flex-row">
        <View className="w-[140px] border-r border-r-[#333]">
          <ScrollView>
            {SETTING_CATEGORIES.map((category) => (
              <SidebarButton
                key={category.id}
                label={category.label}
                isSelected={selectedCategory === category.id}
                isDarkMode={isDarkMode}
                onPress={() => setSelectedCategory(category.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View className="flex-1 p-5 bg-[#1a1a1a]">{renderContent()}</View>
      </View>
    </VibrancyView>
  );
};
