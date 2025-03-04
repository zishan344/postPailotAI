import { View } from "react-native";
import { Text } from "react-native-paper";
import { useNotificationStore } from "../stores/notificationStore";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const { unreadCount } = useNotificationStore();

  if (unreadCount === 0) return null;

  return (
    <StyledView
      className={`absolute -top-1 -right-1 min-w-[20px] h-5 
        bg-red-500 rounded-full justify-center items-center px-1 
        ${className || ""}`}>
      <StyledText className="text-xs text-white font-medium">
        {unreadCount > 99 ? "99+" : unreadCount}
      </StyledText>
    </StyledView>
  );
}
