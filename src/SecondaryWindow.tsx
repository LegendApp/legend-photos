import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const SecondaryWindow = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New window</Text>
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
  },
});

export default SecondaryWindow;
