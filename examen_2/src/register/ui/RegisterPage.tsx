import { theme } from "@/core/styles/theme";
import { useRegister } from "@/features/auth/model/useRegister";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { router } from "expo-router";
import { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PASTEL } from "../../../constants/colors";
import { LoadingLottie } from "../../../components/LoadingLottie";
import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const { register, loading } = useRegister();

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert("Campos requeridos", "Completa todos los campos."); return;
    }
    if (password.length < 8) {
      Alert.alert("Contraseña débil", "Mínimo 8 caracteres."); return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden."); return;
    }
    try {
      await register(email, password);
      setRegisterSuccess(true);
    } catch (err: any) {
      Alert.alert("Error al registrarse", err.message);
    }
  };

  if (registerSuccess) {
    return (
      <View style={styles.successContainer}>
        <LoadingLottie
          source={require('../../../assets/animations/email send.json')}
          size={180}
          loop={false}
        />
        <Ionicons name="mail-open-outline" size={72} color={PASTEL.purple1} style={styles.successIcon} />
        <Text style={styles.successTitle}>Registro exitoso</Text>
        <Text style={styles.successText}>
          Te enviamos un link de confirmación a{" "}
          <Text style={{ fontWeight:"700" }}>{email}</Text>.{"  "}
          Confirma tu cuenta para poder iniciar sesión.
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}> 
          <Text style={styles.link}>← Volver al login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <LinearGradient colors={[PASTEL.blue3, PASTEL.purple3, PASTEL.pink3]} style={styles.gradientBackground}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <LinearGradient colors={[PASTEL.blue2, PASTEL.purple2]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="sparkles-outline" size={44} color="#fff" style={styles.logoIcon} />
              <Text style={styles.title}>Boutique Aurora</Text>
              <Text style={styles.subtitle}>Regístrate y vende tus productos</Text>
            </LinearGradient>
            <View style={styles.form}>
              <Input label="Correo electrónico" value={email} onChangeText={setEmail}
                keyboardType="email-address" placeholder="tu@correo.com" />
              <Input label="Contraseña" value={password} onChangeText={setPassword}
                secureTextEntry placeholder="Mínimo 8 caracteres" />
              <Input label="Confirmar contraseña" value={confirm} onChangeText={setConfirm}
                secureTextEntry placeholder="Repite tu contraseña" />
              <Button onPress={handleRegister} isLoading={loading} label="Crear cuenta" />
              <TouchableOpacity onPress={() => router.back()} style={{ alignItems:"center" }}>
                <Text style={styles.linkMuted}>
                  ¿Ya tienes cuenta?{" "}
                  <Text style={styles.linkHighlight}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:        { flex:1 },
  gradientBackground:{ flex:1 },
  scroll:           { flexGrow:1, justifyContent:"center", padding:24 },
  card:             { backgroundColor: PASTEL.white, borderRadius:24,
                      overflow:"hidden", ...theme.shadow.card },
  header:           { padding:32, alignItems:"center" },
  logo:             { fontSize:52, marginBottom:12 },
  logoIcon:         { marginBottom:12 },
  successIcon:      { marginBottom:24 },
  title:            { color:"#fff", fontSize:26, fontWeight:"700", marginBottom:4 },
  subtitle:         { color:"rgba(255,255,255,0.85)", fontSize:14, textAlign:"center" },
  form:             { padding:28, gap:16 },
  link:             { color: PASTEL.purple1, fontSize:15, fontWeight:"600", marginTop:8 },
  linkMuted:        { color: PASTEL.textLight, fontSize:14 },
  linkHighlight:    { color: PASTEL.purple1, fontWeight:"700" },
  successContainer: { flex:1, backgroundColor: PASTEL.blue3,
                      justifyContent:"center", alignItems:"center", padding:32 },
  successIcon:      { fontSize:72, marginBottom:24 },
  successTitle:     { fontSize:26, fontWeight:"700", color: PASTEL.purple1, marginBottom:16 },
  successText:      { fontSize:16, color: PASTEL.text,
                      textAlign:"center", lineHeight:24, marginBottom:32 },
});