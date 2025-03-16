import React, { useState } from 'react';
import { PlatformColor, ScrollView, Text, View, useColorScheme } from 'react-native';
import { SidebarButton } from './SidebarButton';

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
      <View className="w-[200px] border-r border-r-[#333]">
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

// Placeholder components for each settings section
const GeneralSettings = () => (
  <View>
    <Text className="text-2xl font-bold text-white mb-5">General Settings</Text>
    {/* Add your general settings controls here */}
  </View>
);

const HotkeySettings = () => (
  <View>
    <Text className="text-2xl font-bold text-white mb-5">Hotkey Settings</Text>
    {/* Add your hotkey settings controls here */}
  </View>
);

const ThemeSettings = () => (
  <View>
    <Text className="text-2xl font-bold text-white mb-5">Theme Settings</Text>
    {/* Add your theme settings controls here */}
  </View>
);

const PluginSettings = () => (
  <View>
    <Text className="text-2xl font-bold text-white mb-5">Plugin Settings</Text>
    {/* Add your plugin settings controls here */}
  </View>
);

const LibrarySettings = () => (
  <View>
    <Text className="text-2xl font-bold text-white mb-5">Library Settings</Text>
    {/* Add library path, preview settings, etc. */}
  </View>
);
