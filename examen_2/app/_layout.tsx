import { useEffect } from "react";
import { Stack, usePathname, router } from "expo-router";
import { TamaguiProvider } from 'tamagui';
import { config } from '../tamagui.config';
import { QueryProvider } from "@/core/providers/QueryProvider";
import { useSession } from "@/features/session/model/useSession";

const PUBLIC_ROUTES = [
  "reset-password",
  "forgot-password",
  "confirm-email",
  "register",
  "login",
  "home",
  "index",
];

function AuthGuard() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useSession();

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.includes(route));
  const isRootRoute = pathname === "/";

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      if (isRootRoute || isPublicRoute) {
        router.replace("/home");
      }
      return;
    }

    if (!isPublicRoute) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, isRootRoute]);

  return null;
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="home" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="confirm-email" />
          <Stack.Screen name="index" />
          <Stack.Screen name="products" />
          <Stack.Screen name="product-form" />
          <Stack.Screen name="change-password" />
        </Stack>
        <AuthGuard />
      </QueryProvider>
    </TamaguiProvider>
  );
}