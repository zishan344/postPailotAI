import { View, ScrollView, RefreshControl } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { NotificationItem } from "./NotificationItem";
import { useNotificationStore } from "../stores/notificationStore";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export function NotificationList() {
  const theme = useTheme();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotificationStore();

  return (
    <StyledView className="flex-1 bg-white">
      {unreadCount > 0 && (
        <StyledView className="flex-row justify-between items-center px-4 py-2 bg-primary-50">
          <StyledText className="text-primary-700">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </StyledText>
          <Button
            mode="text"
            onPress={markAllAsRead}
            textColor={theme.colors.primary}>
            Mark all as read
          </Button>
        </StyledView>
      )}

      <StyledScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchNotifications}
            colors={[theme.colors.primary]}
          />
        }>
        {notifications.length === 0 ? (
          <StyledView className="flex-1 justify-center items-center p-8">
            <StyledText className="text-gray-500 text-center">
              No notifications yet
            </StyledText>
          </StyledView>
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
      </StyledScrollView>
    </StyledView>
  );
}
