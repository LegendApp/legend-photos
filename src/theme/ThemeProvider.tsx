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
});

// Create theme variables for each theme
const themes = {
  light: vars({
    '--background-primary': colors.light.background.primary,
    '--background-secondary': colors.light.background.secondary,
    '--background-tertiary': colors.light.background.tertiary,
    '--text-primary': colors.light.text.primary,
    '--text-secondary': colors.light.text.secondary,
    '--text-tertiary': colors.light.text.tertiary,
    '--accent-primary': colors.light.accent.primary,
    '--accent-secondary': colors.light.accent.secondary,
    '--border': colors.light.border,
  }),
  dark: vars({
    '--background-primary': colors.dark.background.primary,
    '--background-secondary': colors.dark.background.secondary,
    '--background-tertiary': colors.dark.background.tertiary,
    '--text-primary': colors.dark.text.primary,
    '--text-secondary': colors.dark.text.secondary,
    '--text-tertiary': colors.dark.text.tertiary,
    '--accent-primary': colors.dark.accent.primary,
    '--accent-secondary': colors.dark.accent.secondary,
    '--border': colors.dark.border,
  }),
};

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
      <View className="flex-1" style={themes[theme$.currentTheme.get()]}>
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
