#!/bin/bash

# This script auto-generates a key in case
# the one we use was deleted
#
# For more information, refer to docs/EXPORT.md

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "USAGE: ./genkey.sh NAME PASSWORD"
    exit 1
fi

keytool -genkey -v -keystore "$1.keystore" -alias "$1" -keyalg RSA -keysize 2048 -validity 10000
echo "Key generated: $1.keystore"

mv "$1.keystore" android/app
echo "Key moved to android/app/ directory"

echo """
Write this in android/app/build.gradle:

signingConfigs {
  release {
    storeFile file('$1.keystore')
    storePassword '$2'
    keyAlias '$1'
    keyPassword '$2'
  }
}
buildTypes {
  release {
    ....
    signingConfig signingConfigs.release
  }
}
"""

mkdir -p android/app/src/main/assets
echo "Directory android/app/src/main/assets was created"
