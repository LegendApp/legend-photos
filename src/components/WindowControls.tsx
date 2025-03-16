import React, { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useWindowManager } from '../WindowManager';

export const WindowControls = () => {
  const windowManager = useWindowManager();

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
      const result = await windowManager.openWindow();
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
      <Button title="Open Window" onPress={handleOpenWindow} />
      <View style={styles.separator} />
      <Button title="Close Window" onPress={handleCloseWindow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
  },
  separator: {
    width: 10,
  },
});

export default WindowControls;
