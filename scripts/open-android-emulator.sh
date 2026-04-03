#!/usr/bin/env bash

set -euo pipefail

ANDROID_SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
EMULATOR_BIN="$ANDROID_SDK/emulator/emulator"
DEFAULT_AVD="${STAGEHAND_ANDROID_AVD:-Medium_Phone_API_36.1}"
TARGET_AVD="${1:-$DEFAULT_AVD}"

if [[ ! -x "$EMULATOR_BIN" ]]; then
  echo "Android emulator binary not found at $EMULATOR_BIN"
  exit 1
fi

AVAILABLE_AVDS="$("$EMULATOR_BIN" -list-avds 2>/tmp/stagehand-android-avds.log || true)"

if [[ -z "$AVAILABLE_AVDS" ]]; then
  echo "No Android Virtual Devices are configured."
  echo "Create one in Android Studio's Device Manager, then rerun this command."
  exit 1
fi

if ! printf '%s\n' "$AVAILABLE_AVDS" | rg -qx "$TARGET_AVD"; then
  echo "Requested AVD not found: $TARGET_AVD"
  echo
  echo "Available AVDs:"
  printf '%s\n' "$AVAILABLE_AVDS"
  exit 1
fi

echo "Starting Android emulator: $TARGET_AVD"
nohup "$EMULATOR_BIN" -avd "$TARGET_AVD" -netdelay none -netspeed full \
  >/tmp/stagehand-android-emulator.log 2>&1 &

echo "Emulator launch requested."
echo "Logs: /tmp/stagehand-android-emulator.log"
