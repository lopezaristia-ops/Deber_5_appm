import { View, Text, TextInput, StyleSheet } from "react-native";
import { PASTEL } from "../../../constants/colors";

interface InputProps {
  label:            string;
  value:            string;
  onChangeText:     (t: string) => void;
  placeholder?:     string;
  secureTextEntry?: boolean;
  keyboardType?:    "default" | "email-address" | "numeric";
  error?:           string;
  autoCapitalize?:  "none" | "sentences" | "words";
}

export const Input = ({
  label, value, onChangeText, placeholder,
  secureTextEntry, keyboardType = "default", error,
  autoCapitalize = "none",
}: InputProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      style={[styles.input, error ? styles.inputError : null]}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  wrapper:    { gap:6 },
  label:      { fontSize:14, fontWeight:"600", color:PASTEL.text },
  input:      { borderWidth:1.5, borderColor:PASTEL.purple2, borderRadius:14,
                paddingHorizontal:16, paddingVertical:14, fontSize:15,
                color:PASTEL.text, backgroundColor:PASTEL.white },
  inputError: { borderColor:PASTEL.pink1 },
  error:      { fontSize:12, color:PASTEL.pink1 },
});