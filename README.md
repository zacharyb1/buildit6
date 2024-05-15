# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


## Some info I found on forums

The best approach would be to bundle the model with your app using the bundleResourceIO method. Here's why:
Simplicity: Bundling the model with your app is the simplest method and doesn't require dealing with AsyncStorage limits or filesystem access.
No Need for Dynamic Loading: Since you're comparing two specific videos, you don't need to dynamically load different models at runtime. You can bundle the specific model you need with your app.
Offline Access: Bundling the model with your app ensures that the model is available even if the user is offline.




#I tried to align these but faced dependency hell and went back to current versions. 
https://github.com/tensorflow/tfjs-examples/tree/master/react-native
If the demo app crashes on startup, it is highly likely caused by incompatible package versions, specifically expo-gl and react-native. As of Jan 2022, the following version combination should work. It is tested on iPhone 13 Pro Max with iOS 15.1.1 and Pixel 2 with Android 9:

"expo": "~44.0.2",
"expo-camera": "^12.1.0",
"expo-file-system": "^13.2.0",
"expo-gl": "^11.1.1",
"expo-gl-cpp": "^11.1.0",
"react": "17.0.1",
"react-native": "~0.64.3",