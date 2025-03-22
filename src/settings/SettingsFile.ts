import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { createJSONManager } from '../utils/JSONManager';

// Define the settings structure
export interface AppSettings {
  // General settings
  general: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    autoSave: boolean;
    autoUpdate: {
      enabled: boolean;
      checkInterval: number; // in hours
    };
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
  // State
  state: {
    openFolder: string | null;
    sidebarWidth: number;
    isSidebarOpen: boolean;
    numColumns: number;
  };
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  general: {
    theme: 'system',
    language: 'en',
    autoSave: true,
    autoUpdate: {
      enabled: true,
      checkInterval: 24, // Check for updates once a day by default
    },
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
  state: {
    openFolder: null,
    sidebarWidth: 160,
    isSidebarOpen: false,
    numColumns: 4,
  },
};

// Create the settings manager
export const settings$ = createJSONManager<AppSettings>(
  `${DocumentDirectoryPath}/.legendphotos/`,
  'settings.json',
  DEFAULT_SETTINGS
);
