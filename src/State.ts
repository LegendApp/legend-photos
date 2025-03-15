import { observable } from '@legendapp/state';

// Define the interface for the fullscreen photo data
export interface FullscreenPhotoData {
  uri: string;
  initialPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Observable state for photos
export const photos$ = observable<string[]>([]);

// Create a global observable for the fullscreen photo
export const fullscreenPhoto$ = observable<FullscreenPhotoData | null>(null);

// Helper function to show a photo in fullscreen
export const showFullscreenPhoto = (data: FullscreenPhotoData) => {
  fullscreenPhoto$.set(data);
};

// Helper function to hide the fullscreen photo
export const hideFullscreenPhoto = () => {
  fullscreenPhoto$.set(null);
};

// Sidebar width state
export const sidebarWidth$ = observable<number>(220);

// Helper function to update sidebar width
export const setSidebarWidth = (width: number) => {
  sidebarWidth$.set(width);
};

// Selected photo index state
export const selectedPhotoIndex$ = observable<number | null>(null);

// Helper function to toggle photo selection
export const togglePhotoSelection = (index: number) => {
  const currentIndex = selectedPhotoIndex$.get();
  selectedPhotoIndex$.set(currentIndex === index ? null : index);
};
