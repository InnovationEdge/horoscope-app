import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import type { ZodiacSign } from '../../constants/signs';
import { authService, RegisterData } from '../../services/auth';
import { useUserStore } from '../../store/user';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    marketing_consent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUser } = useUserStore();

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!formData.birth_date) {
      Alert.alert('Error', 'Please enter your birth date');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registrationData: RegisterData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        birth_date: formData.birth_date,
        birth_time: formData.birth_time,
        birth_place: formData.birth_place,
      };

      const authResponse = await authService.register(registrationData);

      const userWithDefaults = {
        ...authResponse.user,
        sign: (authResponse.user.sign || 'aries') as ZodiacSign,
        subscription_status: authResponse.user.is_premium ? ('premium' as const) : ('free' as const),
      };

      setUser(userWithDefaults);

      Alert.alert('Welcome!', 'Your account has been created successfully.', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)/today') },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={[Colors.bgTop, Colors.bgBot]} style={styles.gradient}>
          <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join your cosmic journey</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                    placeholder="Enter your full name"
                    placeholderTextColor={Colors.textSec}
                    autoCapitalize="words"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={text => setFormData(prev => ({ ...prev, email: text }))}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.textSec}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      value={formData.password}
                      onChangeText={text => setFormData(prev => ({ ...prev, password: text }))}
                      placeholder="Enter password"
                      placeholderTextColor={Colors.textSec}
                      secureTextEntry={!showPassword}
                      editable={!isLoading}
                    />
                    <Pressable style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
                      <Text style={styles.passwordToggleText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      value={formData.confirmPassword}
                      onChangeText={text => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                      placeholder="Confirm password"
                      placeholderTextColor={Colors.textSec}
                      secureTextEntry={!showConfirmPassword}
                      editable={!isLoading}
                    />
                    <Pressable
                      style={styles.passwordToggle}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Text style={styles.passwordToggleText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Birth Date</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.birth_date}
                    onChangeText={text => setFormData(prev => ({ ...prev, birth_date: text }))}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Colors.textSec}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Birth Time (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.birth_time}
                    onChangeText={text => setFormData(prev => ({ ...prev, birth_time: text }))}
                    placeholder="HH:MM"
                    placeholderTextColor={Colors.textSec}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Birth Place (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.birth_place}
                    onChangeText={text => setFormData(prev => ({ ...prev, birth_place: text }))}
                    placeholder="City, Country"
                    placeholderTextColor={Colors.textSec}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.checkboxContainer}>
                  <Switch
                    value={formData.marketing_consent}
                    onValueChange={value => setFormData(prev => ({ ...prev, marketing_consent: value }))}
                    trackColor={{ false: Colors.outline, true: Colors.primary }}
                    thumbColor={formData.marketing_consent ? Colors.surface : Colors.textSec}
                  />
                  <Text style={styles.checkboxText}>I agree to receive marketing communications</Text>
                </View>

                <Pressable
                  style={[styles.registerButton, isLoading && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  <Text style={styles.registerButtonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
                </Pressable>

                <Pressable style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                  <Text style={styles.loginButtonText}>Already have an account? Sign In</Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.sectionSpacing,
  },
  title: {
    ...Typography.greeting,
    color: Colors.textPri,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.labelMedium,
    color: Colors.textPri,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  input: {
    ...Typography.bodyMedium,
    backgroundColor: Colors.surface,
    borderRadius: Layout.inputRadius,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPri,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  passwordToggleText: {
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.sectionSpacing,
    paddingHorizontal: Spacing.sm,
  },
  checkboxText: {
    ...Typography.labelSmall,
    color: Colors.textSec,
    marginLeft: Spacing.md,
    flex: 1,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.buttonRadius,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    ...Typography.labelMedium,
    color: 'white',
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  loginButtonText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '500',
  },
});
