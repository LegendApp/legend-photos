#!/bin/bash
set -e

# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Load configuration from .env file in project root
if [ -f "$PROJECT_ROOT/.env" ]; then
  echo "Loading configuration from .env file"
  source "$PROJECT_ROOT/.env"
else
  echo "Warning: .env file not found at $PROJECT_ROOT/.env."
  exit 1
fi

# Configuration - Use values from .env file or fallback to defaults
APP_NAME="${APP_NAME:-Legend Photos}"
TEAM_NAME="${TEAM_NAME}"
TEAM_ID="${TEAM_ID}" # Your Apple Developer Team ID
APPLE_ID="${APPLE_ID}" # Your Apple Developer account email
APP_PASSWORD="${APP_PASSWORD}" # App-specific password for notarization
BUNDLE_ID="${BUNDLE_ID}" # Your app's bundle identifier

# Check if the app exists
APP_PATH="macos/build/Build/Products/Release/${APP_NAME}.app"
if [ ! -d "$APP_PATH" ]; then
  echo "Error: App not found at $APP_PATH"
  echo "Make sure to build the app first with 'bun run build'"
  exit 1
fi

echo "=== Starting notarization process for ${APP_NAME} ==="

# Step 1: Code Sign the app
echo "=== Code signing app ==="
codesign --force --deep --sign "Developer ID Application: ${TEAM_NAME} (${TEAM_ID})" --options runtime "$APP_PATH"

# Step 2: Create a ZIP archive for submission
echo "=== Creating ZIP archive ==="
ZIP_PATH="/tmp/${APP_NAME// /_}.zip"
ditto -c -k --keepParent "$APP_PATH" "$ZIP_PATH"

# Step 3: Submit for notarization
echo "=== Submitting for notarization (this may take a while) ==="
xcrun notarytool submit "$ZIP_PATH" \
  --apple-id "$APPLE_ID" \
  --password "$APP_PASSWORD" \
  --team-id "$TEAM_ID" \
  --wait

# Step 4: Staple the notarization ticket to the app
echo "=== Stapling notarization ticket to app ==="
xcrun stapler staple "$APP_PATH"

echo "=== Notarization process completed successfully ==="
echo "You can now distribute your app."