import { usePhotoKit } from '@/hooks/usePhotoKit';
import type { Album, PhotoAsset } from '@/native-modules/PhotoKit';
import React, { useState, useEffect, useCallback } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export function PhotoKitExample() {
  const { permissionStatus, loading, error, requestPermissions, getAlbums, getPhotosInAlbum } =
    usePhotoKit({ requestPermissionOnMount: true });

  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoAsset | null>(null);

  const loadAlbums = useCallback(async () => {
    const albumsData = await getAlbums();
    setAlbums(albumsData);
  }, [getAlbums]);

  const loadPhotos = useCallback(
    async (albumId: string) => {
      const photosData = await getPhotosInAlbum(albumId, 100, 0);
      setPhotos(photosData);
    },
    [getPhotosInAlbum]
  );

  // Request albums when permissions are granted
  useEffect(() => {
    if (permissionStatus === 'authorized') {
      loadAlbums();
    }
  }, [permissionStatus, loadAlbums]);

  // Load photos when an album is selected
  useEffect(() => {
    if (selectedAlbum) {
      loadPhotos(selectedAlbum.identifier);
    }
  }, [selectedAlbum, loadPhotos]);

  const selectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setSelectedPhoto(null);
  };

  const selectPhoto = (photo: PhotoAsset) => {
    setSelectedPhoto(photo);
  };

  // Show loading state
  if (loading && albums.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  // Show permission request if not authorized
  if (permissionStatus !== 'authorized') {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg mb-4">Photos access is required to use this feature</Text>
        <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-md" onPress={requestPermissions}>
          <Text className="text-white">Allow Photos Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-row">
      {/* Albums list */}
      <View className="w-64 border-r border-gray-200">
        <Text className="p-4 font-semibold text-lg">Albums</Text>
        <ScrollView>
          {albums.map((album) => (
            <TouchableOpacity
              key={album.identifier}
              className={`p-4 border-b border-gray-200 ${selectedAlbum?.identifier === album.identifier ? 'bg-gray-100' : ''}`}
              onPress={() => selectAlbum(album)}
            >
              <Text className="font-medium">{album.title}</Text>
              <Text className="text-gray-500 text-sm">{album.assetCount} items</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Photos grid */}
      <View className="flex-1">
        {selectedAlbum ? (
          <>
            <Text className="p-4 font-semibold text-lg">{selectedAlbum.title}</Text>
            <ScrollView contentContainerClassName="flex-row flex-wrap">
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.identifier}
                  className={`m-1 ${selectedPhoto?.identifier === photo.identifier ? 'border-2 border-blue-500' : ''}`}
                  onPress={() => selectPhoto(photo)}
                >
                  <Image source={{ uri: `file://${photo.uri}` }} className="w-24 h-24" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Select an album to view photos</Text>
          </View>
        )}
      </View>

      {/* Selected photo view */}
      {selectedPhoto && (
        <View className="w-1/2 border-l border-gray-200 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-semibold text-lg">{selectedPhoto.filename}</Text>
            <TouchableOpacity className="p-2" onPress={() => setSelectedPhoto(null)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: `file://${selectedPhoto.uri}` }}
            className="flex-1 w-full"
            resizeMode="contain"
          />

          <View className="mt-4">
            <Text>
              Size: {selectedPhoto.width}×{selectedPhoto.height}
            </Text>
            <Text>Created: {new Date(selectedPhoto.creationDate).toLocaleString()}</Text>
            {selectedPhoto.isFavorite && <Text className="text-yellow-500">Favorite</Text>}
          </View>
        </View>
      )}
    </View>
  );
}
