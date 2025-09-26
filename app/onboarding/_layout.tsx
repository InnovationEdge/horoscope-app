import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0D0B1A' } // dark bg per design
      }}
    >
      <Stack.Screen name="splash" />
      {/* signin and others can be added later: signin.tsx, birth-date.tsx, ... */}
    </Stack>
  );
}