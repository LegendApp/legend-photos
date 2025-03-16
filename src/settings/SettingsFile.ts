import { createJSONManager } from '../utils/JSONManager';

// Define the settings structure
export interface AppSettings {
  // General settings
  general: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    autoSave: boolean;
  };

  // Hotkey settings
  hotkeys: {
    [action: string]: string;
  };

  // Theme settings
  themes: {
    customThemes: Array<{
      name: string;
      colors: Record<string, string>;
    }>;
    activeTheme: string;
  };

  // Plugin settings
  plugins: {
    enabled: Record<string, boolean>;
    settings: Record<string, any>;
  };

  // Library settings
  library: {
    paths: string[];
    previewSize: 'small' | 'medium' | 'large';
    showFilenames: boolean;
    sortBy: 'name' | 'date' | 'size' | 'type';
    sortDirection: 'asc' | 'desc';
  };
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  general: {
    theme: 'system',
    language: 'en',
    autoSave: true,
  },
  hotkeys: {
    rate1: '1',
    rate2: '2',
    rate3: '3',
    rate4: '4',
    rate5: '5',
    flag: 'f',
    reject: 'x',
  },
  themes: {
    customThemes: [],
    activeTheme: 'default',
  },
  plugins: {
    enabled: {},
    settings: {},
  },
  library: {
    paths: [],
    previewSize: 'medium',
    showFilenames: true,
    sortBy: 'date',
    sortDirection: 'desc',
  },
};

// Create the settings manager
const settingsManager = createJSONManager<AppSettings>('settings.json', DEFAULT_SETTINGS);

// Export the settings observable and functions
export const settings$ = settingsManager.data$;
export const initializeSettings = settingsManager.initialize;

// Helper functions for specific settings updates

// Update general settings
export async function updateGeneralSettings(
  updates: Partial<AppSettings['general']>
): Promise<void> {
  await settingsManager.update((current) => ({
    ...current,
    general: {
      ...current.general,
      ...updates,
    },
  }));
}

// Update hotkey settings
export async function updateHotkeySettings(updates: Record<string, string>): Promise<void> {
  await settingsManager.update((current) => ({
    ...current,
    hotkeys: {
      ...current.hotkeys,
      ...updates,
    },
  }));
}

// Update theme settings
export async function updateThemeSettings(updates: Partial<AppSettings['themes']>): Promise<void> {
  await settingsManager.update((current) => ({
    ...current,
    themes: {
      ...current.themes,
      ...updates,
    },
  }));
}

// Update plugin settings
export async function updatePluginSettings(
  updates: Partial<AppSettings['plugins']>
): Promise<void> {
  await settingsManager.update((current) => ({
    ...current,
    plugins: {
      ...current.plugins,
      ...updates,
    },
  }));
}

// Update library settings
export async function updateLibrarySettings(
  updates: Partial<AppSettings['library']>
): Promise<void> {
  await settingsManager.update((current) => ({
    ...current,
    library: {
      ...current.library,
      ...updates,
    },
  }));
}

// Add a library path
export async function addLibraryPath(path: string): Promise<void> {
  await settingsManager.update((current) => {
    // Don't add duplicate paths
    if (current.library.paths.includes(path)) {
      return current;
    }

    return {
      ...current,
      library: {
        ...current.library,
        paths: [...current.library.paths, path],
      },
    };
  });
}

// Remove a library path
export async function removeLibraryPath(path: string): Promise<void> {
  await settingsManager.update((current) => ({
    ...current,
    library: {
      ...current.library,
      paths: current.library.paths.filter((p) => p !== path),
    },
  }));
}
