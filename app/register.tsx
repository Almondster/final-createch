import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);

  const emailError = useMemo(() => {
    if (!email.trim()) return 'Email is required';
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email.trim()) ? '' : 'Enter a valid email';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be 8 or more characters';
    return '';
  }, [password]);

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
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Incomplete form', 'First Name and Last Name are required.');
      return;
    }
    if (emailError || passwordError) {
      Alert.alert('Incomplete form', `${emailError}\n${passwordError}`);
      return;
    }
    if (!birthDate) {
      Alert.alert('Incomplete form', 'Please select your Birth of Date.');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Incomplete form', 'Please provide your phone number.');
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.logo}>
              CREA<Text style={styles.logoAccent}>TECH</Text>
            </Text>
            <Text style={styles.heroTitle}>Register</Text>
            <Text style={styles.heroSubtitle}>
              Already have an account?{' '}
              <Pressable onPress={() => router.replace('/')}>
                <Text style={styles.inlineLink}>Log In</Text>
              </Pressable>
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
              />
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Birth of date</Text>
              <Pressable style={[styles.input, styles.pickerInput]} onPress={openDatePicker}>
                <Text style={[styles.birthDateText, !birthDate && { color: '#9AA0A6' }]}>
                  {birthDateLabel}
                </Text>
                <Feather name="calendar" size={18} color="#94A3B8" />
              </Pressable>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneRow}>
                <Pressable style={styles.flagButton} onPress={() => setShowCountryModal(true)}>
                  <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                  <Feather name="chevron-down" size={16} color="#374151" />
                </Pressable>
                <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="9XX-XXX-XXXX"
                  placeholderTextColor="#9AA0A6"
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Set Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="********"
                  placeholderTextColor="#9AA0A6"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword((prev) => !prev)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#6B7280" />
                </Pressable>
              </View>
              {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            </View>

            <Pressable onPress={handleSignUp}>
              <LinearGradient colors={['#387BFF', '#1155FF']} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              </LinearGradient>
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
    backgroundColor: '#0D0D0D',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
  },
  logoAccent: {
    color: '#2D7BFF',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
    marginTop: 24,
  },
  heroSubtitle: {
    color: '#D1D5DB',
    fontSize: 15,
    marginTop: 8,
  },
  inlineLink: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#1F2933',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  pickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  birthDateText: {
    fontSize: 16,
    color: '#111827',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
  },
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginRight: 6,
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
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
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
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  countryFlag: {
    fontSize: 22,
    marginRight: 12,
  },
  countryName: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  countryDial: {
    fontSize: 13,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
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
    borderRadius: 20,
    width: '100%',
    padding: 12,
  },
  datePickerClose: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  datePickerCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


