import { MD3LightTheme, configureFonts } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

const fontConfig = {
  displayLarge: {
    fontFamily: "sans-serif",
    fontSize: 57,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: "sans-serif",
    fontSize: 45,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 52,
  },
  // ... other font configurations
};

export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6366F1",
    primaryContainer: "#EEEEFF",
    secondary: "#4F51C2",
    secondaryContainer: "#E0E0FF",
    error: "#DC2626",
    errorContainer: "#FEE2E2",
    success: "#10B981",
    successContainer: "#D1FAE5",
    warning: "#F59E0B",
    warningContainer: "#FEF3C7",
  },
  fonts: configureFonts({ config: fontConfig }),
};
