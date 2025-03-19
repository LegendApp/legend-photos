import { use$, useObservable } from '@legendapp/state/react';
import React, { useCallback, useRef } from 'react';
import { Animated, Dimensions, Pressable, View } from 'react-native';
import type { PhotoInfo } from './FileManager';
import { Img } from './Img';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { fullscreenView, state$ } from './State';
import { PluginRenderer } from './plugins';
import { useOnDoubleClick } from './useOnDoubleClick';
import { getPhotoUri } from './utils/photoHelpers';

const SpringOpen = {
  bounciness: 3,
  speed: 24,
};

const SpringClose = {
  bounciness: 2,
  speed: 24,
};

interface AnimatedPositions {
  left: Animated.Value;
  top: Animated.Value;
  right: Animated.Value;
  bottom: Animated.Value;
}

interface Position {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function springPositions(
  animatedPositions: AnimatedPositions,
  to: Position,
  transition: Pick<Animated.SpringAnimationConfig, 'bounciness' | 'speed'>,
  from?: Position
) {
  const rest = {
    useNativeDriver: false,
    ...transition,
  };

  if (from) {
    animatedPositions.left.setValue(from.left);
    animatedPositions.top.setValue(from.top);
    animatedPositions.right.setValue(from.right);
    animatedPositions.bottom.setValue(from.bottom);
  }

  return Animated.parallel([
    Animated.spring(animatedPositions.left, {
      toValue: to.left,
      ...rest,
    }),
    Animated.spring(animatedPositions.top, {
      toValue: to.top,
      ...rest,
    }),
    Animated.spring(animatedPositions.right, {
      toValue: to.right,
      ...rest,
    }),
    Animated.spring(animatedPositions.bottom, {
      toValue: to.bottom,
      ...rest,
    }),
  ]);
}

export const FullscreenPhoto = () => {
  // Use the global observable
  const fullscreenData = use$(state$.fullscreenPhoto);
  const selectedPhoto = use$(state$.selectedPhoto) as PhotoInfo;
  const photoUri = getPhotoUri(selectedPhoto);
  const isOpen$ = useObservable(false);

  // Animation values
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  const refAnimatedPositions = useRef<AnimatedPositions>();
  if (!refAnimatedPositions.current) {
    refAnimatedPositions.current = {
      left: new Animated.Value(0),
      top: new Animated.Value(0),
      right: new Animated.Value(0),
      bottom: new Animated.Value(0),
    };
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onLoad = useCallback(() => {
    if (!isOpen$.get()) {
      const fullscreenPhoto = state$.fullscreenPhoto.get();
      if (!fullscreenPhoto) {
        return;
      }

      isOpen$.set(true);

      // Set initial values
      const dimensions = Dimensions.get('window');
      animatedOpacity.setValue(0);
      const left = fullscreenPhoto.initialPosition.x;
      const top = fullscreenPhoto.initialPosition.y;
      const right =
        dimensions.width -
        fullscreenPhoto.initialPosition.width -
        fullscreenPhoto.initialPosition.x;
      const bottom =
        dimensions.height -
        fullscreenPhoto.initialPosition.height -
        fullscreenPhoto.initialPosition.y;

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
        springPositions(
          refAnimatedPositions.current!,
          { left: 0, top: 0, right: 0, bottom: 0 },
          SpringOpen,
          { left, top, right, bottom }
        ),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeFullscreen = () => {
    const fullscreenPhoto = state$.fullscreenPhoto.get();
    if (!fullscreenPhoto) {
      return;
    }

    const dimensions = Dimensions.get('window');

    const view = fullscreenView.current;

    view!.measureInWindow((x, y, width, height) => {
      const left = x;
      const top = y;
      const right = dimensions.width - width - x;
      const bottom = dimensions.height - height - y;

      state$.isPhotoFullscreenCoveringControls.set(false);

      // Animate back to original position and size
      springPositions(
        refAnimatedPositions.current!,
        {
          left,
          top,
          right,
          bottom,
        },
        SpringClose
      ).start();

      Animated.timing(animatedOpacity, {
        delay: 300,
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start(() => {
        fullscreenView.current = null;
        state$.fullscreenPhoto.set(null);
        isOpen$.set(false);
      });
    });
  };

  const onPress = useOnDoubleClick({
    onDoubleClick: closeFullscreen,
  });

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
      style={{ ...refAnimatedPositions.current, opacity: animatedOpacity }}
    >
      <Pressable className="flex-1" onPress={onPress}>
        <Img uri={photoUri!} className="flex-1" resizeMode="contain" onLoad={onLoad} />
      </Pressable>

      {/* Add plugin renderer for photoFullscreen location */}
      <View className="absolute bottom-0 left-0 right-0">
        <PluginRenderer location="photoFullscreen" className="p-4" />
      </View>
    </Animated.View>
  );
};
