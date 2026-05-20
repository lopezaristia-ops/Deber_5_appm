// Fondo degradado reutilizable con colores pastel
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewStyle } from 'react-native';
import { PASTEL } from '../constants/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
}

export const GradientBackground: React.FC<Props> = ({
  children,
  style,
  colors = [PASTEL.blue3, PASTEL.purple3, PASTEL.pink3],
}) => (
  <LinearGradient
    colors={colors}
    style={[styles.container, style]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});
