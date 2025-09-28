import React from 'react';
import { Tabs } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="today" />
      <Tabs.Screen name="traits" />
      <Tabs.Screen name="compat" />
      <Tabs.Screen name="druid" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
