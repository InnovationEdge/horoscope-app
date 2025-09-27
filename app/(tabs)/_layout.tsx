import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="test" />
      <Stack.Screen name="today" />
      <Stack.Screen name="traits" />
      <Stack.Screen name="compat" />
      <Stack.Screen name="druid" />
    </Stack>
  );
}
