import { StyleSheet } from "react-native";
import { Badge, useTheme } from "react-native-paper";
import { useNotificationStore } from "../stores/notificationStore";

interface NotificationBadgeProps {
  style?: any;
}

export function NotificationBadge({ style }: NotificationBadgeProps) {
  const { unreadCount } = useNotificationStore();
  const theme = useTheme();

  if (unreadCount === 0) return null;

  return (
    <Badge
      size={20}
      style={[styles.badge, { backgroundColor: theme.colors.error }, style]}>
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
  },
});
