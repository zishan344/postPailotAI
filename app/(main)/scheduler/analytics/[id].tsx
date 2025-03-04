import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { styled } from "nativewind";
import { useLocalSearchParams } from "expo-router";
import { RecurringPostAnalytics } from "../../../../src/components/analytics/RecurringPostAnalytics";
import { useSchedulerStore } from "../../../../src/stores/schedulerStore";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export default function RecurringPostAnalyticsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts } = useSchedulerStore();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <StyledText>Post not found</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledScrollView className="flex-1 bg-white">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-semibold mb-2">
          Post Analytics
        </StyledText>
        <StyledText className="text-gray-600 mb-4">
          {post.content.substring(0, 100)}...
        </StyledText>
      </StyledView>

      <RecurringPostAnalytics postId={id} />
    </StyledScrollView>
  );
}
