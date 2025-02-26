import { MD3LightTheme, configureFonts } from "react-native-paper";

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
};
