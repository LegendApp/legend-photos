import { type Observable, observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { observablePersistReactNativeFS } from './ReactNativeFSPersistPlugin';

/**
 * Creates a manager for a JSON file with observable state
 * @param filename The name of the JSON file (without path)
 * @param initialValue The initial value for the observable
 * @returns An object with the observable and utility functions
 */
export function createJSONManager<T extends object>(
  basePath: string,
  filename: `${string}.json`,
  initialValue: T
) {
  // Create an observable with the initial value and make sure it has the correct type
  const data$ = observable<T>(
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
  ) as unknown as Observable<T>;

  data$.get();

  return data$;
}
