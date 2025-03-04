import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNotificationStore } from "../stores/notificationStore";
import styled from 'styled-components/native';

const StyledView = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  padding-horizontal: 4px;
`;

const StyledText = styled.Text`
  font-size: 12px;
  color: white;
  font-weight: 500;
`;

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const { unreadCount } = useNotificationStore();

  if (unreadCount === 0) return null;

  return (
    <StyledView className={className || ""}>
      <StyledText>
        {unreadCount > 99 ? "99+" : unreadCount}
      </StyledText>
    </StyledView>
  );
}
