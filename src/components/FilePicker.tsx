import type React from 'react';
import { NativeModules } from 'react-native';
import { Button } from './Button';

// Define type for the FilePicker native module
interface FilePickerInterface {
  pickFileWithFilenameExtension: (
    filenameExtensions: string[],
    prompt: string
  ) => Promise<string | null>;
  pickFolder: () => Promise<string | null>;
}

// Get the native module
const NativeFilePicker = NativeModules.FilePicker as FilePickerInterface;

type FilePickerProps = {
  onFileSelected?: (path: string) => void;
  onCancel?: () => void;
  fileTypes?: string[];
  prompt?: string;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  pickFolder?: boolean;
};

export const FilePicker: React.FC<FilePickerProps> = ({
  onFileSelected,
  onCancel,
  fileTypes = [],
  prompt = 'Select',
  title,
  variant = 'primary',
  size = 'medium',
  pickFolder = false,
}) => {
  const handlePress = async () => {
    try {
      let selectedPath: string | null;

      if (pickFolder) {
        selectedPath = await NativeFilePicker.pickFolder();
      } else {
        selectedPath = await NativeFilePicker.pickFileWithFilenameExtension(fileTypes, prompt);
      }

      if (selectedPath) {
        onFileSelected?.(selectedPath);
      } else {
        onCancel?.();
      }
    } catch (error: any) {
      if (error.message !== 'NSModalResponseCancel') {
        console.error('Error picking file:', error);
      }
      onCancel?.();
    }
  };

  return <Button title={title} onPress={handlePress} variant={variant} size={size} />;
};
