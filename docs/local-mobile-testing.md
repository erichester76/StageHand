# Local Mobile Testing

Issue: `#17`

This guide documents the local iOS simulator and Android emulator workflow for StageHand's Expo app.

## Current machine baseline

Validated on the current development machine:

- Xcode is installed
- Android Studio is installed
- Expo CLI is available through `npx expo`
- Android SDK tools are available through `adb` and `emulator`
- existing Android AVD detected: `Medium_Phone_API_36.1`

Known local quirk discovered during validation:

- `xcrun simctl` initially reported that `CoreSimulatorService` was unavailable
- opening `Xcode` once cleared the issue and allowed the simulator service to respond normally

## Repo commands

Use these commands from `/Users/eric/Documents/StageHand`:

```bash
npm run env:mobile
npm run sim:ios
npm run sim:android
npm run start:clear
```

What they do:

- `npm run env:mobile`: checks Node, Expo, Xcode, iOS simulator reachability, ADB, and Android AVDs
- `npm run sim:ios`: opens Apple Simulator and tries to boot an available device
- `npm run sim:android`: launches the default Android AVD
- `npm run start:clear`: starts Expo with a cleared Metro cache

## Recommended daily workflow

### iOS

1. Run `npm run sim:ios`
2. If the script reports a CoreSimulator problem, open `Xcode` once and wait for any component installation to finish
3. Run `npm run start:clear`
4. Press `i` in the Expo terminal if Expo does not auto-open the simulator

### Android

1. Run `npm run sim:android`
2. Wait for `Medium_Phone_API_36.1` to finish booting
3. Run `npm run start:clear`
4. Press `a` in the Expo terminal if Expo does not auto-open the emulator

## Changing the default Android AVD

The launcher script uses this default AVD:

```text
Medium_Phone_API_36.1
```

To override it for a single shell session:

```bash
export STAGEHAND_ANDROID_AVD="Your_AVD_Name"
npm run sim:android
```

You can also pass a name directly to the script:

```bash
./scripts/open-android-emulator.sh Your_AVD_Name
```

## Troubleshooting

### iOS simulator does not respond

- Open `Simulator`
- If that is not enough, open `Xcode`
- Wait for any first-run prompts or component installs
- Re-run `npm run env:mobile`

### Android emulator command fails

- Open Android Studio
- Go to Device Manager
- Confirm `Medium_Phone_API_36.1` still exists
- Create a new AVD if needed, then set `STAGEHAND_ANDROID_AVD`

### Expo does not attach to the emulator

- Re-run `npm run start:clear`
- Confirm the emulator is fully booted before pressing `i` or `a`
- If needed, stop Expo and restart it after the emulator is already open

## Future upgrades

This local workflow is intentionally lightweight for the current Expo stage. Later we should add:

- Expo development builds for native payment and device APIs
- test accounts and seeded fixtures for show-night scenarios
- CI coverage for typecheck, lint, and selected device-level smoke tests
