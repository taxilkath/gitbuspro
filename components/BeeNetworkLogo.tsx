import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BeeNetworkLogo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const logoSize = size === 'small' ? 40 : size === 'large' ? 120 : 80;
  const fontSize = size === 'small' ? 20 : size === 'large' ? 60 : 40;
  const textSize = size === 'small' ? 12 : size === 'large' ? 24 : 16;

  return (
    <View style={styles.container}>
      <View style={[styles.hexagon, { width: logoSize, height: logoSize }]}>
        <Text style={[styles.beeIcon, { fontSize }]}>🐝</Text>
      </View>
      <Text style={[styles.logoText, { fontSize: textSize }]}>BEE NETWORK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  hexagon: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#333',
  },
  beeIcon: {
    // fontSize handled by props
  },
  logoText: {
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1,
  },
});