# How to generate APK file from this react native project

## Dependencies

First, ensure the project runs correctly on your emulator. To do so, you must at least have `adb` installed, but the easiest way is to use Android Studio. Here are the versions you're going to need:
- Java (JDK) 18,  
- Gradle 7.5.1  
  
> If you struggle switching Java/JDK version, you may want to use `SDKMAN`, which is a software that allows multiple versions of Java to be installed and to switch between the ones you want to use.
  
> Those steps were tested with Android Studio Giraffe (2022.3.1). I cannot assure it will work the same way with another version.
Also note that this tutorial was made for Android. I do not have a Mac, therefore, I cannot try the installation on an IOS system.

### Install dependencies

You need NodeJs and NPM: 
```bash
npm i
```
Start the dev server:
```bash
react-native start
```
It should display a logo with a welcoming message "Welcome to Metro".
Then, install the application on your emulator:
```bash
npx react-native run-android # for android
npx react-native run-ios     # for IOS
```

Normally, the application should now be installed and running on your emulator.

> If you want to use your physical device, you may follow those steps :

- Install `adb` on your computer  
- Enable "USB Debugging" under "Developper options" on your device. See on the internet how to enable developper options for your device,  
- Once your device is plugged to your computer, enter the command `adb devices`. It should display the name of your phone (or a random string) and the word "device". If it displays "unavailable", there is a problem,  
- Then, you can enter the previous commands `react-native start` and `npx react-native run-android`  

## Keystore

### Generate it

Normally, a keystore was already generated, but as we're not exactly sure what it is and how it works yet, I let you the steps to generate another if needed:  

- `keytool -genkey -v -keystore NAME.keystore -alias ALIAS_NAME -keyalg RSA -keysize 2048 -validity 10000` where you can replace `NAME` and `ALIAS_NAME` with whatever name you want your keystore to be called,  
- Make sure to remember your password. The password of the current key is `sampleKeyPassw0rd`,  

Once you completed the steps, you may find a `NAME.keystore` file at the root of your project.

### Add it to the project

You first have to move the key to the `android/app` directory:  
```bash
mv NAME.keystore android/app # In case you forgot how to move a file (day 2 of C-pool)
```
Then, under the `android/app/build.gradle` file, you may fill those lines:
```kotlin
android {
...
  signingConfigs {
    release {
      storeFile file('NAME.keystore')
      storePassword 'PASSWORD'
      keyAlias 'ALIAS_NAME'
      keyPassword 'PASSWORD'
    }
  }
  buildTypes {
    release {
      ....
      signingConfig signingConfigs.release
    }
  }
}
```

> Note that you can also ask for the password by user input, in order not to store the password in this file for security reasons. See `System.console().readLine()` function.

Make sure the `android/app/src/main/assets` exists. If not, create it:
```bash
mkdir android/app/src/main/assets # Also day 2 of C-pool :)
```

Finally, let's bundle the key and the project together, using this command:  
```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

> Note that if your entry point is not `index.js`, you may need to modify the command.

## Release APK generation

That's the part where, if you have problems, your screen is going to turn red. That's the fun part, isn't it ?  
Follow those steps to generate the APK file:  
  
- Place yourself in the `android` directory,  
- Use the gradlew binary to create a release version of your application:
```bash
# On Windows
gradlew assembleRelease
# On Linux
./gradlew assembleRelease
```

If no problem was thrown, you may find your APK file under `android/app/build/outputs/apk/release/app-release.apk`. Congrats !

# Q&A

You may encounter problems, and so did I. Here are some issues I had to face and how to solve them.

## Res problem

If you encounter this problem:
```bash
:app:processReleaseResources FAILED
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ‘:app:processReleaseResources’.
> com.android.ide.common.process.ProcessException: Failed to execute aapt
```
Saying there is a dupplicate resource, you need to delete all the `android/app/src/main/res` directory:
```bash 
rm -rf app/src/main/res
```
And try again.

# Thanks
You can find all the information you need on [this website](https://instamobile.io/android-development/generate-react-native-release-build-android/).

> You can also do it using Android Studio, without the command line, and you'll find the steps to do so on the website.
