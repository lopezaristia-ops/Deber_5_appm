import { useState } from "react";
import { theme } from "@/core/styles/theme";
import { useResetPassword } from "@/features/auth/model/useResetPassword";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { router } from "expo-router";
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valError, setValError] = useState("");
  const { status, error, updatePassword, isReady, hasToken } = useResetPassword();

  if (!isReady) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Verificando enlace de recuperación...</Text>
        </View>
      </View>
    );
  }

  const handleSubmit = async () => {
    setValError("");

    if (!password) {
      setValError("Ingresa una contraseña.");
      return;
    }

    if (password.length < 8) {
      setValError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      setValError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await updatePassword(password);
    } catch (err: any) {
      setValError(err.message);
    }
  };

  if (status === "success") {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <Ionicons name="lock-closed-outline" size={72} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.successTitle}>Contraseña actualizada</Text>
          <Text style={styles.successText}>
            Tu contraseña ha sido cambiada exitosamente en la base de datos.
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login?passwordChanged=true")}>
            <Text style={styles.link}>← Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.card}>
            <View style={[styles.header, styles.headerError]}>
              <Ionicons name="warning-outline" size={44} color="#fff" style={styles.logoIcon} />
              <Text style={styles.title}>Enlace expirado</Text>
              <Text style={styles.subtitle}>El enlace de recuperación ya no es válido</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.errorText}>{error}</Text>
              <Button
                onPress={() => router.replace("/(auth)/forgot-password")}
                label="Solicitar nuevo enlace"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="key-outline" size={44} color="#fff" style={styles.logoIcon} />
            <Text style={styles.title}>Nueva contraseña</Text>
            <Text style={styles.subtitle}>
              {hasToken
                ? "Ingresa tu nueva contraseña segura"
                : "El enlace está asociado a tu cuenta"}
            </Text>
          </View>
          <View style={styles.form}>
            <Input
              label="Nueva contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Mínimo 8 caracteres"
            />
            <Input
              label="Confirmar contraseña"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="Repite tu contraseña"
            />
            {(valError || error) && (
              <Text style={styles.errorText}>{valError || error}</Text>
            )}
            <Button
              onPress={handleSubmit}
              isLoading={status === "loading"}
              label="Actualizar contraseña"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  inner: { flex: 1, justifyContent: "center", padding: 24 },
  backBtn: { marginBottom: 16 },
  backText: { color: theme.colors.accent, fontSize: 16 },
  card: { backgroundColor: theme.colors.card, borderRadius: 20, overflow: "hidden", ...theme.shadow.card },
  header: { backgroundColor: theme.colors.primary, padding: 32, alignItems: "center" },
  headerError: { backgroundColor: theme.colors.danger },
  logo: { fontSize: 52, marginBottom: 12 },
  logoIcon: { marginBottom: 12 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 13, textAlign: "center" },
  form: { padding: 28, gap: 16 },
  errorText: { color: theme.colors.danger, fontSize: 14, textAlign: "center", marginBottom: 8 },
  successContainer: { flex: 1, backgroundColor: theme.colors.bg, justifyContent: "center", alignItems: "center", padding: 32 },
  icon: { fontSize: 72, marginBottom: 24 },
  successTitle: { fontSize: 26, fontWeight: "700", color: theme.colors.primary, marginBottom: 16 },
  successText: { fontSize: 16, color: theme.colors.textMid, textAlign: "center", lineHeight: 24, marginBottom: 32 },
  link: { color: theme.colors.accent, fontSize: 15, fontWeight: "600" },
  loadingContainer: { flex: 1, backgroundColor: theme.colors.bg, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 16, color: theme.colors.textMuted, textAlign: "center", paddingHorizontal: 32 },
});