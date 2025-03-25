import { Sidebar } from '@/components/Sidebar';
import type { SidebarItem } from '@/plugin-system/PluginTypes';
import { GeneralSettings } from '@/settings/GeneralSettings';
import { HotkeySettings } from '@/settings/HotkeySettings';
import { LibrarySettings } from '@/settings/LibrarySettings';
import { PluginSettings } from '@/settings/PluginSettings';
import { ThemeSettings } from '@/settings/ThemeSettings';
import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

// Define the categories for settings
const SETTING_CATEGORIES: SidebarItem[] = [
  //   { id: 'general', label: 'General' },
  { path: 'hotkeys', text: 'Hotkeys', depth: 0 },
  //   { id: 'themes', label: 'Themes' },
  //   { id: 'plugins', label: 'Plugins' },
  { path: 'library', text: 'Library', depth: 0 },
  // Add more categories as needed
];

export const SettingsContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState('library');

  const isItemSelected = (item: SidebarItem) => {
    return item.path === selectedCategory;
  };

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
    <VibrancyView blendingMode="behindWindow" material="sidebar" style={styles.vibrancy}>
      <View className="flex flex-1 flex-row">
        <Sidebar
          items={SETTING_CATEGORIES}
          isItemSelected={isItemSelected}
          onSelectItem={(item) => setSelectedCategory(item.path)}
          width={140}
          showGroups={false}
        />
        <View className="flex-1 p-5 bg-[#1a1a1a]">{renderContent()}</View>
      </View>
    </VibrancyView>
  );
};

const styles = StyleSheet.create({
  vibrancy: {
    flex: 1,
  },
});
