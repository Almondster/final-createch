import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { REMEMBER_KEY } from '@/constants/storage';

export default function HomeScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await SecureStore.deleteItemAsync(REMEMBER_KEY);
      router.replace('/');
    } catch (error) {
      Alert.alert('Sign out failed', 'Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to CREATECH</Text>
      <Text style={styles.subtitle}>
        You are now signed in. This is your placeholder home screen – replace it with dashboard
        widgets, quick actions, or product content when you connect to your backend.
      </Text>
      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  signOutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  signOutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});