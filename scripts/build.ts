#!/usr/bin/env bun

import { spawnSync } from 'child_process';
import { resolve, join } from 'path';
import { rmSync, existsSync, readFileSync } from 'fs';

// Types
interface AppConfig {
  APP_NAME: string;
  TEAM_NAME: string;
  TEAM_ID: string;
  APPLE_ID: string;
  APP_PASSWORD: string;
  version: string;
}

function execCommand(command: string, args: string[], errorMessage: string) {
  console.log(`Executing: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

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

// Function to update Info.plist version
function updateInfoPlist(version: string, projectRoot: string) {
  const infoPlistPath = join(projectRoot, 'macos/LegendPhotos-macOS/Info.plist');

  if (!existsSync(infoPlistPath)) {
    console.error(`Error: Info.plist not found at ${infoPlistPath}`);
    process.exit(1);
  }

  log('Updating Info.plist version');

  // Use PlistBuddy to update both version strings
  const versionNumber = version.split('.').join('');

  execCommand('/usr/libexec/PlistBuddy', [
    '-c', `Set :CFBundleShortVersionString ${version}`,
    '-c', `Set :CFBundleVersion ${versionNumber}`,
    infoPlistPath
  ], 'Error updating Info.plist version:');

  console.log(`Updated Info.plist version to ${version} (${versionNumber})`);
}

// Load and parse configuration
function loadConfig(projectRoot: string): AppConfig {
  // Get version from package.json
  const packageJsonPath = join(projectRoot, 'package.json');
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
  const envFilePath = join(projectRoot, '.env');
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
    ] as const;

    envVars.forEach(key => {
      const pattern = new RegExp(`${key}=["']?([^"'\\n]+)["']?`);
      const match = envContent.match(pattern);
      if (match && match[1]) {
        config[key] = match[1];
      }
    });
  }

  return config;
}

function main() {
  const PROJECT_ROOT = resolve(__dirname, '..');
  const MACOS_DIR = join(PROJECT_ROOT, 'macos');
  const RELEASE_APP_PATH = join(MACOS_DIR, 'build/Build/Products/Release/Legend Photos.app');

  // Load config and update Info.plist before building
  const config = loadConfig(PROJECT_ROOT);
  updateInfoPlist(config.version, PROJECT_ROOT);

  // Change directory to macos
  process.chdir(MACOS_DIR);
  log('Changed directory to macos');

  // Remove previous Release build if it exists
  if (existsSync(RELEASE_APP_PATH)) {
    log('Removing previous Release build');
    rmSync(RELEASE_APP_PATH, { recursive: true, force: true });
  }

  // Run xcodebuild
  log('Building app with xcodebuild');
  execCommand('xcodebuild', [
    '-workspace', 'LegendPhotos.xcworkspace',
    '-scheme', 'LegendPhotos-macOS',
    '-configuration', 'Release',
    '-derivedDataPath', './build'
  ], 'Error building app:');

  log('Build completed successfully');

  execCommand(
    'codesign',
    [
      '--force',
      '--deep',
      '--entitlements',
      join(PROJECT_ROOT, 'macos/LegendPhotos-macOS/LegendPhotos-macOS.entitlements'),
      '--sign',
      `Developer ID Application: ${config.TEAM_NAME} (${config.TEAM_ID})`,
      '--options',
      'runtime',
      RELEASE_APP_PATH,
    ],
    'Error code signing app:',
  );

  log('Code signed successfully');
}

// Run the script
main();