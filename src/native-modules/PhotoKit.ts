import { NativeModules } from 'react-native';

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

export interface Album {
  identifier: string;
  title: string;
  assetCount: number;
  type: 'smartAlbum' | 'userCreated';
}

export interface PhotoKitPermissionStatus {
  status: 'authorized' | 'denied' | 'restricted' | 'notDetermined';
}

interface PhotoKitInterface {
  requestPermissions(): Promise<PhotoKitPermissionStatus>;
  getPermissionStatus(): Promise<PhotoKitPermissionStatus>;
  getAlbums(): Promise<Album[]>;
  getPhotosInAlbum(albumIdentifier: string, limit?: number, offset?: number): Promise<PhotoAsset[]>;
  getPhotoAtIndex(albumIdentifier: string, index: number): Promise<PhotoAsset | null>;
}

const PhotoKit = NativeModules.PhotoKit as PhotoKitInterface;

export default PhotoKit;
