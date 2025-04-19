import { observable } from '@legendapp/state';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { observer, useObservable } from '@legendapp/state/react';
import { vars } from 'nativewind';
import * as React from 'react';
import { type ReactNode, createContext, useContext } from 'react';
import { View } from 'react-native';
import { colors } from './colors';

// Enable reactive state tracking
enableReactTracking({
  auto: true,
});

// Define theme types
type ThemeType = 'light' | 'dark';
type ThemeContextType = {
  currentTheme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
};

// Create a global observable for theme state
export const themeState$ = observable({
  currentTheme: 'dark' as ThemeType,
  customColors: {
    light: { ...colors.light },
    dark: { ...colors.dark },
  },
});

// Create theme variables for each theme
const getThemes = (theme$: typeof themeState$) => ({
  light: vars({
    '--background-primary': theme$.customColors.light.background.primary.get(),
    '--background-secondary': theme$.customColors.light.background.secondary.get(),
    '--background-tertiary': theme$.customColors.light.background.tertiary.get(),
    '--text-primary': theme$.customColors.light.text.primary.get(),
    '--text-secondary': theme$.customColors.light.text.secondary.get(),
    '--text-tertiary': theme$.customColors.light.text.tertiary.get(),
    '--accent-primary': theme$.customColors.light.accent.primary.get(),
    '--accent-secondary': theme$.customColors.light.accent.secondary.get(),
    '--border': theme$.customColors.light.border.get(),
  }),
  dark: vars({
    '--background-primary': theme$.customColors.dark.background.primary.get(),
    '--background-secondary': theme$.customColors.dark.background.secondary.get(),
    '--background-tertiary': theme$.customColors.dark.background.tertiary.get(),
    '--text-primary': theme$.customColors.dark.text.primary.get(),
    '--text-secondary': theme$.customColors.dark.text.secondary.get(),
    '--text-tertiary': theme$.customColors.dark.text.tertiary.get(),
    '--accent-primary': theme$.customColors.dark.accent.primary.get(),
    '--accent-secondary': theme$.customColors.dark.accent.secondary.get(),
    '--border': theme$.customColors.dark.border.get(),
  }),
});

// Create context for theme
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

// Theme provider component
export const ThemeProvider = observer(({ children }: { children: ReactNode }) => {
  const theme$ = useObservable(themeState$);

  // Theme switcher methods
  const toggleTheme = () => {
    theme$.currentTheme.set(theme$.currentTheme.get() === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (theme: ThemeType) => {
    theme$.currentTheme.set(theme);
  };

  // Context value
  const contextValue: ThemeContextType = {
    currentTheme: theme$.currentTheme.get(),
    toggleTheme,
    setTheme,
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
