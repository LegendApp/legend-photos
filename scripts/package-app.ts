#!/usr/bin/env bun

import {resolve, join} from 'path';
import {readFileSync, mkdirSync, existsSync, cpSync} from 'fs';
import {spawnSync} from 'child_process';

// Types
interface AppConfig {
  APP_NAME: string;
  TEAM_NAME: string;
  TEAM_ID: string;
  APPLE_ID: string;
  APP_PASSWORD: string;
  version: string;
  [key: string]: string; // Index signature to allow string indexing
}

// Helper functions
function execCommand(command: string, args: string[], errorMessage: string) {
  console.log(`Executing: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {stdio: 'inherit'});

  if (result.error || result.status !== 0) {
    console.error(errorMessage);
    console.error(result.stderr?.toString() || result.error?.message);
    process.exit(1);
  }
  return result;
}

function log(message: string) {
  console.log(`=== ${message} ===`);
}

// Get configuration
const PROJECT_ROOT = resolve(__dirname, '..');

// Load and parse configuration
function loadConfig(): AppConfig {
  // Get version from package.json
  const packageJsonPath = join(PROJECT_ROOT, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version;

  // Default values
  const config: AppConfig = {
    APP_NAME: 'Legend Photos',
    TEAM_NAME: '',
    TEAM_ID: '',
    APPLE_ID: '',
    APP_PASSWORD: '',
    version,
  };

  // Load from .env file if exists
  const envFilePath = join(PROJECT_ROOT, '.env');
  if (existsSync(envFilePath)) {
    console.log('Loading configuration from .env file');
    const envContent = readFileSync(envFilePath, 'utf-8');

    // Extract environment variables directly
    const envVars = [
      'APP_NAME',
      'TEAM_NAME',
      'TEAM_ID',
      'APPLE_ID',
      'APP_PASSWORD',
    ];

    envVars.forEach(key => {
      const pattern = new RegExp(`${key}=["']?([^"'\\n]+)["']?`);
      const match = envContent.match(pattern);
      if (match && match[1]) {
        config[key] = match[1];
      }
    });
  } else {
    console.error('Warning: .env file not found at', envFilePath);
    process.exit(1);
  }

  return config;
}

// Function to notarize the app
function notarizeApp(appPath: string, config: AppConfig, safeAppName: string) {
  // Step 1: Code Sign the app
  log('Notarizing app');
  execCommand(
    'codesign',
    [
      '--force',
      '--deep',
      '--sign',
      `Developer ID Application: ${config.TEAM_NAME} (${config.TEAM_ID})`,
      '--options',
      'runtime',
      appPath,
    ],
    'Error code signing app:',
  );

  // Step 2: Create a ZIP archive for submission
  log('Creating notarization ZIP archive');
  const notarizationZipPath = `/tmp/${safeAppName}_notarize_temp.zip`;
  execCommand(
    'ditto',
    ['-c', '-k', '--keepParent', appPath, notarizationZipPath],
    'Error creating notarization zip archive:',
  );

  // Step 3: Submit for notarization
  log('Submitting for notarization (this may take a while)');
  execCommand(
    'xcrun',
    [
      'notarytool',
      'submit',
      notarizationZipPath,
      '--apple-id',
      config.APPLE_ID,
      '--password',
      config.APP_PASSWORD,
      '--team-id',
      config.TEAM_ID,
      '--wait',
    ],
    'Error submitting for notarization:',
  );

  // Step 4: Staple the notarization ticket to the app
  log('Stapling notarization ticket to app');
  execCommand(
    'xcrun',
    ['stapler', 'staple', appPath],
    'Error stapling notarization ticket:',
  );

  log('Notarization process completed successfully');
}

// Main execution
function main() {
  // Load configuration
  const config = loadConfig();

  // Setup paths
  const builtAppPath = join(
    PROJECT_ROOT,
    'macos/build/Build/Products/Release',
    `${config.APP_NAME}.app`,
  );
  const distDir = join(PROJECT_ROOT, 'dist');
  const safeAppName = config.APP_NAME.replace(/\s+/g, '_');
  const versionedAppName = `${safeAppName}-v${config.version}.app`;
  const distAppPath = join(distDir, versionedAppName);
  const zipFileName = `${safeAppName}-v${config.version}.zip`;
  const zipFilePath = join(distDir, zipFileName);

  // Check if app exists
  if (!existsSync(builtAppPath)) {
    console.error(`Error: App not found at ${builtAppPath}`);
    console.error(`Make sure to build the app first with 'bun run build'`);
    process.exit(1);
  }

  // Create dist directory if needed
  if (!existsSync(distDir)) {
    console.log(`Creating distribution directory: ${distDir}`);
    mkdirSync(distDir, {recursive: true});
  }

  // Copy the app to dist with versioned name
  log(`Copying app to dist directory as ${versionedAppName}`);
  try {
    cpSync(builtAppPath, distAppPath, {recursive: true});
    console.log(`App copied successfully to: ${distAppPath}`);
  } catch (error) {
    console.error('Error copying app to dist directory:', error);
    process.exit(1);
  }

  // Notarize the copied app
  notarizeApp(distAppPath, config, safeAppName);

  // Create final zip
  log(`Packaging ${config.APP_NAME} v${config.version}`);
  log(`Creating distribution ZIP archive: ${zipFileName}`);
  execCommand(
    'ditto',
    ['-c', '-k', '--keepParent', distAppPath, zipFilePath],
    'Error creating distribution zip archive:',
  );

  log('Packaging complete');
  console.log(`App has been packaged to: ${zipFilePath}`);
}

// Run the script
main();
