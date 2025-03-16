import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { type WindowOptions, useWindowManager } from '../WindowManager';

export const WindowControls = () => {
  const windowManager = useWindowManager();
  const [windowTitle, setWindowTitle] = useState('Custom Window');
  const [windowWidth, setWindowWidth] = useState('600');
  const [windowHeight, setWindowHeight] = useState('400');

  useEffect(() => {
    const subscription = windowManager.onWindowClosed(() => {
      console.log('Window was closed');
    });

    return () => {
      subscription.remove();
    };
  }, [windowManager]);

  const handleOpenWindow = async () => {
    try {
      const options: WindowOptions = {
        title: windowTitle,
        width: Number(windowWidth),
        height: Number(windowHeight),
      };

      const result = await windowManager.openWindow(options);
      console.log('Window opened:', result);
    } catch (error) {
      console.error('Failed to open window:', error);
    }
  };

  const handleCloseWindow = async () => {
    try {
      const result = await windowManager.closeWindow();
      console.log('Window closed:', result);
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={windowTitle}
            onChangeText={setWindowTitle}
            placeholder="Window Title"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Width:</Text>
          <TextInput
            style={styles.input}
            value={windowWidth}
            onChangeText={setWindowWidth}
            keyboardType="numeric"
            placeholder="Width"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Height:</Text>
          <TextInput
            style={styles.input}
            value={windowHeight}
            onChangeText={setWindowHeight}
            keyboardType="numeric"
            placeholder="Height"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Open Window" onPress={handleOpenWindow} />
        <View style={styles.separator} />
        <Button title="Close Window" onPress={handleCloseWindow} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  optionsContainer: {
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    width: 60,
    fontSize: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 5,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  separator: {
    width: 10,
  },
});

export default WindowControls;
