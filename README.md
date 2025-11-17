# Installation Instructions

## 🔑 Debug Keystore

To list the debug keystore details, run:

```sh
keytool -keystore ./android/app/debug.keystore -list -v
# Password: android
```

## 📦 Install Dependencies

Run the following commands separately to install all required dependencies.

### React Navigation, Expo Router, and Core Libraries

```sh
npx expo install \
  @react-navigation/native \
  @react-navigation/stack \
  expo-router \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler \
  react-native-reanimated \
  expo-image \
  expo-secure-store \
  expo-crypto \
  expo-web-browser \
  @expo/vector-icons \
  @react-native-community/datetimepicker
```

### Expo Modules

```sh
npx expo install \
  expo \
  expo-auth-session \
  expo-constants \
  expo-font \
  expo-haptics \
  expo-linear-gradient \
  expo-linking \
  expo-splash-screen \
  expo-status-bar \
  expo-symbols \
  expo-system-ui
```

### React and React Native

```sh
npx expo install react react-dom react-native
```

### TypeScript Types

```sh
npm install -D @types/react @types/react-native
```

```
```