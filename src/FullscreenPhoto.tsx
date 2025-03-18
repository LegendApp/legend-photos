import { use$ } from '@legendapp/state/react';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Image, Pressable, View } from 'react-native';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { state$ } from './State';
import { PluginRenderer } from './plugins';

const SpringOpen = {
  bounciness: 3,
  speed: 24,
};

const SpringClose = {
  bounciness: 2,
  speed: 24,
};

export const FullscreenPhoto = () => {
  // Use the global observable
  const fullscreenData = use$(state$.fullscreenPhoto);

  // Animation values
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  const animatedPositionX = React.useRef(new Animated.Value(0)).current;
  const animatedPositionY = React.useRef(new Animated.Value(0)).current;
  const animatedRight = React.useRef(new Animated.Value(0)).current;
  const animatedBottom = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fullscreenData) {
      // Set initial values
      const dimensions = Dimensions.get('window');
      animatedOpacity.setValue(0);
      animatedPositionX.setValue(fullscreenData.initialPosition.x);
      animatedPositionY.setValue(fullscreenData.initialPosition.y);
      const right =
        dimensions.width - fullscreenData.initialPosition.width - fullscreenData.initialPosition.x;
      const bottom =
        dimensions.height -
        fullscreenData.initialPosition.height -
        fullscreenData.initialPosition.y;
      animatedRight.setValue(right);
      animatedBottom.setValue(bottom);

      console.log('right', right, bottom);

      // Hide window controls (stoplight buttons) if on macOS
      setTimeout(() => {
        state$.isPhotoFullscreenCoveringControls.set(true);
      }, 150);

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
          Animated.spring(animatedRight, {
            toValue: 0,
            useNativeDriver: false,
            ...SpringOpen,
          }),
          Animated.spring(animatedBottom, {
            toValue: 0,
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
    animatedRight,
    animatedBottom,
  ]);

  const closeFullscreen = () => {
    const fullscreenPhoto = state$.fullscreenPhoto.get();
    if (!fullscreenPhoto) {
      return;
    }

    const dimensions = Dimensions.get('window');

    const right =
      dimensions.width - fullscreenPhoto.initialPosition.width - fullscreenPhoto.initialPosition.x;
    const bottom =
      dimensions.height -
      fullscreenPhoto.initialPosition.height -
      fullscreenPhoto.initialPosition.y;

    state$.isPhotoFullscreenCoveringControls.set(false);

    // Animate back to original position and size
    Animated.parallel([
      Animated.spring(animatedPositionX, {
        toValue: fullscreenPhoto.initialPosition.x,
        useNativeDriver: false,
        ...SpringClose,
      }),
      Animated.spring(animatedPositionY, {
        toValue: fullscreenPhoto.initialPosition.y,
        useNativeDriver: false,
        ...SpringClose,
      }),
      Animated.spring(animatedRight, {
        toValue: right,
        useNativeDriver: false,
        ...SpringClose,
      }),
      Animated.spring(animatedBottom, {
        toValue: bottom,
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
    [KeyCodes.KEY_ESCAPE]: {
      action: closeFullscreen,
      name: 'Close Photo',
      description: 'Close fullscreen photo view',
      keyText: 'Escape',
    },
    // TODO: How to capture this and not let it run in Photo?
    [KeyCodes.KEY_RETURN]: {
      action: closeFullscreen,
      name: 'Close Photo',
      description: 'Close fullscreen photo view',
      // Note: no keyText because we don't want it to show in hotkeys
    },
  });

  // If no fullscreen data, don't render anything
  if (!fullscreenData) {
    return null;
  }

  return (
    <Animated.View
      className="bg-black z-[100] absolute"
      style={{
        left: animatedPositionX,
        top: animatedPositionY,
        right: animatedRight,
        bottom: animatedBottom,
        opacity: animatedOpacity,
      }}
    >
      <Pressable className="flex-1" onPress={closeFullscreen}>
        <Image source={{ uri: fullscreenData.uri }} className="flex-1" resizeMode="contain" />
      </Pressable>

      {/* Add plugin renderer for photoFullscreen location */}
      <View className="absolute bottom-0 left-0 right-0">
        <PluginRenderer location="photoFullscreen" className="p-4" />
      </View>
    </Animated.View>
  );
};
