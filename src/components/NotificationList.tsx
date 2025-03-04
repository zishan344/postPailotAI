import { View, ScrollView, RefreshControl } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { NotificationItem } from "./NotificationItem";
import { useNotificationStore } from "../stores/notificationStore";
import styled from 'styled-components/native';

const StyledView = styled.View`
  background-color: white;
  border-radius: 8px;
  shadow-opacity: 0.1;
  margin-bottom: 24px;
`;

const StyledText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const StyledScrollView = styled.ScrollView`
  flex: 1;
`;

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
    <StyledView>
      {unreadCount > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: theme.colors.primary + '50' }}>
          <StyledText style={{ color: theme.colors.primary + '700' }}>
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </StyledText>
          <Button
            mode="text"
            onPress={markAllAsRead}
            textColor={theme.colors.primary}>
            Mark all as read
          </Button>
        </View>
      )}

      <StyledScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchNotifications}
            colors={[theme.colors.primary]}
          />
        }>
        {notifications.length === 0 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 32 }}>
            <StyledText style={{ color: 'gray', textAlign: 'center' }}>
              No notifications yet
            </StyledText>
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
      </StyledScrollView>
    </StyledView>
  );
}
