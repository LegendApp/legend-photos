import { Img } from '@/components/Img';
import type { PhotoInfo } from '@/systems/FileManager';
import { state$ } from '@/systems/State';
import { Theme } from '@/systems/Theme';
import { windowDimensions$ } from '@legend-kit/react-native/windowDimensions';
import { LegendList, type LegendListRef } from '@legendapp/list';
import { observer, useObserveEffect, useSelector } from '@legendapp/state/react';
import { remapProps } from 'nativewind';
import React, { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

// Set up NativeWind for LegendList
remapProps(LegendList, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

interface FilmstripItemProps {
  item: PhotoInfo;
  index: number;
  size: number;
}

const FilmstripItem = observer(({ item, index, size }: FilmstripItemProps) => {
  const isSelected = useSelector(() => state$.selectedPhotoIndex.get() === index);

  const handlePress = () => {
    state$.selectedPhotoIndex.set(index);
  };

  return (
    <Pressable onPress={handlePress} className="mx-1 py-2 rounded-md overflow-hidden">
      <View
        className="rounded-md overflow-hidden"
        style={[isSelected ? styles.selectedItem : null, { width: size, height: size }]}
      >
        <Img photo={item} className="w-full h-full" resizeMode={'cover'} native={false} />
      </View>
    </Pressable>
  );
});

export const Filmstrip = observer(() => {
  const photos = useSelector(state$.photos);
  const listRef = useRef<LegendListRef>(null);
  const thumbnailSize = 80;
  const isFirstRender = useRef(true);

  useObserveEffect(() => {
    const index = state$.selectedPhotoIndex.get();
    if (index >= 0 && listRef.current) {
      listRef.current.scrollToIndex({
        index: index,
        animated: !isFirstRender.current,
        viewOffset: (windowDimensions$.width.get() - thumbnailSize) / 2,
        // viewPosition: 0.5, // Center the item
      });
      isFirstRender.current = false;
    }
  });

  const renderItem = useCallback(({ item, index }: { item: PhotoInfo; index: number }) => {
    return <FilmstripItem item={item} index={index} size={thumbnailSize} />;
  }, []);

  const keyExtractor = useCallback((item: PhotoInfo) => item.id, []);

  return (
    <View className="px-2" style={{ height: thumbnailSize + 16 }}>
      <LegendList
        ref={listRef}
        data={photos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="py-2 px-2"
        estimatedItemSize={88} // 64px for item + 8px for margin
      />
    </View>
  );
});

const styles = StyleSheet.create({
  selectedItem: {
    borderWidth: 2,
    borderColor: Theme.colors.filmstrip.border,
  },
});
