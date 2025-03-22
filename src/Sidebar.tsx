import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import React from 'react';
import { Animated, ScrollView, Text, View, useColorScheme } from 'react-native';
import { SidebarButton } from './SidebarButton';

interface SidebarItem {
  id: string;
  label: string;
  indentLevel?: number; // Optional indentation level for hierarchy
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

interface SidebarCommonProps {
  items: SidebarItem[] | SidebarGroup[];
  selectedItemId: string;
  onSelectItem: (id: string) => void;
  width?: number | Animated.Value;
  showGroups?: boolean;
}

export function Sidebar({
  items,
  selectedItemId,
  onSelectItem,
  width = 140,
  showGroups = false,
}: SidebarCommonProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const isGrouped = (item: any): item is SidebarGroup => {
    return 'items' in item && 'title' in item;
  };

  const renderItems = () => {
    if (showGroups && items.some(isGrouped)) {
      return (items as SidebarGroup[]).map((group) => (
        <View key={group.title} className="mb-2">
          <Text
            className={`px-3 py-1 text-xs font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {group.title}
          </Text>
          {group.items.map((item) => (
            <SidebarButton
              key={item.id}
              label={item.label}
              isSelected={selectedItemId === item.id}
              isDarkMode={isDarkMode}
              onPress={() => onSelectItem(item.id)}
              indentLevel={item.indentLevel || 0}
            />
          ))}
        </View>
      ));
    }

    return (items as SidebarItem[]).map((item) => (
      <SidebarButton
        key={item.id}
        label={item.label}
        isSelected={selectedItemId === item.id}
        isDarkMode={isDarkMode}
        onPress={() => onSelectItem(item.id)}
        indentLevel={item.indentLevel || 0}
      />
    ));
  };

  return (
    <Animated.View
      className="h-full border-r border-r-[#333]"
      style={{
        width,
      }}
    >
      <VibrancyView blendingMode="behindWindow" material="sidebar" style={{ flex: 1 }}>
        <View className="flex-1 py-2 pt-8">
          <ScrollView>{renderItems()}</ScrollView>
        </View>
      </VibrancyView>
    </Animated.View>
  );
}
