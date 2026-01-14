# Pixood - Minimalist Mood Tracker App

Pixood is a minimalist mood tracking app to log your daily moods and visualize them over time.
- The app uses Expo for cross-platform development
- All data is stored locally on the device (no cloud sync)
- Supports iOS, Android, and Web

This project is a **fork** of the original [Pixy Mood Tracker](https://github.com/mrzmyr/pixy-mood-tracker) app. It aims to maintain and simplify the app while removing all cloud dependencies with a **fully local storage**, and preparing for future enhancements. For more information, visit the original mrzmyr's repository.

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (v18+)
- **Yarn** (v3.6+) - Managed via Corepack with `corepack enable`
- **Expo CLI** - Install via `npm install -g expo-cli`

### For iOS Development
- **Xcode** (macOS only)
- **CocoaPods**

### For Android Development
- **Android Studio**
- **Android SDK** (API 28+)
- **JDK 17** (recommended)


## Quick Start

1. Clone the repository
2. Install dependencies
```bash
yarn install
```

3. Start the development server
```bash
yarn start
```

This will launch the Expo CLI in your terminal with options to run on different platforms.


## Running on Different Platforms

### A. Run on Android Emulator

#### Setup (first time only):
1. Open **Android Studio**
2. Go to **Tools** -> **Device Manager** -> **Create Device**
3. Select a device with API level (31+)
4. Click **Launch** to start the emulator

#### Run the app:
```bash
yarn android
```
If `yarn start` is already running, press `a` to open on Android Emulator 

Make sure you have a matching Java and Gradle version. If you face issues, try updating Gradle in `android/gradle/wrapper/gradle-wrapper.properties`.

### B. Run on Android Physical Device

1. Enable **USB Debugging** on your phone:
   - Settings -> Developer Options -> Enable USB Debugging
   - (If Developer Options isn't visible: Settings -> About Phone -> Tap Build Number 7 times)

2. Connect your phone via USB

3. Verify connection:
```bash
adb devices
```
You should see your device listed.

4. Run the app:
```bash
yarn android
```

### C. Run on iOS Simulator

#### Setup (first time only):
Install iOS dependencies
```bash
cd ios
pod install
cd ..
```

#### Run the app:
```bash
yarn ios
```

### D. Run on iOS Physical Device

1. Connect your iPhone via USB
2. Open Xcode: `open ios/Pixood.xcworkspace`
3. Select your device in the scheme dropdown
4. Press the **Play** button to build and run

Alternatively, use the Expo CLI:
```bash
expo build:ios --type simulator  # For testing
```

### E. Run on Web (Development)
```bash
yarn web
```
If `yarn start` is already running, press `w` to open on Web  

The app will open at `http://localhost:19006`


## Common Commands

Clear cache and reinstall
```bash
yarn clean
```

Type check (TypeScript)
```bash 
yarn type-check
```

Run tests
```bash
yarn test
```


## Troubleshooting

### Issue: "unable to get local issuer certificate"
Set Yarn to ignore strict SSL (not recommended for production):
```bash
yarn config set strict-ssl false
yarn install
```

### Issue: "Cannot find expo-cli"
Install Expo CLI globally:
```bash
npm install -g expo-cli
```

### Issue: Android emulator won't start
1. Open Android Studio
2. Go to `Device Manager` and launch the emulator from there
3. Wait for it to fully boot before running `yarn android`


### Issue: Cache problems
Clear all caches
```bash
yarn clean
rm -rf node_modules
yarn install
```