# PhotoKit Plugin for Legend Photos

This plugin integrates macOS Photos Library with Legend Photos. It allows users to browse and view photos from their macOS Photos app directly within the Legend Photos application.

## Features

- Browse Photos Library albums
- View photos from the Photos Library
- Access photo metadata (dimensions, creation date, favorites)

## Usage

The plugin is automatically initialized when the app starts. It will check for Photos Library permissions and request them if needed.

Albums from Photos Library will appear as folders with the prefix `photokit://` in the folder list.

## API

### PluginPhotoKit

Main plugin export that implements the SourcePlugin interface:

```typescript
export const PluginPhotoKit: SourcePlugin = {
  id: 'plugin-photokit',
  name: 'Photos Library',
  description: 'Access photos from your macOS Photos app',
  version: '1.0.0',
  enabled: true,
  type: 'source',
  // ...implementation
};
```

### Helper Functions

The plugin exports utility functions to manage Photos Library access:

- `refreshPhotoKitAlbums()`: Manually refresh the album list
- `requestPhotoKitPermissions()`: Request permissions to access Photos Library

### Events

- `eventPhotoKitChange`: Event that can be used to trigger UI updates when the Photos Library changes

## Integration

To use this plugin in your app, import and register it with the plugin system:

```typescript
// In your plugin registration file
import { PluginPhotoKit } from '@/plugins/PluginPhotoKit';

// Register the plugin
registerPlugin(PluginPhotoKit);
```

## Requirements

- macOS operating system
- Photos app with a library
- User permissions to access Photos Library