import { use$ } from '@legendapp/state/react';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Image, Pressable, StatusBar, StyleSheet } from 'react-native';
import { fullscreenPhoto$, hideFullscreenPhoto } from './State';

export const FullscreenPhoto = () => {
  // Use the global observable
  const fullscreenData = use$(fullscreenPhoto$);
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

      // Animate to fullscreen
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          delay: 100,
          toValue: 1,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.timing(animatedPositionX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animatedPositionY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animatedWidth, {
            toValue: dimensions.width,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animatedHeight, {
            toValue: dimensions.height,
            duration: 300,
            useNativeDriver: false,
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
    if (!fullscreenData) return;

    // Animate back to original position and size
    Animated.parallel([
      Animated.timing(animatedPositionX, {
        toValue: fullscreenData.initialPosition.x,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedPositionY, {
        toValue: fullscreenData.initialPosition.y,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWidth, {
        toValue: fullscreenData.initialPosition.width,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedHeight, {
        toValue: fullscreenData.initialPosition.height,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Show status bar again
      StatusBar.setHidden(false);
      // Clear the fullscreen data
      hideFullscreenPhoto();
    });
  };

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
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 9999,
    elevation: 10,
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
