import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BirthDate() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Birth Date Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0B1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});
