import { Platform } from "react-native";
import { MD3LightTheme, configureFonts } from "react-native-paper";

declare global {
  namespace ReactNativePaper {
    interface MD3Colors {
      success: string;
      error: string;
      warning: string;
    }
  }
}

const fontConfig = {
  customVariant: {
    fontFamily: Platform.select({
      web: '"Roboto", "Helvetica", "Arial", sans-serif',
      default: "System",
    }),
  },
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
  },
};
