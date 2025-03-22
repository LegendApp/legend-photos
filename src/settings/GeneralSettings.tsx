import { useObservable } from '@legendapp/state/react';
import React from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { AutoUpdaterModule } from '../native/AutoUpdater';
import { settings$ } from './SettingsFile';

export const GeneralSettings = () => {
  const settings = useObservable(settings$);
  const autoUpdateEnabled = useObservable(settings.general.autoUpdate.enabled);
  const autoUpdateInterval = useObservable(settings.general.autoUpdate.checkInterval);

  const handleIntervalChange = (text: string) => {
    const value = Number.parseInt(text, 10);
    if (!Number.isNaN(value) && value > 0) {
      autoUpdateInterval.set(value);
    }
  };

  return (
    <View>
      <Text className="text-2xl font-bold text-white mb-5">General Settings</Text>

      {/* Auto-Update Settings */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-white mb-2">Auto Update</Text>

        <View className="flex-row items-center mb-2">
          <Text className="text-white flex-1">Check for updates automatically</Text>
          <Switch
            value={autoUpdateEnabled.get()}
            onValueChange={(value) => autoUpdateEnabled.set(value)}
          />
        </View>

        {autoUpdateEnabled.get() && (
          <View className="flex-row items-center mb-2">
            <Text className="text-white flex-1">Check interval (hours)</Text>
            <TextInput
              className="bg-gray-700 text-white px-2 py-1 rounded w-20 text-right"
              value={autoUpdateInterval.get().toString()}
              onChangeText={handleIntervalChange}
              keyboardType="number-pad"
            />
          </View>
        )}

        <View className="mt-2">
          <Text
            className="text-blue-400 underline"
            onPress={() => AutoUpdaterModule.checkForUpdates()}
          >
            Check for updates now
          </Text>
        </View>
      </View>

      {/* Other general settings would go here */}
    </View>
  );
};
