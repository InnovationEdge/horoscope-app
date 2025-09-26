import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Layout, Typography } from '../../constants/theme';
import { BottomNav } from '../../components/BottomNav';
import { router, useSegments } from 'expo-router';

export default function CompatibilityScreen() {
  const segments = useSegments();
  const currentTab = segments[1] || 'compat';

  const handleTabPress = (tab: string) => {
    if (tab === 'compat') {
      router.push('/(tabs)/compat');
    } else {
      router.push(`/(tabs)/${tab}`);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[Colors.bg.top, Colors.bg.bottom]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Compatibility</Text>
            <Text style={styles.subtitle}>Coming Soon</Text>
          </View>
        </LinearGradient>

        <BottomNav activeTab={currentTab} onTabPress={handleTabPress} />
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.screenPadding,
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.text.primary,
    fontSize: 32,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    marginTop: 16,
  },
});