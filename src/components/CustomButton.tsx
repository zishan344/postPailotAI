import React from "react";
import { Button, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

interface CustomButtonProps {
  onPress: () => void;
  mode?: "text" | "outlined" | "contained";
  children: React.ReactNode;
  style?: any;
}

export const CustomButton = ({
  onPress,
  mode = "contained",
  children,
  style,
}: CustomButtonProps) => {
  const theme = useTheme();

  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      labelStyle={styles.label}>
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
