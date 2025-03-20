import { VibrancyView } from '@fluentui-react-native/vibrancy-view';
import { use$ } from '@legendapp/state/react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { state$ } from '../State';
import type { Plugin } from './PluginTypes';

/**
 * Component that shows the name and created date of the currently selected photo
 */
function PhotoInfo() {
  const selectedPhoto = use$(state$.selectedPhoto);

  if (!selectedPhoto) {
    return null;
  }

  // Format the creation date if available
  let creationDate = 'Date unknown';

  if (selectedPhoto.mtime) {
    try {
      const date = new Date(selectedPhoto.mtime);
      creationDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
    }
  }

  return (
    <View className="absolute top-0 left-0 right-0 flex items-center pt-2">
      <VibrancyView
        blendingMode="withinWindow"
        state="active"
        material="fullScreenUI"
        style={styles.vibrancyView}
      >
        <View className="px-4 py-1 rounded-md flex-row items-center gap-x-4">
          <Text className="text-white font-medium text-sm text-center">{selectedPhoto.name}</Text>
          <Text className="text-white/80 text-xs text-center">{creationDate}</Text>
        </View>
      </VibrancyView>
    </View>
  );
}

// Export plugin configuration
export const photoInfoPlugin: Plugin = {
  id: 'photo-info',
  name: 'Photo Info',
  description: 'Displays the name and created date of the currently selected photo',
  enabled: true,
  childOf: 'photoFullscreen',
  component: PhotoInfo,
};

const styles = StyleSheet.create({
  vibrancyView: {
    flex: 1,
    borderRadius: 8,
  },
});
