// Botón reutilizable con gradiente pastel - Usa Tamagui + Lottie (carga) + expo-linear-gradient (gradiente)
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PASTEL } from '../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  colors?: string[];
  style?: ViewStyle;
  disabled?: boolean;
  showBorder?: boolean;
}

export const PastelButton: React.FC<Props> = ({
  title,
  onPress,
  loading = false,
  colors = [PASTEL.purple1, PASTEL.pink1],
  style,
  disabled = false,
  showBorder = true,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    style={[styles.wrapper, showBorder && styles.border, style]}
  >
    <LinearGradient
      colors={colors}
      style={styles.btn}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: { borderRadius: 24, overflow: 'visible' },
  border: { borderWidth: 2, borderColor: PASTEL.purple1 },
  btn: { paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center', borderRadius: 24 },
  text: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
});
