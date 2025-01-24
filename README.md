# Expo Static Server

This POC demonstrates the use of [react-native-static-server](https://github.com/birdofpreyru/react-native-static-server)
using Expo 52 and EAS Build on the New Architecture.

Under the hood the library uses a lightweight HTTP server called lighttpd, written in C, which comes bundled
with the library. It will be started on the native side using bindings from iOS or Android (using System.loadLibrary to 
dynamically using the Java Native Interface).

## Instructions

To reproduce this example from scratch:

- `npx create-expo-app@latest --template blank-typescript`
- choose a project name
- `cd` into the project
- Run `yarn` and remove the `package-lock.json` to install dependencies using Yarn
- You can now run the app using `yarn start` in your Simulator or Emulator, using Expo Go
- However, we want to be able build this project as a standalone app, so we need to use expo-dev-client
- If you haven't set up EAS before, run: `npm install -g eas-cli`, then `eas login` to your Expo account
  (create one on expo.dev if you don't have one) and then run `eas build:configure` and follow the instructions
  to create a new `eas.json` file
- Add the following dependencies: `yarn add expo-dev-client expo-document-picker expo-build-properties @dr.pogodin/react-native-static-server @dr.pogodin/react-native-fs`
- To your `app.json` file, add the following to the plugins section:

```json
"plugins": [
  [
    "expo-build-properties",
    {
      "android": {
        "minSdkVersion": 28
      }
    }
  ]
]
```
- In your `eas.json`, replace your `development` section with the following snippet:
```json
"development": {
  "developmentClient": true,
  "distribution": "internal",
  "ios": {
    "resourceClass": "m-medium"
  },
  "env": {
    "APP_ENV": "development"
  }
},
"development:device": {
  "extends": "development",
  "ios": {
    "simulator": false
  }
},
"development:simulator": {
  "extends": "development",
  "ios": {
    "simulator": true
  }
},
```
- To your `package.json` scripts section, add the following build scripts:
```js
"build:simulator:android": "eas build --profile development:simulator --platform ios --message $(git symbolic-ref --short HEAD) --local",
"build:simulator:ios": "eas build --profile development:simulator --platform ios --message $(git symbolic-ref --short HEAD) --local",
"build:device:android": "eas build --profile development:device --platform android --message $(git symbolic-ref --short HEAD) --local",
"build:device:ios": "eas build --profile development:device --platform ios --message $(git symbolic-ref --short HEAD) --local"
```
- Copy the `App.tsx` contents from this project to yours
- Now run `yarn build:simulator:ios` to build the app for the iOS simulator
