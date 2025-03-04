import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip, IconButton } from "react-native-paper";
import { useNotificationStore } from '../stores/notificationStore';

interface PostCardProps {
  content: string;
  platforms: string[];
  scheduledTime?: string;
  status?: string;
}

export function PostCard({
  content,
  platforms = [], // Provide a default empty array
  scheduledTime,
  status,
}: PostCardProps) {
  const initialize = useNotificationStore(state => state.initialize);
  
  useEffect(() => {
    initialize();
    
    return () => {
      useNotificationStore.getState().cleanup();
    };
  }, [initialize]);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text numberOfLines={3} style={styles.content}>
          {content}
        </Text>

        <View style={styles.footer}>
          <View style={styles.platforms}>
            {platforms && platforms.map((platform) => (
              <Chip key={platform} style={styles.platform}>
                {platform}
              </Chip>
            ))}
          </View>

          {scheduledTime && (
            <View style={styles.scheduleInfo}>
              <IconButton icon="clock-outline" size={20} />
              <Text>{scheduledTime}</Text>
              {status && <Chip compact>{status}</Chip>}
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platforms: {
    flexDirection: "row",
    gap: 8,
  },
  platform: {
    marginRight: 8,
  },
  scheduleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
