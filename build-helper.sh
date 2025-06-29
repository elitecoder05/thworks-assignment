#!/bin/bash

echo "🚀 Notifee Demo App Build Helper"
echo "================================="
echo ""

echo "Select an option:"
echo "1. Run iOS development build (requires Xcode)"
echo "2. Run Android development build (requires Android Studio)"
echo "3. Build with EAS for iOS"
echo "4. Build with EAS for Android"
echo "5. Start development server only"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🍎 Starting iOS development build..."
        npx expo run:ios
        ;;
    2)
        echo "🤖 Starting Android development build..."
        npx expo run:android
        ;;
    3)
        echo "☁️ Building iOS with EAS..."
        npx eas build --profile development --platform ios
        ;;
    4)
        echo "☁️ Building Android with EAS..."
        npx eas build --profile development --platform android
        ;;
    5)
        echo "🖥️ Starting development server..."
        npx expo start --dev-client
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
