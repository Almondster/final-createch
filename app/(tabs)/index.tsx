import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '130505613021-97rl6g2j8ldf6hrrc7ca8erdohn9brs8.apps.googleusercontent.com1', 
});

const Index = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUserInfo(response.data)
      } else {
        console.log('Sign-in was cancelled by user.');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Sign-in is in progress.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Play services not available or outdated,');
            break;
          default:
        }
      } else {
        Alert.alert('An error that is unrelated to Google Sign-in has occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Index</Text>
      <Button title='Sign in with Google' onPress={handleGoogleSignIn} />
      <GoogleSigninButton
      style={{ width: 212, height: 48 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleGoogleSignIn}
      />
    </View>
  );
}

export default Index 

const styles = StyleSheet.create({
  container: {
    flex: 1, // This makes the container take up the whole screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Example background color
  }
});