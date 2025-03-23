# PhotoKit Integration for Legend Photos

This module provides access to the macOS PhotoKit framework, allowing Legend Photos to interact with the user's photo library.

## Features

- Request and check photo library permissions
- Fetch all albums from the photo library
- Fetch photos from a specific album
- Get detailed information about photos (filename, URI, dimensions, creation date, etc.)

## Setup

1. Ensure `NSPhotoLibraryUsageDescription` is added to your `Info.plist` file (already added)
2. Make sure the PhotoKit module is properly linked (already configured)
3. Use the provided `usePhotoKit` hook in your React components

## Usage

```tsx
import { usePhotoKit } from '@/hooks/usePhotoKit';

function MyComponent() {
  const {
    permissionStatus,
    albums,
    loading,
    error,
    requestPermissions,
    getAlbums,
    getPhotosInAlbum
  } = usePhotoKit({ requestPermissionOnMount: true });

  // Request permission if needed
  const handleRequestPermission = async () => {
    const status = await requestPermissions();
    if (status === 'authorized') {
      // Permission granted, load albums
      await getAlbums();
    }
  };

  // Load photos from an album
  const handleLoadPhotos = async (albumId: string) => {
    const photos = await getPhotosInAlbum(albumId, 50, 0); // Get first 50 photos
    // Do something with the photos
  };

  return (
    // Your component JSX
  );
}
```

## Example

See `src/plugins/PhotoKitExample.tsx` for a complete example implementation.

## Interface

### PhotoAsset

```typescript
export interface PhotoAsset {
  identifier: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  creationDate: string;
  modificationDate: string;
  mediaType: 'image' | 'video';
  isFavorite: boolean;
}
```

### Album

```typescript
export interface Album {
  identifier: string;
  title: string;
  assetCount: number;
  type: 'smartAlbum' | 'userCreated';
}
```

## Performance Considerations

- Photos are retrieved on-demand to minimize memory usage
- For large albums, consider using pagination with the `limit` and `offset` parameters
- The URI returned is a file path that can be used directly with React Native Image components