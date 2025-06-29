# Notification Scheduler App

A simple React Native Expo app that schedules local foreground notifications using Notifee.

## Features

✅ **Single Screen App**: Clean, simple interface  
✅ **Permission Handling**: Prompts user for notification permission on load  
✅ **Schedule Notifications**: Schedule notifications 1-2 minutes in the future  
✅ **Time Picker**: Allow users to choose custom notification time  
✅ **Foreground Notifications**: Notifications appear even when app is in foreground  
✅ **Graceful Error Handling**: Handles permission denial and missing dependencies  

## Requirements

- Expo SDK (latest stable)
- Notifee for notifications
- Development build (Notifee doesn't work in Expo Go)

## Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Since Notifee requires native code, you need to create a development build**:

   ### Option A: Local Development Build
   ```bash
   # For iOS
   npx expo run:ios
   
   # For Android
   npx expo run:android
   ```

   ### Option B: EAS Build (Recommended)
   ```bash
   # Install EAS CLI if you haven't already
   npm install -g eas-cli
   
   # Login to Expo
   eas login
   
   # Build development version
   eas build --profile development --platform ios
   # or
   eas build --profile development --platform android
   ```

3. **Install the development build** on your device and run:
   ```bash
   npx expo start --dev-client
   ```

## How It Works

### App Flow:
1. **On Load**: App automatically requests notification permission
2. **Permission Granted**: User can schedule notifications
3. **Permission Denied**: Shows error message with option to open settings
4. **Schedule Notification**: 
   - Default: 2 minutes from current time
   - Custom: User can pick any future time using DateTimePicker
5. **Notification Delivery**: Appears even when app is in foreground

### Key Features:
- **Permission Status Indicator**: Shows current permission state
- **Time Selection**: Tap to choose custom notification time
- **Schedule Button**: Only enabled when permission is granted
- **Cancel Option**: Cancel scheduled notifications
- **Status Messages**: Clear feedback on scheduling success

## Technical Details

### Dependencies:
- `@notifee/react-native`: For local notifications
- `@react-native-community/datetimepicker`: For time selection
- Expo SDK 52+

### Platform Support:
- **iOS**: Full support with foreground presentation options
- **Android**: Full support with notification channels

### Error Handling:
- Graceful fallback when Notifee is not available
- Permission denial handling with settings redirection
- Clear error messages for troubleshooting

## Troubleshooting

### "Notifee Not Available" Error:
This is expected in Expo Go. Notifee requires native code access and only works in development/production builds.

**Solution**: Create a development build using the instructions above.

### Notifications Not Appearing:
1. Check if permission is granted in the app
2. Verify device notification settings
3. Ensure you're using a development build, not Expo Go

### Build Issues:
- Make sure you have the latest Expo CLI
- For Android: Ensure Java JDK 11+ is installed
- For iOS: Ensure Xcode and iOS Simulator are up to date

## Code Structure

```
src/
├── App.js                 # Main app component
├── app.json              # Expo configuration with Notifee plugin
├── eas.json              # EAS build configuration
└── package.json          # Dependencies
```

## App Screenshots

The app features:
- Clean, modern UI with status indicators
- Permission request handling
- Time picker for custom scheduling
- Real-time status updates
- Comprehensive error handling

## Development Notes

- The app is designed to work with Expo's managed workflow
- Notifee plugin is configured in `app.json`
- EAS build configuration supports JDK 11 for Android builds (required by Notifee)
- Comprehensive error handling for both development and production scenarios
