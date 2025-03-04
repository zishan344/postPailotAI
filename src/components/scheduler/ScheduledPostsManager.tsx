import { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Button, Card, DataTable } from "react-native-paper";
import { styled } from "nativewind";
import { schedulingService } from "../../services/schedulingService";

const StyledView = styled(View);
const StyledText = styled(Text);

export function ScheduledPostsManager({ userId }: { userId: string }) {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const { data } = await schedulingService.getScheduledPosts(userId);
        setScheduledPosts(data);
      } catch (error) {
        console.error("Error fetching scheduled posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduledPosts();
  }, [userId]);

  const handleDeletePost = async (postId: string) => {
    // Implement delete logic
    await schedulingService.deleteScheduledPost(postId);
    setScheduledPosts(scheduledPosts.filter((post) => post.id !== postId));
  };

  if (isLoading) {
    return <StyledText>Loading scheduled posts...</StyledText>;
  }

  return (
    <StyledView className="p-4">
      <Card className="mb-4">
        <Card.Content>
          <StyledText className="text-lg font-medium mb-4">
            Scheduled Posts
          </StyledText>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Content</DataTable.Title>
              <DataTable.Title>Scheduled For</DataTable.Title>
              <DataTable.Title>Action</DataTable.Title>
            </DataTable.Header>

            {scheduledPosts.map((post) => (
              <DataTable.Row key={post.id}>
                <DataTable.Cell>{post.content}</DataTable.Cell>
                <DataTable.Cell>
                  {new Date(post.scheduled_for).toLocaleString()}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Button
                    mode="contained"
                    onPress={() => handleDeletePost(post.id)}>
                    Delete
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    </StyledView>
  );
}
