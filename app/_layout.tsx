import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "../src/theme";
import { useAuthStore } from "../src/stores/authStore";
import { useNotificationStore } from "../src/stores/notificationStore";
import { backgroundTaskService } from "../src/services/backgroundTaskService";
import { Redirect, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { session, isInitialized, initializeAuth } = useAuthStore();
  const { initialize, cleanup } = useNotificationStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (session) {
      initialize();
      backgroundTaskService.registerTasks();
    }
    return () => cleanup();
  }, [session]);

  useEffect(() => {
    console.log("Session:", session);
    console.log("Is Initialized:", isInitialized);
  }, [session, isInitialized]);

  // Show splash screen while initializing
  if (!isInitialized) {
    return null;
  }

  // Redirect to appropriate screen based on auth state
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <Stack>
            {session ? (
              <Stack.Screen name="(main)" options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            )}
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
