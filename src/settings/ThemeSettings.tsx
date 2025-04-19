import { ColorPicker } from '@/components/ColorPicker';
import { SegmentedControl } from '@/native-modules/SegmentedControl';
import { themeState$, useTheme } from '@/theme/ThemeProvider';
import { observer } from '@legendapp/state/react';
import React from 'react';
import { Text, View } from 'react-native';

type ThemeType = 'light' | 'dark';

export const ThemeSettings = observer(() => {
  const { currentTheme, setTheme } = useTheme();

  const handleThemeChange = (value: ThemeType) => {
    setTheme(value);
  };

  // Simplified direct access to theme properties
  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-text-primary mb-5">Theme Settings</Text>

      <View className="mb-6">
        <Text className="text-text-primary mb-2">Theme</Text>
        <SegmentedControl
          options={['light', 'dark']}
          selectedValue={currentTheme}
          onValueChange={handleThemeChange}
        />
      </View>

      <Text className="text-xl font-bold text-text-primary mb-3">Background Colors</Text>
      <ColorPicker
        label="Primary"
        color={themeState$.customColors[currentTheme as ThemeType].background.primary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].background.primary.set(color)
        }
      />
      <ColorPicker
        label="Secondary"
        color={themeState$.customColors[currentTheme as ThemeType].background.secondary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].background.secondary.set(color)
        }
      />
      <ColorPicker
        label="Tertiary"
        color={themeState$.customColors[currentTheme as ThemeType].background.tertiary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].background.tertiary.set(color)
        }
      />

      <Text className="text-xl font-bold text-text-primary mb-3 mt-6">Text Colors</Text>
      <ColorPicker
        label="Primary"
        color={themeState$.customColors[currentTheme as ThemeType].text.primary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].text.primary.set(color)
        }
      />
      <ColorPicker
        label="Secondary"
        color={themeState$.customColors[currentTheme as ThemeType].text.secondary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].text.secondary.set(color)
        }
      />
      <ColorPicker
        label="Tertiary"
        color={themeState$.customColors[currentTheme as ThemeType].text.tertiary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].text.tertiary.set(color)
        }
      />

      <Text className="text-xl font-bold text-text-primary mb-3 mt-6">Accent Colors</Text>
      <ColorPicker
        label="Primary"
        color={themeState$.customColors[currentTheme as ThemeType].accent.primary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].accent.primary.set(color)
        }
      />
      <ColorPicker
        label="Secondary"
        color={themeState$.customColors[currentTheme as ThemeType].accent.secondary.get()}
        onColorChange={(color) =>
          themeState$.customColors[currentTheme as ThemeType].accent.secondary.set(color)
        }
      />

      <View className="mt-6">
        <ColorPicker
          label="Border"
          color={themeState$.customColors[currentTheme as ThemeType].border.get()}
          onColorChange={(color) =>
            themeState$.customColors[currentTheme as ThemeType].border.set(color)
          }
        />
      </View>
    </View>
  );
});
