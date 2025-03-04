import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatTimeAgo } from '../utils';

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
    <View 
      style={[styles.container, !notification.read && styles.unread]}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={getIcon(notification.type)}
          size={24}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {notification.title}
        </Text>
        <Text style={styles.body}>
          {notification.body}
        </Text>
        <Text style={styles.timestamp}>
          {formatTimeAgo(notification.created_at)}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        {!notification.read && (
          <IconButton
            icon="check-circle"
            size={20}
            style={styles.markAsReadButton}
            onPress={() => onMarkAsRead(notification.id)}
          />
        )}
        <IconButton
          icon="delete"
          size={20}
          iconColor={theme.colors.error}
          onPress={() => onDelete(notification.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  unread: {
    backgroundColor: '#EBF8FF',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: '#DBEAFE',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: '500',
    color: '#1F2937',
  },
  body: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAsReadButton: {
    marginRight: 4,
  },
});
