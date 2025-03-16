import { use$ } from '@legendapp/state/react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { state$ } from './State';

export const Settings = () => {
  const selectedFolder = use$(state$.selectedFolder);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Text style={styles.text}>{selectedFolder}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
