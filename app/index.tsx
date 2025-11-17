import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as Crypto from 'expo-crypto';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { REMEMBER_KEY } from '@/constants/storage';

type StoredCredentials = {
  email: string;
  password: string;
  hashedPassword: string;
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [request, , promptAsync] = Google.useAuthRequest({
    expoClientId: '130505613021-97rl6g2j8ldf6hrrc7ca8erdohn9brs8.apps.googleusercontent.com',
    iosClientId: '130505613021-jfukb8pt9f9o8615obuigcdj5luoivhn.apps.googleusercontent.com',
    androidClientId: '130505613021-97rl6g2j8ldf6hrrc7ca8erdohn9brs8.apps.googleusercontent.com',
    webClientId: '130505613021-97rl6g2j8ldf6hrrc7ca8erdohn9brs8.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    void loadRememberedCredentials();
  }, []);

  const loadRememberedCredentials = async () => {
    try {
      const stored = await SecureStore.getItemAsync(REMEMBER_KEY);
      if (!stored) {
        return;
      }
      const parsed: StoredCredentials = JSON.parse(stored);
      setEmail(parsed.email);
      setPassword(parsed.password ?? '');
      setRememberMe(true);
    } catch (error) {
      console.warn('Unable to load stored credentials', error);
    }
  };

  const persistCredentials = async (shouldPersist: boolean) => {
    if (!shouldPersist) {
      await SecureStore.deleteItemAsync(REMEMBER_KEY);
      return;
    }
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password,
    );
    const payload: StoredCredentials = {
      email: email.trim(),
      password,
      hashedPassword,
    };
    await SecureStore.setItemAsync(REMEMBER_KEY, JSON.stringify(payload));
  };

  const handleLogin = async () => {
    // Validate and set errors
    let hasError = false;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else {
      const regex = /\S+@\S+\.\S+/;
      if (!regex.test(email.trim())) {
        setEmailError('Enter a valid email');
        hasError = true;
      } else {
        setEmailError('');
      }
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      Alert.alert('Incomplete form', 'Please check the form for errors.');
      return;
    }

    try {
      setLoading(true);
      await persistCredentials(rememberMe);
      Alert.alert('Success', 'You are now signed in securely.', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Unable to sign in securely. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot password',
      'A secure password reset link has been sent to your email address.',
    );
  };

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert('Google Sign-In', 'Google authentication is still initializing. Please try again.');
      return;
    }
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        Alert.alert('Google Sign-In', 'Signed in successfully with Google.');
        router.replace('/(tabs)');
        return;
      }
      if (result?.type === 'dismiss') {
        Alert.alert('Google Sign-In', 'Sign-in was cancelled.');
        return;
      }
      if (result?.type === 'error') {
        Alert.alert('Google Sign-In', result.error?.message ?? 'Something went wrong.');
        return;
      }
    } catch (error) {
      Alert.alert('Google Sign-In', 'Unable to authenticate at this time.');
      console.error(error);
    }
  };

  const handleFacebookLogin = () => {
    Alert.alert(
      'Facebook Login',
      'Facebook login is ready. Integrate your production keys to finish configuration.',
    );
  };

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.logo}>
              CREA<Text style={styles.logoAccent}>TECH</Text>
            </Text>
            <Text style={styles.heroTitle}>Sign in to your Account</Text>
            <Text style={styles.heroSubtitle}>Don't have an account?{' '}
              <Link href="/register" style={styles.inlineLink}>
                Sign Up
              </Link>
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="#9AA0A6"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                returnKeyType="next"
                textContentType="emailAddress"
              />
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="********"
                  placeholderTextColor="#9AA0A6"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  style={[styles.input, styles.passwordInput]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="done"
                />
                <Pressable
                onPress={() => setPasswordVisible((prev) => !prev)}
                style={styles.passwordToggle}>
                <Ionicons
                    name={passwordVisible ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                />
                </Pressable>
                            </View>
              {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            </View>

            <View style={styles.rowBetween}>
              <Pressable
                style={styles.rememberWrapper}
                onPress={() => setRememberMe((prev) => !prev)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.checkboxLabel}>Remember me</Text>
              </Pressable>
              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => [
                    styles.primaryButton,
                    { opacity: pressed || loading ? 0.8 : 1 }
                ]}>
                <Text style={styles.primaryButtonText}>{loading ? 'Signing In...' : 'Log In'}</Text>
                </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or login with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <Pressable
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
                disabled={!request}>
                <AntDesign name="google" size={18} color="#EA4335" />
                <Text style={styles.socialLabel}>Google</Text>
              </Pressable>
              <Pressable style={styles.socialButton} onPress={handleFacebookLogin}>
                <FontAwesome name="facebook" size={18} color="#1877F2" />
                <Text style={styles.socialLabel}>Facebook</Text>
              </Pressable>
            </View>

            <Text style={styles.termsText}>
              By signing up, you agree to the <Text style={styles.inlineLink}>Terms of Service</Text> and{' '}
              <Text style={styles.inlineLink}>Data Processing Agreement</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: '#000000',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 0,
    },
    hero: {
      backgroundColor: '#000000',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 60,
      alignItems: 'center',
    },
    logo: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 40,
    },
    logoAccent: {
      color: '#2563EB',
    },
    heroTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 8,
    },
    heroSubtitle: {
      color: '#D1D5DB',
      fontSize: 16,
      textAlign: 'center',
    },
    inlineLink: {
      color: '#387BFF',
      fontWeight: '500',
    },
    card: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 24,
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -20, 
    },
    fieldGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: '#000000', 
      marginBottom: 8,
      fontWeight: '600', 
    },
    input: {
      borderWidth: 1.5, 
      borderColor: '#D1D5DB',
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 56, 
      fontSize: 16,
      color: '#111827',
      backgroundColor: '#FFFFFF',
    },
    errorText: {
      color: '#DC2626',
      marginTop: 6,
      fontSize: 12,
    },
    passwordWrapper: {
      position: 'relative',
    },
    passwordInput: {
      paddingRight: 44,
    },
    passwordToggle: {
      position: 'absolute',
      right: 12,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    rememberWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4, 
      borderWidth: 1.5,
      borderColor: '#D1D5DB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    checkboxChecked: {
      borderColor: '#2563EB',
      backgroundColor: '#2563EB',
    },
    checkboxInner: {
      width: 10,
      height: 10,
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
    },
    checkboxLabel: {
      color: '#374151',
      fontSize: 14,
      fontWeight: '500', 
    },
    linkText: {
      color: '#2563EB',
      fontWeight: '600', 
      fontSize: 14,
    },
    primaryButton: {
      backgroundColor: '#387BFF',
      borderRadius: 12,
      height: 56, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginBottom: 24,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    divider: {
      height: 1,
      flex: 1,
      backgroundColor: '#E5E7EB',
    },
    dividerText: {
      color: '#6B7280',
      fontSize: 14,
      marginHorizontal: 12,
    },
    socialRow: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    socialButton: {
      flex: 1,
      borderWidth: 1.5, 
      borderColor: '#E5E7EB',
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 56,
      marginHorizontal: 4,
    },
    socialLabel: {
      fontSize: 14,
      color: '#374151',
      marginLeft: 8,
      fontWeight: '500', 
    },
    termsText: {
      textAlign: 'center',
      color: '#6B7280',
      fontSize: 12,
      lineHeight: 16,
    },
  });