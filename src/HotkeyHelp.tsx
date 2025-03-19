import { LegendList } from '@legendapp/list';
import { useObservable, useSelector } from '@legendapp/state/react';
import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { type HotkeyInfo, type KeyInfo, hotkeyRegistry$, useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { SFSymbol } from './components/SFSymbol';

const sorter = (a: KeyInfo, b: KeyInfo) => {
  return a.name.localeCompare(b.name);
};

export function HotkeyHelp() {
  const dims = useWindowDimensions();
  const hotkeyHelpVisible$ = useObservable(false);
  const isVisible = useSelector(hotkeyHelpVisible$);
  const hotkeys = useSelector(() => Object.values(hotkeyRegistry$.get()).sort(sorter));

  const toggle = () => hotkeyHelpVisible$.toggle();

  // Toggle visibility when / is pressed
  useOnHotkeys({
    [KeyCodes.KEY_SLASH]: {
      action: toggle,
      name: 'Help',
      description: 'Toggle shortcut help',
      keyText: '/',
    },
  });

  return isVisible ? (
    <View className="absolute bottom-0 right-0 py-2 pr-2" style={{ maxHeight: dims.height }}>
      <View className="flex-1 overflow-hidden bg-zinc-800/85 rounded-lg py-4 w-64 shadow-lg border border-zinc-700">
        <View className="flex-row justify-between items-center mb-4 px-4">
          <Text className="text-white text-lg font-bold">Hotkeys</Text>
          {/* TODO: Make this an icon button */}
          <Pressable onPress={toggle}>
            <SFSymbol name="xmark" size={18} color="#fff" />
          </Pressable>
        </View>
        <LegendList
          className="max-h-[800px]"
          data={hotkeys}
          renderItem={HotkeyHelpItem}
          estimatedItemSize={36}
          contentContainerStyle={styles.list}
          //   waitForInitialLayout
        />
      </View>
    </View>
  ) : (
    // TODO: Make this an icon button
    <Pressable
      className="absolute bottom-3 right-3 bg-zinc-800 rounded-full size-9 border border-white/10"
      onPress={toggle}
    >
      <SFSymbol name="questionmark" size={20} color="#ddd" style={styles.questionSymbol} />
    </Pressable>
  );
}

const HotkeyHelpItem = ({ item }: { item: HotkeyInfo }) => {
  return (
    <View className="h-9 justify-center">
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-medium">{item.name}</Text>
        <View className="bg-zinc-700 px-3 py-1 rounded ml-8">
          <Text className="text-white font-mono text-xs">{item.keyText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionSymbol: {
    position: 'absolute',
    top: 3,
    left: 7,
  },
  list: {
    paddingHorizontal: 16,
  },
});
