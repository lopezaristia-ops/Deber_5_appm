// Input con estilo pastel reutilizable
import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { PASTEL } from '../constants/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export const PastelInput: React.FC<Props> = ({ label, error, style, ...props }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      placeholderTextColor={PASTEL.textLight}
      {...props}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: PASTEL.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: PASTEL.white,
    borderWidth: 1.5,
    borderColor: PASTEL.purple2,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: PASTEL.text,
  },
  inputError: { borderColor: PASTEL.pink1 },
  error: { fontSize: 12, color: PASTEL.pink1, marginTop: 4, marginLeft: 4 },
});
