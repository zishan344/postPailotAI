import { View } from "react-native";
import { Text } from "react-native-paper";
import { styled } from "nativewind";
import { useLocalSearchParams } from "expo-router";
import { PlatformAnalytics } from "../../../../src/components/analytics/PlatformAnalytics";
import { ContentSuggestions } from "../../../../src/components/social/ContentSuggestions";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../../../../src/services/analyticsService";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function PlatformAnalyticsScreen() {
  const { platform } = useLocalSearchParams<{ platform: string }>();

  const { data: analytics } = useQuery({
    queryKey: ["platform-analytics", platform],
    queryFn: () => analyticsService.getPlatformAnalytics(platform),
  });

  const { data: suggestions } = useQuery({
    queryKey: ["content-suggestions", platform],
    queryFn: () => analyticsService.getContentSuggestions(platform),
  });

  if (!analytics) {
    return (
      <StyledView className="flex-1 justify-center items-center">
        <StyledText>Loading analytics...</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-white">
      <PlatformAnalytics
        platform={platform}
        metrics={analytics.metrics}
        bestPerformingTimes={analytics.bestPerformingTimes}
        topHashtags={analytics.topHashtags}
      />

      {suggestions && (
        <ContentSuggestions
          suggestions={suggestions}
          onUseSuggestion={(suggestion) => {
            // Handle using the suggestion
            // This could navigate to the post creation screen
            // with the suggestion pre-filled
          }}
        />
      )}
    </StyledView>
  );
}
