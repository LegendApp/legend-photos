import { createJSONManager } from '@/utils/JSONManager';
import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { observer, use$, useObservable } from '@legendapp/state/react';
import { vars } from 'nativewind';
import * as React from 'react';
import { type ReactNode, createContext, useContext } from 'react';
import { View } from 'react-native';
import { colors } from './colors';

// Define theme types
type ThemeType = 'light' | 'dark';
type ThemeContextType = {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resetTheme: () => void;
};

interface ThemeSettings {
  currentTheme: ThemeType;
  customColors: {
    light: typeof colors.light;
    dark: typeof colors.dark;
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Create a global observable for theme state
export const themeState$ = createJSONManager<ThemeSettings>({
  basePath: `${DocumentDirectoryPath}/.legendphotos/`,
  filename: 'theme.json',
  initialValue: {
    currentTheme: 'dark' as ThemeType,
    customColors: clone(colors),
  },
  saveDefaultToFile: true,
});

// Create theme variables for each theme
const getThemes = (theme$: typeof themeState$) => {
  const { light, dark } = use$(theme$.customColors);
  return {
    light: vars({
      '--background-primary': light.background.primary,
      '--background-secondary': light.background.secondary,
      '--background-tertiary': light.background.tertiary,
      '--text-primary': light.text.primary,
      '--text-secondary': light.text.secondary,
      '--text-tertiary': light.text.tertiary,
      '--accent-primary': light.accent.primary,
      '--accent-secondary': light.accent.secondary,
      '--border': light.border,
    }),
    dark: vars({
      '--background-primary': dark.background.primary,
      '--background-secondary': dark.background.secondary,
      '--background-tertiary': dark.background.tertiary,
      '--text-primary': dark.text.primary,
      '--text-secondary': dark.text.secondary,
      '--text-tertiary': dark.text.tertiary,
      '--accent-primary': dark.accent.primary,
      '--accent-secondary': dark.accent.secondary,
      '--border': dark.border,
    }),
  };
};

// Create context for theme
const ThemeContext = createContext<ThemeContextType>(undefined as any);

// Theme provider component
export const ThemeProvider = observer(({ children }: { children: ReactNode }) => {
  const theme$ = useObservable(themeState$);

  const setTheme = (theme: ThemeType) => {
    theme$.currentTheme.set(theme);
  };

  const resetTheme = () => {
    theme$.customColors.set(clone(colors));
  };

  // Context value
  const contextValue: ThemeContextType = {
    currentTheme: theme$.currentTheme.get(),
    setTheme,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <View className="flex-1" style={getThemes(theme$)[theme$.currentTheme.get()]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
});

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
