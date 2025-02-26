import { View, StyleSheet } from "react-native";
import { List, IconButton, Text, useTheme } from "react-native-paper";
import { useNotificationStore } from "../stores/notificationStore";
import { formatDate } from "../utils";

export function NotificationList() {
  const { notifications, markAsRead, deleteNotification } =
    useNotificationStore();
  const theme = useTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case "comment":
        return "comment";
      case "mention":
        return "at";
      case "analytics":
        return "chart-line";
      case "schedule":
        return "calendar";
      default:
        return "bell";
    }
  };

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications</Text>
      ) : (
        notifications.map((notification) => (
          <List.Item
            key={notification.id}
            title={notification.title}
            description={notification.body}
            left={(props) => (
              <List.Icon
                {...props}
                icon={getIcon(notification.type)}
                color={
                  notification.read
                    ? theme.colors.onSurfaceDisabled
                    : theme.colors.primary
                }
              />
            )}
            right={(props) => (
              <View style={styles.actions}>
                {!notification.read && (
                  <IconButton
                    icon="check"
                    size={20}
                    onPress={() => markAsRead(notification.id)}
                  />
                )}
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => deleteNotification(notification.id)}
                />
              </View>
            )}
            style={[
              styles.item,
              !notification.read && {
                backgroundColor: theme.colors.primaryContainer,
              },
            ]}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginVertical: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    opacity: 0.6,
  },
});
