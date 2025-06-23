import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Circle } from 'react-native-svg';

export default function CustomBeeIcon({ size = 80 }: { size?: number }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size * 0.8}
        height={size * 0.8}
        viewBox="0 0 100 100"
        style={styles.svg}
      >
        {/* Bee Body - Main oval */}
        <Ellipse
          cx="50"
          cy="55"
          rx="15"
          ry="25"
          fill="#FFD700"
          stroke="#000"
          strokeWidth="2"
        />
        
        {/* Bee Stripes */}
        <Ellipse
          cx="50"
          cy="45"
          rx="13"
          ry="4"
          fill="#000"
        />
        <Ellipse
          cx="50"
          cy="55"
          rx="13"
          ry="4"
          fill="#000"
        />
        <Ellipse
          cx="50"
          cy="65"
          rx="13"
          ry="4"
          fill="#000"
        />
        
        {/* Bee Head */}
        <Circle
          cx="50"
          cy="30"
          r="12"
          fill="#FFD700"
          stroke="#000"
          strokeWidth="2"
        />
        
        {/* Antennae */}
        <Path
          d="M45 22 Q42 18 38 16"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M55 22 Q58 18 62 16"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        <Circle cx="38" cy="16" r="2" fill="#000" />
        <Circle cx="62" cy="16" r="2" fill="#000" />
        
        {/* Wings */}
        <Ellipse
          cx="35"
          cy="40"
          rx="12"
          ry="18"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          transform="rotate(-20 35 40)"
        />
        <Ellipse
          cx="65"
          cy="40"
          rx="12"
          ry="18"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          transform="rotate(20 65 40)"
        />
        
        {/* Inner wing details */}
        <Ellipse
          cx="35"
          cy="40"
          rx="6"
          ry="12"
          fill="none"
          stroke="#000"
          strokeWidth="1"
          transform="rotate(-20 35 40)"
        />
        <Ellipse
          cx="65"
          cy="40"
          rx="6"
          ry="12"
          fill="none"
          stroke="#000"
          strokeWidth="1"
          transform="rotate(20 65 40)"
        />
        
        {/* Eyes */}
        <Circle cx="46" cy="28" r="2" fill="#000" />
        <Circle cx="54" cy="28" r="2" fill="#000" />
        
        {/* Legs */}
        <Path
          d="M40 65 Q35 70 30 72"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M45 70 Q42 75 38 77"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M55 70 Q58 75 62 77"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M60 65 Q65 70 70 72"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    // SVG styles if needed
  },
}); 