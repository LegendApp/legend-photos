import { exists, mkdir, readFile, writeFile } from '@dr.pogodin/react-native-fs';
import type { Change } from '@legendapp/state';
import { applyChanges, internal, isArray } from '@legendapp/state';
import type {
  ObservablePersistPlugin,
  ObservablePersistPluginOptions,
  PersistMetadata,
} from '@legendapp/state/sync';

const MetadataSuffix = '__m';
const { safeParse, safeStringify } = internal;

/**
 * Configuration options for the ReactNativeFS plugin
 */
export interface ReactNativeFSPersistPluginOptions {
  /**
   * Base directory path. Defaults to DocumentDirectoryPath/.legendphotos/
   */
  basePath: string;

  /**
   * Preload all tables on startup. Can be true to load all, or an array of table names
   */
  preload?: string[];

  saveTimeout?: number;
}

export class ObservablePersistReactNativeFS implements ObservablePersistPlugin {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private data: Record<string, any> = {};
  private configuration: ReactNativeFSPersistPluginOptions;
  private basePath: string;

  constructor(configuration: ReactNativeFSPersistPluginOptions) {
    this.configuration = configuration;
    this.basePath = configuration.basePath;
  }

  public async initialize(_configOptions: ObservablePersistPluginOptions) {
    const storageConfig = this.configuration;
    let tables: string[] = [];

    try {
      // Ensure base directory exists
      await this.ensureDirectoryExists(`${this.basePath}/init.txt`);

      if (isArray(storageConfig.preload)) {
        // If preloadKeys, preload the tables on startup
        const metadataTables = storageConfig.preload.map((table) =>
          table.endsWith(MetadataSuffix) ? undefined : table + MetadataSuffix
        );
        tables = [...storageConfig.preload, ...(metadataTables.filter(Boolean) as string[])];

        // Load all the preload tables
        await tables.map((table) => this.loadTable(table));
      }
    } catch (e) {
      console.error('[legend-state] ObservablePersistReactNativeFS failed to initialize', e);
    }
  }

  public async loadTable(table: string): Promise<void> {
    if (this.data[table] === undefined) {
      try {
        const mainTablePath = `${this.basePath}${table}`;
        const metadataTablePath = `${this.basePath}${table}${MetadataSuffix}`;

        const mainExists = await exists(mainTablePath);
        const metadataExists = await exists(metadataTablePath);

        if (mainExists) {
          const content = await readFile(mainTablePath);
          this.data[table] = content ? safeParse(content) : undefined;
        }

        if (metadataExists) {
          const content = await readFile(metadataTablePath);
          this.data[table + MetadataSuffix] = content ? safeParse(content) : undefined;
        }
      } catch (err) {
        console.error(
          '[legend-state] ObservablePersistReactNativeFS failed to load table',
          table,
          err
        );
      }
    }
  }

  // Gets
  public getTable(table: string, init: object) {
    return this.data[table] ?? init ?? {};
  }

  public getMetadata(table: string): PersistMetadata {
    return this.getTable(table + MetadataSuffix, {});
  }

  // Sets
  public set(table: string, changes: Change[]): Promise<void> {
    if (!this.data[table]) {
      this.data[table] = {};
    }

    this.data[table] = applyChanges(this.data[table], changes);
    return this.save(table);
  }

  public setMetadata(table: string, metadata: PersistMetadata) {
    return this.setValue(table + MetadataSuffix, metadata);
  }

  public async deleteTable(table: string) {
    const filePath = `${this.basePath}${table}`;
    if (await exists(filePath)) {
      await writeFile(filePath, '', 'utf8');
    }
    delete this.data[table];
  }

  public deleteMetadata(table: string) {
    return this.deleteTable(table + MetadataSuffix);
  }

  // Private
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private async setValue(table: string, value: any) {
    this.data[table] = value;
    await this.save(table);
  }

  private async save(table: string) {
    timeoutOnce(
      `save_${table}`,
      () => this.saveDebounced(table),
      this.configuration.saveTimeout || 100
    );
  }

  private async saveDebounced(table: string) {
    const v = this.data[table];
    const filePath = `${this.basePath}${table}`;

    await this.ensureDirectoryExists(filePath);

    if (v !== undefined && v !== null) {
      return writeFile(filePath, safeStringify(v), 'utf8');
    }

    if (await exists(filePath)) {
      return writeFile(filePath, '', 'utf8');
    }

    return Promise.resolve();
  }

  private async ensureDirectoryExists(filePath: string): Promise<void> {
    // Extract the directory path from the file path
    const directoryPath = filePath.substring(0, filePath.lastIndexOf('/'));

    // Check if the directory exists
    const dirExists = await exists(directoryPath);

    if (!dirExists) {
      // Split the path into segments
      const pathSegments = directoryPath.split('/');
      let currentPath = '';

      // Create each directory segment if it doesn't exist
      for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `${pathSegments[i]}/`;

        // Skip empty segments
        if (pathSegments[i] === '') {
          continue;
        }

        // Check if this segment exists
        const segmentExists = await exists(currentPath);

        if (!segmentExists) {
          try {
            await mkdir(currentPath);
          } catch (error) {
            // If the directory was created by another process in the meantime, continue
            if (await exists(currentPath)) {
              console.log(`Directory already exists: ${currentPath}`);
            } else {
              throw error;
            }
          }
        }
      }
    }
  }
}

export function observablePersistReactNativeFS(configuration: ReactNativeFSPersistPluginOptions) {
  return new ObservablePersistReactNativeFS(configuration);
}

const timeouts: Record<string, any> = {};
function timeoutOnce(name: string, cb: () => void, time: number) {
  const t = timeouts[name];
  if (t) {
    clearTimeout(t);
  }
  timeouts[name] = setTimeout(() => {
    delete timeouts[name];

    cb();
  }, time);
}
