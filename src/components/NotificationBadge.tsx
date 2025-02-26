import React from "react";
import { View } from "react-native";
import { Badge, useTheme } from "react-native-paper";

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge = ({ count }: NotificationBadgeProps) => {
  const theme = useTheme();

  if (count === 0) return null;

  return (
    <View style={{ position: "absolute", top: -5, right: -5 }}>
      <Badge size={20}>{count}</Badge>
    </View>
  );
};
