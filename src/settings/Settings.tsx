import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { GeneralSettings } from './GeneralSettings';
import { HotkeySettings } from './HotkeySettings';
import { LibrarySettings } from './LibrarySettings';
import { PluginSettings } from './PluginSettings';
import { ThemeSettings } from './ThemeSettings';

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
