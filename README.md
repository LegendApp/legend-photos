# Legend Photos

A photo viewing application built with React Native for macOS.

## Development

This project uses [Bun](https://bun.sh) as the package manager and [Biome](https://biomejs.dev) for linting and formatting.

### Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run the app:
   ```bash
   bun run mac
   ```

### Code Formatting and Linting

This project uses Biome for code formatting and linting. Biome is configured to format code on save in VSCode.

Available commands:

- Format code:
  ```bash
  bun run format
  ```

- Lint code:
  ```bash
  bun run lint
  ```

- Check and fix code:
  ```bash
  bun run check
  ```

### VSCode Integration

Biome is configured as the default formatter in VSCode. Install the [Biome VSCode extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for the best experience.

The following settings are already configured in `.vscode/settings.json`:

- Format on save
- Organize imports on save
- Fix all auto-fixable issues on save

## Project Structure

- `src/` - Source code
  - `App.tsx` - Main application entry point
  - `components/` - React components
  - `features/` - Feature-specific code
  - `hooks/` - Custom React hooks
  - `legend-kit/` - Legend kit implementation
  - `native-modules/` - Native module integrations
  - `plugin-system/` - Plugin system architecture
  - `plugins/` - Individual plugins
  - `settings/` - Application settings
  - `systems/` - Core system implementations
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions and helpers
- `macos/` - macOS specific code

# Getting Started

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
bun start
```

## Step 2: Start the Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or
_iOS_ app:

### For macOS

```bash
bun mac
```

If everything is set up _correctly_, you should see a bunch of logs for a while, and then the app will open.

# Support Development

If you find Legend Photos valuable, consider [sponsoring @jmeistrich on GitHub](https://github.com/sponsors/jmeistrich). Your support helps maintain and improve this project!
