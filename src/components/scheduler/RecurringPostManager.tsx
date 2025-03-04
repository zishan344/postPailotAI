import { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  Card,
  Button,
  IconButton,
  Menu,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from 'styled-components/native';
import { useSchedulerStore } from "../../stores/schedulerStore";
import { formatDate } from "../../utils";
import { useRouter } from "expo-router";

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

interface RecurringPostManagerProps {
  postId: string;
  onEdit: () => void;
}

export function RecurringPostManager({
  postId,
  onEdit,
}: RecurringPostManagerProps) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const { posts, fetchPostInstances, deleteRecurringPost } =
    useSchedulerStore();
  const post = posts.find((p) => p.id === postId);
  const router = useRouter();

  if (!post?.is_recurring) return null;

  const getFrequencyText = () => {
    switch (post.frequency) {
      case "daily":
        return "Every day";
      case "weekly":
        return `Every week on ${post.recurring_days
          ?.map((day) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day])
          .join(", ")}`;
      case "monthly":
        return `Monthly on day${
          post.recurring_days?.length === 1 ? "" : "s"
        } ${post.recurring_days?.join(", ")}`;
      default:
        return "";
    }
  };

  const handleRefresh = () => {
    fetchPostInstances(postId);
  };

  const handleDeleteFuture = async () => {
    await deleteRecurringPost(postId, true);
    handleRefresh();
  };

  const handleDeleteAll = async () => {
    await deleteRecurringPost(postId);
  };

  return (
    <Card className="mb-4">
      <Card.Content>
        <StyledView className="flex-row justify-between items-center mb-4">
          <StyledView>
            <StyledText className="text-lg font-medium">
              Recurring Post
            </StyledText>
            <StyledText className="text-gray-600">
              {getFrequencyText()}
            </StyledText>
          </StyledView>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }>
            <Menu.Item onPress={onEdit} title="Edit Schedule" />
            <Menu.Item
              onPress={handleDeleteFuture}
              title="Delete Future Posts"
            />
            <Menu.Item onPress={handleDeleteAll} title="Delete All" />
          </Menu>
        </StyledView>

        <StyledView className="mb-4">
          <StyledText className="font-medium mb-2">Upcoming Posts</StyledText>
          {post.instances?.map((instance) => (
            <StyledView
              key={instance.id}
              className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <StyledView className="flex-row items-center">
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={theme.colors.primary}
                />
                <StyledText className="ml-2">
                  {formatDate(instance.scheduled_for)}
                </StyledText>
              </StyledView>
              <StyledText
                className={
                  instance.status === "scheduled"
                    ? "text-primary-600"
                    : instance.status === "published"
                    ? "text-green-600"
                    : "text-red-600"
                }>
                {instance.status}
              </StyledText>
            </StyledView>
          ))}
        </StyledView>

        <StyledView className="flex-row justify-between mt-4">
          <Button mode="outlined" onPress={handleRefresh} icon="refresh">
            Refresh Schedule
          </Button>

          <Button
            mode="contained"
            onPress={() => router.push(`/scheduler/analytics/${postId}`)}
            icon="chart-line">
            View Analytics
          </Button>
        </StyledView>
      </Card.Content>
    </Card>
  );
}
