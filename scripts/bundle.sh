#!/bin/bash
#
# This script bundles the nexly created key
# with the application.

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "USAGE: ./script/bundle.sh [-d]"
    echo "-d: in case of dupplicate assets, delete the assets dir before bundling"
    exit 0
fi

ASSETSDIR="android/app/src/main/res/"
if [ "$1" = "--del-assets" ]; then
    rm -rf "$ASSETSDIR"
fi

npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest "$ASSETSDIR"

echo "Application bundled."

cd android/ && ./gradlew assembleRelease && cp app/build/outputs/apk/release/app-release.apk ..
echo "Release assembled. You may find your APK file at the root of the project"
exit 0
