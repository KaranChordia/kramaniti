#!/bin/zsh
set -euo pipefail

APP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_ROOT"

swift build -c release

BIN_PATH="$(swift build -c release --show-bin-path)"
APP_DIR="$APP_ROOT/dist/Kosh.app"

rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS" "$APP_DIR/Contents/Resources"
cp "$BIN_PATH/Kosh" "$APP_DIR/Contents/MacOS/Kosh"
cp "$APP_ROOT/Support/Info.plist" "$APP_DIR/Contents/Info.plist"

RESOURCE_BUNDLE="$(find "$BIN_PATH" -maxdepth 1 -type d -name '*.bundle' -print -quit)"
if [[ -n "$RESOURCE_BUNDLE" ]]; then
    cp -R "$RESOURCE_BUNDLE" "$APP_DIR/Contents/Resources/"
fi

if [[ -n "${KOSH_CODESIGN_IDENTITY:-}" ]]; then
    codesign --force --deep --options runtime --sign "$KOSH_CODESIGN_IDENTITY" "$APP_DIR"
fi

echo "Built $APP_DIR"
