#!/usr/bin/env bash

set -euo pipefail

TARGET_DEVICE="${1:-}"

echo "Opening Apple Simulator..."
open -a Simulator

if ! command -v xcrun >/dev/null 2>&1; then
  echo "xcrun is not available. Install Xcode command line tools first."
  exit 1
fi

sleep 2

if ! xcrun simctl list devices available >/tmp/stagehand-ios-simctl.log 2>&1; then
  echo "CoreSimulator is not responding yet."
  echo "Open Xcode once, let it finish any first-run setup, then rerun this command."
  exit 1
fi

if [[ -n "$TARGET_DEVICE" ]]; then
  echo "Booting requested device: $TARGET_DEVICE"
  xcrun simctl boot "$TARGET_DEVICE" >/dev/null 2>&1 || true
else
  FIRST_SHUTDOWN_DEVICE="$(
    xcrun simctl list devices available \
      | rg "Shutdown" \
      | head -n 1 \
      | sed -E 's/^[[:space:]]*([^()]+) \(.+$/\1/' \
      | sed 's/[[:space:]]*$//' \
      || true
  )"

  if [[ -n "$FIRST_SHUTDOWN_DEVICE" ]]; then
    echo "Booting default device: $FIRST_SHUTDOWN_DEVICE"
    xcrun simctl boot "$FIRST_SHUTDOWN_DEVICE" >/dev/null 2>&1 || true
  else
    echo "Simulator opened, but no shutdown device was auto-selected."
  fi
fi

open -a Simulator
echo "Simulator is ready."
