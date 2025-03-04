import { View, ScrollView, RefreshControl, Portal, Modal } from "react-native";
import { Text, Card, Button, IconButton, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from 'styled-components/native';
import { useSchedulerStore } from "../../stores/schedulerStore";
import { formatTimeAgo } from "../../utils";
import { RecurringPostManager } from "./RecurringPostManager";
import { useState } from "react";
import { PostScheduler } from "./PostScheduler";

const StyledView = styled.View`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const StyledText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const StyledScrollView = styled.ScrollView`
  flex: 1;
`;

export function ScheduledPostsList() {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const theme = useTheme();
  const { posts, isLoading, fetchScheduledPosts, deleteScheduledPost } =
    useSchedulerStore();

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "twitter";
      case "linkedin":
        return "linkedin";
      case "facebook":
        return "facebook";
      case "instagram":
        return "instagram";
      default:
        return "share-variant";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return theme.colors.primary;
      case "published":
        return theme.colors.success;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const renderPost = (post: ScheduledPost) => (
    <StyledView key={post.id}>
      <Card className="mb-4">
        <Card.Content>
          <StyledView className="flex-row justify-between items-center mb-2">
            <StyledView className="flex-row">
              {post.platforms.map((platform) => (
                <MaterialCommunityIcons
                  key={platform}
                  name={getPlatformIcon(platform)}
                  size={20}
                  color={theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
              ))}
            </StyledView>
            <StyledView className="flex-row items-center">
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={getStatusColor(post.status)}
                style={{ marginRight: 4 }}
              />
              <StyledText className="text-sm text-gray-600">
                {formatTimeAgo(post.scheduled_for)}
              </StyledText>
            </StyledView>
          </StyledView>

          <StyledText className="text-gray-800 mb-2">{post.content}</StyledText>

          {post.media_urls && post.media_urls.length > 0 && (
            <StyledView className="flex-row mb-2">
              <MaterialCommunityIcons
                name="image-multiple"
                size={16}
                color={theme.colors.primary}
                style={{ marginRight: 4 }}
              />
              <StyledText className="text-sm text-gray-600">
                {post.media_urls.length} image(s) attached
              </StyledText>
            </StyledView>
          )}

          <StyledView className="flex-row justify-between items-center mt-2">
            <StyledText
              className={`text-sm ${
                post.status === "failed" ? "text-red-500" : "text-gray-600"
              }`}>
              Status:{" "}
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </StyledText>
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => deleteScheduledPost(post.id)}
            />
          </StyledView>

          {post.is_recurring && (
            <RecurringPostManager
              postId={post.id}
              onEdit={() => setEditingPostId(post.id)}
            />
          )}
        </Card.Content>
      </Card>
    </StyledView>
  );

  return (
    <StyledScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchScheduledPosts}
          colors={[theme.colors.primary]}
        />
      }>
      {posts.length === 0 ? (
        <StyledView className="flex-1 justify-center items-center p-8">
          <StyledText className="text-gray-500 text-center">
            No scheduled posts yet
          </StyledText>
        </StyledView>
      ) : (
        <StyledView className="p-4">{posts.map(renderPost)}</StyledView>
      )}

      {editingPostId && (
        <Portal>
          <Modal
            visible={true}
            onDismiss={() => setEditingPostId(null)}
            contentContainerStyle={{
              backgroundColor: "white",
              margin: 20,
              borderRadius: 8,
              padding: 16,
            }}>
            <PostScheduler
              editingPost={posts.find((p) => p.id === editingPostId)}
              onComplete={() => setEditingPostId(null)}
            />
          </Modal>
        </Portal>
      )}
    </StyledScrollView>
  );
}
