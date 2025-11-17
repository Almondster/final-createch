import { Feather, Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';


type Country = {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { code: 'PH', dialCode: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const birthDateLabel = birthDate
    ? birthDate.toLocaleDateString('en-GB')
    : 'DD/MM/YYYY';

  const handleBirthDateSelection = (_event: unknown, selected?: Date) => {
    if (selected) {
      setBirthDate(selected);
    }
    if (Platform.OS === 'android') {
      return;
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: birthDate ?? new Date(2000, 0, 1),
        onChange: handleBirthDateSelection,
        mode: 'date',
        maximumDate: new Date(),
      });
    } else {
      setShowDateModal(true);
    }
  };

  const handleSignUp = () => {
    let hasError = false;

    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Incomplete form', 'First Name and Last Name are required.');
      return;
    }

    // Validate email
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

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be 8 or more characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (!birthDate) {
      Alert.alert('Incomplete form', 'Please select your Birth of Date.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Incomplete form', 'Please provide your phone number.');
      return;
    }

    if (hasError) {
      Alert.alert('Incomplete form', 'Please check the form for errors.');
      return;
    }

    Alert.alert(
      'Registration complete',
      'Your secure account is ready. Use your credentials to sign in.',
      [{ text: 'Continue to Login', onPress: () => router.replace('/') }],
    );
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <Pressable
      style={styles.countryRow}
      onPress={() => {
        setSelectedCountry(item);
        setShowCountryModal(false);
      }}>
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryDial}>{item.dialCode}</Text>
      </View>
      {item.code === selectedCountry.code && (
        <Feather name="check" size={18} color="#2563EB" />
      )}
    </Pressable>
  );

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.hero}>
            <Text style={styles.logo}>
              CREA<Text style={styles.logoAccent}>TECH</Text>
            </Text>
            <Text style={styles.heroTitle}>Register</Text>
            <Text style={styles.heroSubtitle}>
              Already have an account?{' '}
              <Text style={styles.inlineLink} onPress={() => router.replace('/')}>
                Log In
              </Text>
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.nameRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  placeholder="Example"
                  placeholderTextColor="#9AA0A6"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    // Focus next field if needed
                  }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  placeholder="Name"
                  placeholderTextColor="#9AA0A6"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="#9AA0A6"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => phoneInputRef.current?.focus()}
              />
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Birth of date</Text>
              <Pressable style={[styles.input, styles.pickerInput]} onPress={openDatePicker}>
                <Text style={[styles.birthDateText, !birthDate && { color: '#9AA0A6' }]}>
                  {birthDateLabel}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
              </Pressable>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <Pressable style={styles.flagButton} onPress={() => setShowCountryModal(true)}>
                  <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                  <Feather name="chevron-down" size={16} color="#374151" />
                </Pressable>
                <Text style={styles.dialCode}>({selectedCountry.dialCode})</Text>
                <TextInput
                  ref={phoneInputRef}
                  style={[styles.input, styles.phoneInput]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="9XX-XXX-XXXX"
                  placeholderTextColor="#9AA0A6"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Set Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  ref={passwordInputRef}
                  placeholder="********"
                  placeholderTextColor="#9AA0A6"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                />
                <Pressable
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword((prev) => !prev)}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
                    </Pressable>
              </View>
              {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  ref={confirmPasswordInputRef}
                  placeholder="********"
                  placeholderTextColor="#9AA0A6"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={[styles.input, styles.passwordInput]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                />
                <Pressable
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword((prev) => !prev)}>
                    <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
                    </Pressable>
              </View>
              {!!confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
            </View>

            <Pressable
                onPress={handleSignUp}
                style={({ pressed }) => [
                    styles.primaryButton,
                    { opacity: pressed ? 0.8 : 1 }
                ]}>
                <Text style={styles.primaryButtonText}>Sign Up</Text>
                </Pressable>
          </View>   
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showCountryModal} animationType="slide" onRequestClose={() => setShowCountryModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select country</Text>
            <Pressable onPress={() => setShowCountryModal(false)}>
              <Feather name="x" size={20} color="#0F172A" />
            </Pressable>
          </View>
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.code}
            renderItem={renderCountryItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Modal>

      <Modal visible={showDateModal} transparent animationType="fade" onRequestClose={() => setShowDateModal(false)}>
        <View style={styles.dateModalBackdrop}>
          <View style={styles.dateModalCard}>
            <DateTimePicker
              value={birthDate ?? new Date(2000, 0, 1)}
              mode="date"
              display="spinner"
              onChange={handleBirthDateSelection}
              maximumDate={new Date()}
              style={{ width: '100%' }}
            />
            <Pressable style={styles.datePickerClose} onPress={() => setShowDateModal(false)}>
              <Text style={styles.datePickerCloseText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
      fontSize: 16,
    },
    card: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40, 
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -20, 
    },
    nameRow: {
      flexDirection: 'row',
      marginBottom: 16,
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
    pickerInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
    },
    birthDateText: {
      fontSize: 16,
      color: '#111827',
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 12,
      height: 56,
    },
    flagButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: '#F9FAFB',
      marginRight: 8,
    },
    flagEmoji: {
      fontSize: 20,
      marginRight: 4,
    },
    dialCode: {
      fontSize: 16,
      color: '#111827',
      marginRight: 8,
      fontWeight: '500',
    },
    phoneInput: {
      flex: 1,
      borderWidth: 0,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      height: '100%',
      fontSize: 16,
      color: '#111827',
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
    primaryButton: {
      backgroundColor: '#387BFF',
      borderRadius: 12,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    errorText: {
      color: '#DC2626',
      marginTop: 6,
      fontSize: 12,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingHorizontal: 4,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
    },
    countryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    countryFlag: {
      fontSize: 24,
      marginRight: 12,
    },
    countryName: {
      fontSize: 16,
      color: '#111827',
      fontWeight: '500',
    },
    countryDial: {
      fontSize: 14,
      color: '#6B7280',
    },
    separator: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginLeft: 44,
    },
    dateModalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    dateModalCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      width: '100%',
      padding: 20,
    },
    datePickerClose: {
      marginTop: 16,
      backgroundColor: '#2563EB',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    datePickerCloseText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });