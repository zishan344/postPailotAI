import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

interface CustomColors {
  success: string;
  warning: string;
  info: string;
}

interface CustomTheme extends MD3Theme {
  colors: MD3Theme["colors"] & CustomColors;
}

const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2196F3",
    secondary: "#03DAC6",
    error: "#B00020",
    background: "#F6F6F6",
    surface: "#FFFFFF",
    // Add custom colors here
    success: "#4CAF50",
    warning: "#FB8C00",
    info: "#2196F3",
  },
  roundness: 8,
};

const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#90CAF9",
    secondary: "#03DAC6",
    error: "#CF6679",
    background: "#121212",
    surface: "#1E1E1E",
    // Add custom colors here
    success: "#81C784",
    warning: "#FFB74D",
    info: "#64B5F6",
  },
  roundness: 8,
};

export { lightTheme, darkTheme };
export type { CustomTheme };
