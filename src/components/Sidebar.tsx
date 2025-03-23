import { SidebarButton } from '@/components/SidebarButton';
import type { SidebarGroupWithSource, SidebarItemWithSource } from '@/plugin-system/FileSources';
import type { SidebarItem } from '@/plugin-system/PluginTypes';
import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import React from 'react';
import { Animated, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';

interface SidebarCommonProps {
  items: SidebarItemWithSource[] | SidebarGroupWithSource[];
  selectedItemId: string;
  onSelectItem: (item: SidebarItemWithSource) => void;
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

  const isGrouped = (
    item: SidebarItemWithSource | SidebarGroupWithSource
  ): item is SidebarGroupWithSource => {
    return 'items' in item && 'title' in item;
  };

  const renderItems = () => {
    if (showGroups && items.some(isGrouped)) {
      return (items as SidebarGroupWithSource[]).map((group) => (
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
            <View key={item.path} className="relative">
              <SidebarButton
                key={item.path}
                text={item.text}
                isSelected={selectedItemId === item.path}
                isDarkMode={isDarkMode}
                onPress={() => onSelectItem(item)}
                indentLevel={item.depth || 0}
              />
            </View>
          ))}
        </View>
      ));
    }

    return (items as SidebarItem[]).map((item) => (
      <SidebarButton
        key={item.path}
        text={item.text}
        isSelected={selectedItemId === item.path}
        isDarkMode={isDarkMode}
        onPress={() => onSelectItem(item)}
        indentLevel={item.depth || 0}
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
