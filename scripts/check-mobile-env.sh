#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_ANDROID_AVD="${STAGEHAND_ANDROID_AVD:-Medium_Phone_API_36.1}"

print_check() {
  printf '\n[%s]\n%s\n' "$1" "$2"
}

print_check "Project" "Checking StageHand local mobile environment from $PROJECT_ROOT"

if command -v node >/dev/null 2>&1; then
  print_check "Node" "$(node -v)"
else
  print_check "Node" "Missing"
fi

if command -v npx >/dev/null 2>&1; then
  print_check "Expo" "$(cd "$PROJECT_ROOT" && npx expo --version)"
else
  print_check "Expo" "npx not available"
fi

if command -v xcodebuild >/dev/null 2>&1; then
  print_check "Xcode" "$(xcodebuild -version | tr '\n' ' ' | sed 's/ $//')"
else
  print_check "Xcode" "Missing"
fi

if command -v xcrun >/dev/null 2>&1; then
  if xcrun simctl list devices available >/tmp/stagehand-ios-simctl.log 2>&1; then
    IOS_STATUS="CoreSimulator reachable"
  else
    IOS_STATUS="CoreSimulator unavailable; open Simulator or Xcode once, then rerun this check"
  fi
  print_check "iOS Simulator" "$IOS_STATUS"
else
  print_check "iOS Simulator" "xcrun not available"
fi

if command -v adb >/dev/null 2>&1; then
  print_check "ADB" "$(adb version | head -n 1)"
else
  print_check "ADB" "Missing"
fi

if command -v emulator >/dev/null 2>&1; then
  AVD_LIST="$(emulator -list-avds 2>/tmp/stagehand-android-avds.log || true)"
  if [[ -n "$AVD_LIST" ]]; then
    print_check "Android AVDs" "$AVD_LIST"
  else
    print_check "Android AVDs" "No AVDs found"
  fi

  if printf '%s\n' "$AVD_LIST" | rg -qx "$DEFAULT_ANDROID_AVD"; then
    print_check "Default Android AVD" "$DEFAULT_ANDROID_AVD"
  else
    print_check "Default Android AVD" "Missing expected default: $DEFAULT_ANDROID_AVD"
  fi
else
  print_check "Android Emulator" "Missing emulator binary"
fi

cat <<EOF

Suggested workflow:
1. npm run env:mobile
2. npm run sim:ios
3. npm run sim:android
4. npm run start:clear
5. Press i for iOS or a for Android in the Expo terminal when needed
EOF
