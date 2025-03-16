import React, { useEffect, useState } from 'react';
import { PlatformColor, ScrollView, View, useColorScheme } from 'react-native';
import { SidebarButton } from '../SidebarButton';
import { GeneralSettings } from './GeneralSettings';
import { HotkeySettings } from './HotkeySettings';
import { LibrarySettings } from './LibrarySettings';
import { PluginSettings } from './PluginSettings';
import { initializeSettings } from './SettingsFile';
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
  const [selectedCategory, setSelectedCategory] = useState('general');
  const isDarkMode = useColorScheme() === 'dark';

  // Initialize settings when component mounts
  useEffect(() => {
    initializeSettings();
  }, []);

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
    <View
      className="flex flex-1 flex-row bg-[#111]"
      style={{ backgroundColor: PlatformColor('SystemControlAcrylicWindowBrush') }}
    >
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
  );
};
