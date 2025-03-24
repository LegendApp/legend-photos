#!/usr/bin/env bun

import {spawnSync} from 'child_process';
import {cpSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';
import path, {join, resolve} from 'path';

// Types
interface AppConfig {
  APP_NAME: string;
  TEAM_NAME: string;
  TEAM_ID: string;
  APPLE_ID: string;
  APP_PASSWORD: string;
  version: string;
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
    ] as const;

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
  log(`Starting notarization process for ${appPath}`);

  // Step 1: Code Sign the app
  log('Code signing app');
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

// Function to create a version info file for Sparkle
function createVersionInfoFile(
  distDir: string,
  config: AppConfig,
  zipFileName: string,
) {
  const infoPath = join(distDir, 'sparkle-version-info.plist');
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleShortVersionString</key>
    <string>${config.version}</string>
    <key>CFBundleVersion</key>
    <string>${config.version.split('.').join('')}</string>
    <key>FileName</key>
    <string>${zipFileName}</string>
</dict>
</plist>`;

  writeFileSync(infoPath, content, 'utf-8');
  console.log(`Created version info file at: ${infoPath}`);
}

// Function to parse CHANGELOG.md and generate HTML update files for each version
function generateChangelogHtml(
  distDir: string,
  config: AppConfig,
  appName: string,
) {
  log('Generating HTML update files from CHANGELOG.md');

  const changelogPath = join(PROJECT_ROOT, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    console.warn(`Warning: CHANGELOG.md not found at ${changelogPath}`);
    console.warn('Skipping HTML update file generation');
    return;
  }

  const changelogContent = readFileSync(changelogPath, 'utf-8');

  // Parse changelog into version blocks
  // Format expected: ## x.x.x followed by release notes
  const versionRegex = /## (\d+\.\d+\.\d+)\s+([\s\S]*?)(?=## \d+\.\d+\.\d+|$)/g;
  let match;

  while ((match = versionRegex.exec(changelogContent)) !== null) {
    const version = match[1];
    const notes = match[2].trim();

    // Save HTML file with the same naming pattern as the zip but with .html extension
    const htmlFileName = `${appName} ${version}.html`;
    const htmlFilePath = join(distDir, htmlFileName);

    writeFileSync(htmlFilePath, notes, 'utf-8');
    console.log(
      `Generated HTML update file for version ${version}: ${htmlFilePath}`,
    );
  }

  log('HTML update file generation complete');
}

// Function to check if version exists in CHANGELOG.md
function checkVersionInChangelog(config: AppConfig) {
  log('Checking for version in CHANGELOG.md');

  const changelogPath = join(PROJECT_ROOT, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    console.error(`Error: CHANGELOG.md not found at ${changelogPath}`);
    process.exit(1);
  }

  const changelogContent = readFileSync(changelogPath, 'utf-8');

  // Look for the version header in the changelog
  const versionHeaderRegex = new RegExp(
    `## ${config.version.replace(/\./g, '\\.')}`,
  );

  if (!versionHeaderRegex.test(changelogContent)) {
    console.error(`Error: Version ${config.version} not found in CHANGELOG.md`);
    console.error('Please add release notes for this version before packaging');
    process.exit(1);
  }

  log(`Found version ${config.version} in CHANGELOG.md`);
}

// Function to generate appcast
function generateAppcast(distDir: string, config: AppConfig) {
  // Find generate-appcast
  const generateAppcastPath = path.resolve(
    __dirname,
    '../macos/Pods/Sparkle/bin/generate_appcast',
  );

  if (!existsSync(generateAppcastPath)) {
    console.warn(
      `Warning: generate_appcast not found at ${generateAppcastPath}`,
    );
    console.warn(
      'Skipping appcast generation. To enable this feature, set SPARKLE_PATH in .env',
    );
    return;
  }

  log('Generating appcast from dist folder');
  execCommand(
    generateAppcastPath,
    [
      distDir,
      '--download-url-prefix',
      `https://github.com/LegendApp/legend-photos/releases/tag/${config.version}/`,
    ],
    'Error generating appcast:',
  );
  log('Appcast generation complete');
}

// Main execution
function main() {
  // Load configuration
  const config = loadConfig();

  const appName = config.APP_NAME;

  // Check if this version exists in the changelog before proceeding
  checkVersionInChangelog(config);

  // Setup paths
  const builtAppPath = join(
    PROJECT_ROOT,
    'macos/build/Build/Products/Release',
    `${appName}.app`,
  );
  const distDir = join(PROJECT_ROOT, 'dist');

  // Use the same base filename both for the app and zip
  const versionedAppName = `${appName}.app`;
  const zipFileName = `${appName} ${config.version}.zip`;
  const distAppPath = join(distDir, versionedAppName);
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
  notarizeApp(distAppPath, config, appName);

  // Create final zip
  log(`Packaging ${appName} v${config.version}`);
  log(`Creating distribution ZIP archive: ${zipFileName}`);
  execCommand(
    'ditto',
    [
      '-ck',
      '-rsrc',
      '--sequesterRsrc',
      '--keepParent',
      distAppPath,
      zipFilePath,
    ],
    'Error creating distribution zip archive:',
  );

  log('Packaging complete');
  console.log(`App has been packaged to: ${zipFilePath}`);

  // Create version info file for Sparkle
  createVersionInfoFile(distDir, config, zipFileName);

  // Generate HTML update files from CHANGELOG.md
  generateChangelogHtml(distDir, config, appName);

  // Generate appcast
  generateAppcast(distDir, config);
}

// Run the script
main();
