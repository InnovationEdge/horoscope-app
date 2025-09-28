import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { authService } from '../../services/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email.trim().toLowerCase());
      setEmailSent(true);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <LinearGradient colors={[Colors.bgTop, Colors.bgBot]} style={styles.gradient}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>We've sent password reset instructions to {email}</Text>
              </View>

              <View style={styles.emailSentContainer}>
                <Text style={styles.emailSentIcon}>📧</Text>
                <Text style={styles.emailSentText}>
                  Click the link in the email to reset your password. If you don't see it, check your spam folder.
                </Text>
              </View>

              <Pressable style={styles.backButton} onPress={handleBackToLogin}>
                <Text style={styles.backButtonText}>Back to Login</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={[Colors.bgTop, Colors.bgBot]} style={styles.gradient}>
          <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                  Enter your email address and we'll send you instructions to reset your password
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.textSec}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                <Pressable
                  style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                >
                  <Text style={styles.resetButtonText}>{isLoading ? 'Sending...' : 'Send Reset Instructions'}</Text>
                </Pressable>

                <Pressable style={styles.backToLoginButton} onPress={handleBackToLogin}>
                  <Text style={styles.backToLoginText}>← Back to Login</Text>
                </Pressable>
              </View>
            </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.sectionSpacing * 1.5,
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.textPri,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: Spacing.xl,
  },
  inputContainer: {
    gap: Spacing.sm,
  },
  inputLabel: {
    ...Typography.labelMedium,
    color: Colors.textPri,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    fontSize: 16,
    color: Colors.textPri,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    ...Typography.titleMedium,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    alignItems: 'center',
  },
  backToLoginText: {
    ...Typography.labelMedium,
    color: Colors.primary,
    fontSize: 14,
  },
  emailSentContainer: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding * 1.5,
    marginBottom: Layout.sectionSpacing,
  },
  emailSentIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emailSentText: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    alignItems: 'center',
  },
  backButtonText: {
    ...Typography.titleMedium,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
