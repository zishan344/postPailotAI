import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "../src/theme";
import { useAuthStore } from "../src/stores/authStore";
import { useNotificationStore } from "../src/stores/notificationStore";
import { Redirect, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { session, isInitialized } = useAuthStore();
  const { initialize, cleanup } = useNotificationStore();

  useEffect(() => {
    if (session) {
      initialize();
    }
    return () => {
      cleanup();
    };
  }, [session]);

  if (!isInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
