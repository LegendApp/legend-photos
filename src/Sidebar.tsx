import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import React from 'react';
import { Animated, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
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
  className?: string;
}

export function Sidebar({
  items,
  selectedItemId,
  onSelectItem,
  width = 140,
  showGroups = false,
  className,
}: SidebarCommonProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const isGrouped = (item: SidebarItem | SidebarGroup): item is SidebarGroup => {
    return 'items' in item && 'title' in item;
  };

  const renderItems = () => {
    if (showGroups && items.some(isGrouped)) {
      return (items as SidebarGroup[]).map((group) => (
        <View key={group.title} className="mb-6">
          <View className="mb-1">
            <Text
              className={`px-3 text-xs font-semibold tracking-wider ${
                isDarkMode ? 'text-zinc-500' : 'text-zinc-600'
              }`}
            >
              {group.title}
            </Text>
          </View>

          {group.items.map((item) => (
            <View key={item.id} className="relative">
              <SidebarButton
                key={item.id}
                label={item.label}
                isSelected={selectedItemId === item.id}
                isDarkMode={isDarkMode}
                onPress={() => onSelectItem(item.id)}
                indentLevel={item.indentLevel || 0}
              />
            </View>
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
      <VibrancyView blendingMode="behindWindow" material="sidebar" style={styles.vibrancy}>
        <View className={`flex-1 py-2 ${className}`}>
          <ScrollView showsVerticalScrollIndicator={false}>{renderItems()}</ScrollView>
        </View>
      </VibrancyView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  vibrancy: {
    flex: 1,
  },
});
