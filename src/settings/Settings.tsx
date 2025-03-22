import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Sidebar } from '@/components/Sidebar';
import { GeneralSettings } from '@/settings/GeneralSettings';
import { HotkeySettings } from '@/settings/HotkeySettings';
import { LibrarySettings } from '@/settings/LibrarySettings';
import { PluginSettings } from '@/settings/PluginSettings';
import { ThemeSettings } from '@/settings/ThemeSettings';

// Define the categories for settings
const SETTING_CATEGORIES = [
  //   { id: 'general', label: 'General' },
  //   { id: 'hotkeys', label: 'Hotkeys' },
  //   { id: 'themes', label: 'Themes' },
  //   { id: 'plugins', label: 'Plugins' },
  { id: 'library', label: 'Library' },
  // Add more categories as needed
];

export const Settings = () => {
  const [selectedCategory, setSelectedCategory] = useState('library');

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
          selectedItemId={selectedCategory}
          onSelectItem={setSelectedCategory}
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
