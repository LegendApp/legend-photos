import { observablePersistReactNativeFS } from '@/utils/ReactNativeFSPersistPlugin';
import { exists, writeFile } from '@dr.pogodin/react-native-fs';
import { type Observable, observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';

/**
 * Creates a manager for a JSON file with observable state
 * @param filename The name of the JSON file (without path)
 * @param initialValue The initial value for the observable
 * @returns An object with the observable and utility functions
 */
export function createJSONManager<T extends object>(params: {
  basePath: string;
  filename: `${string}.json`;
  initialValue: T;
  saveDefaultToFile: boolean;
}): Observable<T> {
  const { basePath, filename, initialValue, saveDefaultToFile } = params;
  // Create an observable with the initial value and make sure it has the correct type
  const data$ = observable<Record<string, any>>(
    synced({
      initial: initialValue,
      persist: {
        name: filename,
        plugin: observablePersistReactNativeFS({
          basePath,
          preload: [filename],
          saveTimeout: 300,
        }),
      },
    })
  );

  data$.get();

  if (saveDefaultToFile) {
    // TODO: save default to file
    // Need a feature in Legend State first
  }

  return data$ as unknown as Observable<T>;
}
