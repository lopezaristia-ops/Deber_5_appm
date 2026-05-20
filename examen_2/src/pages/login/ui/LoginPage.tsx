import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Alert, TouchableOpacity, ScrollView
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useLogin } from "@/features/auth/model/useLogin";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useGoogleLogin } from "@/features/auth/model/useGoogleLogin";
import { LinearGradient } from 'expo-linear-gradient';import { Ionicons } from '@expo/vector-icons';import { PASTEL } from "../../../../constants/colors";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordChanged, setShowPasswordChanged] = useState(false);
  const login = useLogin();
  const { loginWithGoogle, loading: googleLoading, error: googleError } = useGoogleLogin();
  const params = useLocalSearchParams<{ passwordChanged?: string }>();

  useEffect(() => {
    if (params.passwordChanged === "true") {
      setShowPasswordChanged(true);
      setTimeout(() => setShowPasswordChanged(false), 5000);
    }
  }, [params.passwordChanged]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Completa email y contraseña.");
      return;
    }
    try {
      await login.mutateAsync({ email, password });
      // Pequeña espera para que se guarde la sesión
      setTimeout(() => {
        router.replace("/home");
      }, 100);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Credenciales incorrectas.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <LinearGradient colors={[PASTEL.blue3, PASTEL.purple3, PASTEL.pink3]} style={styles.gradientBackground}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {showPasswordChanged && (
            <View style={styles.successBanner}>
              <Ionicons name="lock-closed-outline" size={20} color="#fff" />
              <Text style={styles.successText}>Tu contraseña ha sido cambiada exitosamente</Text>
            </View>
          )}
          <View style={styles.card}>
            <LinearGradient colors={[PASTEL.blue2, PASTEL.purple2]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="bag-outline" size={44} color="#fff" style={styles.logoIcon} />
              <Text style={styles.title}>Boutique Aurora</Text>
              <Text style={styles.subtitle}>Inicia sesión en tu tienda pastel</Text>
            </LinearGradient>
            <View style={styles.form}>
              <Input label="Correo electrónico" value={email} onChangeText={setEmail}
                keyboardType="email-address" placeholder="tu@correo.com" />
              <Input label="Contraseña" value={password} onChangeText={setPassword}
                secureTextEntry placeholder="Tu contraseña" />
              <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}
                style={{ alignSelf:"flex-end" }}>
                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
              <Button onPress={handleLogin} isLoading={login.isPending} label="Iniciar sesión" />
              <Button onPress={loginWithGoogle} isLoading={googleLoading} label="Continuar con Google" variant="ghost" />
              {googleError && <Text style={styles.googleError}>{googleError}</Text>}
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}
                style={{ alignItems:"center" }}>
                <Text style={styles.linkMuted}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.linkHighlight}>Regístrate</Text>
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
  container: { flex:1 },
  gradientBackground: { flex: 1 },
  scroll:    { flexGrow:1, justifyContent:"center", padding:24 },
  card:      { backgroundColor: PASTEL.white, borderRadius:24,
               overflow:"hidden", shadowColor:"#000", shadowOpacity:0.08,
               shadowRadius:24, shadowOffset:{ width:0, height:10 }, elevation:12 },
  header:    { padding:32, alignItems:"center" },
  logo:      { fontSize:52, marginBottom:12 },
  logoIcon:  { marginBottom:12 },
  title:     { color:"#fff", fontSize:26, fontWeight:"700", marginBottom:4 },
  subtitle:  { color:"rgba(255,255,255,0.85)", fontSize:14, textAlign:"center" },
  form:      { padding:28, gap:16 },
  link:      { color: PASTEL.purple1, fontSize:14 },
  linkMuted: { color: PASTEL.textLight, fontSize:14 },
  successBanner: { backgroundColor: PASTEL.purple1, padding: 16, borderRadius: 16, marginBottom: 16 },
  successText: { color: "#fff", fontSize: 14, textAlign: "center", fontWeight: "600" },
});