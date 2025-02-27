import { View, StyleSheet } from "react-native";
import { List, IconButton, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatTimeAgo } from "../utils";
import type { Notification } from "../types";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const theme = useTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case "comment":
        return "comment-text";
      case "mention":
        return "at";
      case "analytics":
        return "chart-line";
      case "schedule":
        return "calendar-clock";
      default:
        return "bell";
    }
  };

  return (
    <List.Item
      title={notification.title}
      description={notification.body}
      left={(props) => (
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={getIcon(notification.type)}
            size={24}
            color={
              notification.read
                ? theme.colors.onSurfaceDisabled
                : theme.colors.primary
            }
          />
        </View>
      )}
      right={(props) => (
        <View style={styles.actions}>
          <Text variant="bodySmall" style={styles.timestamp}>
            {formatTimeAgo(notification.created_at)}
          </Text>
          {!notification.read && (
            <IconButton
              icon="check-circle"
              size={20}
              onPress={() => onMarkAsRead(notification.id)}
            />
          )}
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(notification.id)}
          />
        </View>
      )}
      style={[
        styles.item,
        !notification.read && {
          backgroundColor: theme.colors.primaryContainer,
          opacity: 0.9,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 1,
  },
  iconContainer: {
    justifyContent: "center",
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    marginRight: 8,
    opacity: 0.7,
  },
});
