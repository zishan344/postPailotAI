import React from "react";
import { PaperProvider } from "react-native-paper";
import { theme } from "./src/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
