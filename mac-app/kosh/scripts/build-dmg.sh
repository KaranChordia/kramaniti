#!/bin/zsh
set -euo pipefail

APP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_ROOT"

bash "$APP_ROOT/scripts/build-app.sh"

DMG_PATH="$APP_ROOT/dist/Kosh.dmg"
rm -f "$DMG_PATH"
hdiutil create -volname "Kosh" -srcfolder "$APP_ROOT/dist/Kosh.app" -ov -format UDZO "$DMG_PATH"

echo "Built $DMG_PATH"
