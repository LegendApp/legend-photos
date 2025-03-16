import { use$ } from '@legendapp/state/react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { state$ } from './State';

export const SecondaryWindow = () => {
  const selectedFolder = use$(state$.selectedFolder);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New window</Text>
      <Text style={styles.text}>{selectedFolder}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default SecondaryWindow;
