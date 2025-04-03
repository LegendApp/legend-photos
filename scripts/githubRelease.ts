#!/usr/bin/env bun

import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

// Types
interface AppConfig {
  APP_NAME: string;
  version: string;
}

// Helper functions
function execCommand(command: string, args: string[], errorMessage: string) {
  console.log(`Executing: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit' });

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
    version,
  };

  // Load from .env file if exists
  const envFilePath = join(PROJECT_ROOT, '.env');
  if (existsSync(envFilePath)) {
    console.log('Loading configuration from .env file');
    const envContent = readFileSync(envFilePath, 'utf-8');

    // Extract APP_NAME from env file
    const appNameMatch = envContent.match(/APP_NAME=["']?([^"'\n]+)["']?/);
    if (appNameMatch && appNameMatch[1]) {
      config.APP_NAME = appNameMatch[1];
    }
  } else {
    console.warn('Warning: .env file not found at', envFilePath);
  }

  return config;
}

// Function to check if the GitHub CLI is installed
function checkGitHubCLI() {
  try {
    const result = spawnSync('gh', ['--version'], { stdio: 'pipe' });
    if (result.status !== 0) {
      console.error('GitHub CLI (gh) is not installed or not in PATH.');
      console.error('Please install it from https://cli.github.com/');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error checking for GitHub CLI:', error);
    process.exit(1);
  }
}

// Function to check for uncommitted git changes
function checkGitStatus() {
  log('Checking for uncommitted git changes');

  const result = spawnSync('git', ['status', '--porcelain'], { stdio: 'pipe' });

  if (result.error) {
    console.error('Error checking git status:', result.error);
    process.exit(1);
  }

  const output = result.stdout.toString().trim();

  if (output) {
    console.error('Error: There are uncommitted changes in the git repository:');
    console.error(output);
    console.error('Please commit or stash your changes before creating a release.');
    process.exit(1);
  }

  log('Git status check passed - no uncommitted changes');
}

// Function to get release notes from HTML file
function getReleaseNotes(config: AppConfig): string {
  const appName = config.APP_NAME;
  const version = config.version;
  const htmlFileName = `${appName} ${version}.html`;
  const htmlFilePath = join(PROJECT_ROOT, 'dist', htmlFileName);

  if (!existsSync(htmlFilePath)) {
    console.error(`Error: Release notes file not found at ${htmlFilePath}`);
    console.error('Did you run "bun run package" first?');
    process.exit(1);
  }

  return readFileSync(htmlFilePath, 'utf-8');
}

// Function to get the path to the zip file
function getZipFilePath(config: AppConfig): string {
  const zipFileName = `${config.APP_NAME.replace(/\s+/g, '-')}-${config.version}.zip`;
  const zipFilePath = join(PROJECT_ROOT, 'dist', zipFileName);

  if (!existsSync(zipFilePath)) {
    console.error(`Error: Zip file not found at ${zipFilePath}`);
    console.error('Did you run "bun run package" first?');
    process.exit(1);
  }

  return zipFilePath;
}

// Function to get delta files for current version
function getDeltaFiles(config: AppConfig): string[] {
  const distDir = join(PROJECT_ROOT, 'dist');
  const versionNumber = config.version.split('.').join('');

  try {
    return readFileSync(join(distDir, 'appcast.xml'), 'utf-8')
      .split('\n')
      .filter(line => line.includes('.delta"') && line.includes(`Legend-Photos${versionNumber}-`))
      .map(line => {
        const match = line.match(/Legend-Photos[^"]+\.delta/);
        return match ? join(distDir, match[0]) : null;
      })
      .filter((path): path is string => path !== null && existsSync(path));
  } catch (error) {
    console.warn('Warning: Could not find delta files in appcast.xml');
    return [];
  }
}

// Function to create a GitHub release
function createGitHubRelease(config: AppConfig, releaseNotes: string, zipFilePath: string) {
  log(`Creating GitHub release for v${config.version}`);

  const releaseTitle = `v${config.version}`;
  const tagName = `v${config.version}`;

  // Get delta files
  const deltaFiles = getDeltaFiles(config);
  if (deltaFiles.length > 0) {
    log(`Found ${deltaFiles.length} delta files to upload`);
  }

  // Create the release with the gh CLI, including all files
  execCommand(
    'gh',
    [
      'release',
      'create',
      tagName,
      '--title',
      releaseTitle,
      '--notes',
      releaseNotes,
      zipFilePath,
      ...deltaFiles,
    ],
    'Error creating GitHub release:'
  );

  log('GitHub release created successfully');
}

// Function to push the commits
function pushCommit() {
  // Push the commits
  log('Pushing commits to remote repository');
  execCommand(
    'git',
    ['push', 'origin', 'HEAD'],
    'Error pushing commits to remote repository:'
  );

  log('Commits successfully pushed to remote repository');
}

// Main execution
function main() {
  // Check for GitHub CLI
  checkGitHubCLI();

  // Check for uncommitted git changes
  checkGitStatus();

  // Load configuration
  const config = loadConfig();
  log(`Preparing to create GitHub release for ${config.APP_NAME} v${config.version}`);

  // Get release notes from HTML file
  const releaseNotes = getReleaseNotes(config);

  // Get path to zip file
  const zipFilePath = getZipFilePath(config);

  // Create GitHub release
  createGitHubRelease(config, releaseNotes, zipFilePath);

  // Push the commits
  pushCommit();

  log(`Release process completed successfully for ${config.APP_NAME} v${config.version}`);
}

// Run the script
main();