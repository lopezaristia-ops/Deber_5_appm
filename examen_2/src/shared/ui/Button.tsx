import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { PASTEL } from "../../../constants/colors";

interface ButtonProps {
  onPress:    () => void;
  label:      string;
  isLoading?: boolean;
  variant?:   "primary" | "ghost" | "danger";
  disabled?:  boolean;
}

export const Button = ({
  onPress, label, isLoading, variant = "primary", disabled
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, styles[variant], isDisabled && styles.disabled]}
      activeOpacity={0.85}
      android_ripple={{ color: "#D1D5DB" }}
    >
      {isLoading
        ? <ActivityIndicator color="#fff" />
        : <Text style={[styles.label, variant === "ghost" && styles.labelGhost]}>{label}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base:        { borderRadius:14, paddingVertical:14, paddingHorizontal:24,
                 alignItems:"center", justifyContent:"center" },
  primary:     { backgroundColor:PASTEL.purple1 },
  ghost:       { backgroundColor:"transparent", borderWidth:2, borderColor:PASTEL.purple2 },
  danger:      { backgroundColor:PASTEL.pink1 },
  disabled:    { opacity:0.5 },
  label:       { color:"#fff", fontSize:16, fontWeight:"700" },
  labelGhost:  { color:PASTEL.text },
});