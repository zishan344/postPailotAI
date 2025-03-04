import { View } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatTimeAgo } from '../utils';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    body: string;
    type: 'comment' | 'mention' | 'analytics' | 'schedule' | 'system';
    read: boolean;
    created_at: string;
  };
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: NotificationItemProps) {
  const theme = useTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment': return 'comment-text';
      case 'mention': return 'at';
      case 'analytics': return 'chart-line';
      case 'schedule': return 'calendar-clock';
      default: return 'bell';
    }
  };

  return (
    <StyledView 
      className={`flex-row items-center p-4 border-b border-gray-200 
        ${!notification.read ? 'bg-primary-50' : 'bg-white'}`}
    >
      <StyledView className="p-2 rounded-full bg-primary-100">
        <MaterialCommunityIcons
          name={getIcon(notification.type)}
          size={24}
          color={theme.colors.primary}
        />
      </StyledView>

      <StyledView className="flex-1 ml-3">
        <StyledText className="font-medium text-gray-900">
          {notification.title}
        </StyledText>
        <StyledText className="text-sm text-gray-600 mt-1">
          {notification.body}
        </StyledText>
        <StyledText className="text-xs text-gray-500 mt-1">
          {formatTimeAgo(notification.created_at)}
        </StyledText>
      </StyledView>

      <StyledView className="flex-row items-center">
        {!notification.read && (
          <IconButton
            icon="check-circle"
            size={20}
            className="mr-1"
            onPress={() => onMarkAsRead(notification.id)}
          />
        )}
        <IconButton
          icon="delete"
          size={20}
          iconColor={theme.colors.error}
          onPress={() => onDelete(notification.id)}
        />
      </StyledView>
    </StyledView>
  );
}

    </StyledView>
  );
}
