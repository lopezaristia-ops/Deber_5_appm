import { useState, useEffect } from "react";
import { theme } from "@/core/styles/theme";
import { supabase } from "@/shared/api/supabase";
import * as Linking from "expo-linking";
import { Button } from "@/shared/ui/Button";
import { router } from "expo-router";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const parseConfirmationToken = (url: string): {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
  token: string | null;
  email: string | null;
  type: string | null;
} => {
  if (!url) return { accessToken: null, refreshToken: null, code: null, token: null, email: null, type: null };

  try {
    const hash = url.includes("#") ? url.split("#")[1] : "";
    const search = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(search);

    return {
      accessToken: hashParams.get("access_token") ?? searchParams.get("access_token"),
      refreshToken: hashParams.get("refresh_token") ?? searchParams.get("refresh_token"),
      code: searchParams.get("code") ?? hashParams.get("code"),
      token: searchParams.get("token") ?? hashParams.get("token"),
      email: searchParams.get("email") ?? hashParams.get("email"),
      type: hashParams.get("type") ?? searchParams.get("type"),
    };
  } catch {
    return { accessToken: null, refreshToken: null, code: null, token: null, email: null, type: null };
  }
};

export const ConfirmEmailPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verificando tu correo...");

  useEffect(() => {
    let isMounted = true;

    const confirmEmail = async () => {
      try {
        const url = await Linking.getInitialURL();
        console.log("📧 Confirm email URL:", url);

        if (!isMounted) return;

        const { accessToken, refreshToken, code, token, email, type } = parseConfirmationToken(url ?? "");
        console.log(
          "📧 Access Token:", accessToken ? "SÍ" : "NO",
          "Code:", code ? "SÍ" : "NO",
          "Token:", token ? "SÍ" : "NO",
          "Type:", type,
        );

        if (code) {
          console.log("🔄 Intercambiando code...");
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.log("❌ Error exchangeCodeForSession:", error.message);
            setStatus("error");
            setMessage("El enlace de confirmación ha expirado.");
            return;
          }

          if (!isMounted) return;
          console.log("✅ Email confirmado con code!");
          setStatus("success");
          setMessage("¡Tu correo ha sido confirmado exitosamente!");
          await supabase.auth.signOut();
          return;
        }

        if (token && email) {
          console.log("🔄 Verificando token/email...");
          const verificationType = type === "recovery" ? "recovery" : "email";
          const { error } = await supabase.auth.verifyOtp({
            token,
            email,
            type: verificationType,
          });

          if (error) {
            console.log("❌ Error verifyOtp:", error.message);
            setStatus("error");
            setMessage("El enlace de confirmación ha expirado.");
            return;
          }

          if (!isMounted) return;
          console.log("✅ Email confirmado con token_hash!");
          setStatus("success");
          setMessage("¡Tu correo ha sido confirmado exitosamente!");
          await supabase.auth.signOut();
          return;
        }

        if (accessToken && refreshToken && type === "signup") {
          console.log("🔄 Estableciendo sesión...");
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.log("❌ Error setSession:", error.message);
            setStatus("error");
            setMessage("El enlace de confirmación ha expirado.");
          } else {
            console.log("✅ Email confirmado y sesión establecida!");
            setStatus("success");
            setMessage("¡Tu correo ha sido confirmado exitosamente!");
            await supabase.auth.signOut();
          }
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("✅ Sesión existente detectada - email confirmado");
          setStatus("success");
          setMessage("¡Tu correo ha sido confirmado exitosamente!");
          await supabase.auth.signOut();
          return;
        }

        console.log("❌ No access_token/refresh_token/code/token found", { accessToken, refreshToken, code, token, email, type });
        setStatus("error");
        setMessage("Token no encontrado en el enlace.");
      } catch (err: any) {
        console.log("❌ Error:", err.message);
        setStatus("error");
        setMessage("Error al confirmar el correo.");
      }
    };

    const timer = setTimeout(confirmEmail, 500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {status === "loading" && (
        <>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </>
      )}
      
      {status === "success" && (
        <>
          <Ionicons name="checkmark-circle-outline" size={72} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.title}>¡Confirmado!</Text>
          <Text style={styles.message}>{message}</Text>
          <Button 
            onPress={() => router.replace("/(auth)/login")} 
            label="Ir al Login"
          />
        </>
      )}
      
      {status === "error" && (
        <>
          <Ionicons name="close-circle-outline" size={72} color={theme.colors.danger} style={styles.icon} />
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{message}</Text>
          <Button 
            onPress={() => router.replace("/(auth)/register")} 
            label="Registrarse"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "700", color: theme.colors.primary, marginBottom: 16 },
  message: { fontSize: 16, color: theme.colors.textMid, textAlign: "center", marginBottom: 32 },
});