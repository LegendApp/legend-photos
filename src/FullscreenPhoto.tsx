import { use$ } from '@legendapp/state/react';
import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  NativeModules,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { state$ } from './State';

const SpringOpen = {
  bounciness: 3,
  speed: 24,
};

const SpringClose = {
  bounciness: 2,
  speed: 24,
};

// Get the native module if available
const WindowControls = Platform.OS === 'macos' ? NativeModules.WindowControls : null;

export const FullscreenPhoto = () => {
  // Use the global observable
  const fullscreenData = use$(state$.fullscreenPhoto);
  const dimensions = Dimensions.get('window');

  // Animation values
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  const animatedPositionX = React.useRef(new Animated.Value(0)).current;
  const animatedPositionY = React.useRef(new Animated.Value(0)).current;
  const animatedWidth = React.useRef(new Animated.Value(0)).current;
  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fullscreenData) {
      // Set initial values
      animatedOpacity.setValue(0);
      animatedPositionX.setValue(fullscreenData.initialPosition.x);
      animatedPositionY.setValue(fullscreenData.initialPosition.y);
      animatedWidth.setValue(fullscreenData.initialPosition.width);
      animatedHeight.setValue(fullscreenData.initialPosition.height);

      // Hide status bar
      StatusBar.setHidden(true);

      // Hide window controls (stoplight buttons) if on macOS
      if (WindowControls?.hideWindowControls) {
        setTimeout(() => {
          WindowControls.hideWindowControls();
        }, 150);
      }

      // Animate to fullscreen
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          delay: 30,
          toValue: 1,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.spring(animatedPositionX, {
            toValue: 0,
            useNativeDriver: false,
            ...SpringOpen,
          }),
          Animated.spring(animatedPositionY, {
            toValue: 0,
            useNativeDriver: false,
            ...SpringOpen,
          }),
          Animated.spring(animatedWidth, {
            toValue: dimensions.width,
            useNativeDriver: false,
            ...SpringOpen,
          }),
          Animated.spring(animatedHeight, {
            toValue: dimensions.height,
            useNativeDriver: false,
            ...SpringOpen,
          }),
        ]),
      ]).start();
    }
  }, [
    fullscreenData,
    animatedOpacity,
    animatedPositionX,
    animatedPositionY,
    animatedWidth,
    animatedHeight,
    dimensions.width,
    dimensions.height,
  ]);

  const closeFullscreen = () => {
    if (!fullscreenData) {
      return;
    }

    // Show window controls (stoplight buttons) if on macOS
    if (WindowControls?.showWindowControls) {
      WindowControls.showWindowControls();
    }

    // Animate back to original position and size
    Animated.parallel([
      Animated.spring(animatedPositionX, {
        toValue: fullscreenData.initialPosition.x,
        useNativeDriver: false,
        ...SpringClose,
      }),
      Animated.spring(animatedPositionY, {
        toValue: fullscreenData.initialPosition.y,
        useNativeDriver: false,
        ...SpringClose,
      }),
      Animated.spring(animatedWidth, {
        toValue: fullscreenData.initialPosition.width,
        useNativeDriver: false,
        ...SpringClose,
      }),
      Animated.spring(animatedHeight, {
        toValue: fullscreenData.initialPosition.height,
        useNativeDriver: false,
        ...SpringClose,
      }),
    ]).start();

    Animated.timing(animatedOpacity, {
      delay: 300,
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      state$.fullscreenPhoto.set(null);
    });
  };

  useOnHotkeys({
    [KeyCodes.KEY_ESCAPE]: () => {
      closeFullscreen();
    },
  });

  // If no fullscreen data, don't render anything
  if (!fullscreenData) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animatedOpacity,
          left: animatedPositionX,
          top: animatedPositionY,
          width: animatedWidth,
          height: animatedHeight,
        },
      ]}
    >
      <Pressable style={styles.pressable} onPress={closeFullscreen}>
        <Image source={{ uri: fullscreenData.uri }} style={styles.image} resizeMode="contain" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 9999,
    // elevation: 10,
    borderRadius: 8,
  },
  pressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
