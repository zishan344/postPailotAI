import { useCallback } from "react";
import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useNotificationStore } from "../../src/stores/notificationStore";
import { NotificationItem } from "../../src/components/NotificationItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotificationStore();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {unreadCount > 0 && (
        <View style={styles.header}>
          <Text variant="bodyMedium">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </Text>
          <Button mode="text" onPress={markAllAsRead}>
            Mark all as read
          </Button>
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyStateText}>
              No notifications yet
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    opacity: 0.6,
  },
});
