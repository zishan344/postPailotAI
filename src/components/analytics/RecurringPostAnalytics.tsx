import { View } from "react-native";
import { Text, Card, ActivityIndicator, useTheme } from "react-native-paper";
import { LineChart, BarChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from 'styled-components/native';
import { useQuery } from "@tanstack/react-query";
import { schedulingService } from "../../services/schedulingService";
import { formatNumber, formatDate } from "../../utils";

const StyledView = styled.View`
  background-color: white;
  border-radius: 8px;
  shadow-opacity: 0.1;
  margin-bottom: 24px;
`;

const StyledText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

interface RecurringPostAnalyticsProps {
  postId: string;
}

export function RecurringPostAnalytics({
  postId,
}: RecurringPostAnalyticsProps) {
  const theme = useTheme();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["post-analytics", postId],
    queryFn: () => schedulingService.getPostAnalytics(postId),
  });

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (!analytics?.length) {
    return (
      <StyledView className="p-4">
        <StyledText className="text-gray-500 text-center">
          No analytics data available yet
        </StyledText>
      </StyledView>
    );
  }

  const engagementData = analytics.map((instance) => ({
    date: formatDate(instance.published_at),
    engagement: instance.analytics.reduce(
      (sum, a) => sum + (a.likes + a.comments + a.shares) / a.impressions,
      0
    ),
  }));

  const platformData = analytics.reduce((acc, instance) => {
    instance.analytics.forEach((a) => {
      if (!acc[a.platform]) {
        acc[a.platform] = {
          likes: 0,
          comments: 0,
          shares: 0,
          impressions: 0,
        };
      }
      acc[a.platform].likes += a.likes;
      acc[a.platform].comments += a.comments;
      acc[a.platform].shares += a.shares;
      acc[a.platform].impressions += a.impressions;
    });
    return acc;
  }, {} as Record<string, any>);

  return (
    <StyledView className="p-4">
      <Card className="mb-4">
        <Card.Content>
          <StyledText className="text-lg font-medium mb-4">
            Performance Over Time
          </StyledText>
          <LineChart
            data={{
              labels: engagementData.map((d) => d.date),
              datasets: [
                {
                  data: engagementData.map((d) => d.engagement),
                },
              ],
            }}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 2,
              color: () => theme.colors.primary,
              labelColor: () => theme.colors.onSurface,
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </Card.Content>
      </Card>

      <Card className="mb-4">
        <Card.Content>
          <StyledText className="text-lg font-medium mb-4">
            Platform Performance
          </StyledText>
          {Object.entries(platformData).map(([platform, stats]) => (
            <StyledView
              key={platform}
              className="mb-4 p-4 border border-gray-200 rounded-lg">
              <StyledView className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name={platform.toLowerCase()}
                  size={24}
                  color={theme.colors.primary}
                />
                <StyledText className="ml-2 font-medium">{platform}</StyledText>
              </StyledView>

              <StyledView className="flex-row justify-between">
                <StyledView className="items-center">
                  <StyledText className="text-2xl font-bold">
                    {formatNumber(stats.likes)}
                  </StyledText>
                  <StyledText className="text-gray-600">Likes</StyledText>
                </StyledView>

                <StyledView className="items-center">
                  <StyledText className="text-2xl font-bold">
                    {formatNumber(stats.comments)}
                  </StyledText>
                  <StyledText className="text-gray-600">Comments</StyledText>
                </StyledView>

                <StyledView className="items-center">
                  <StyledText className="text-2xl font-bold">
                    {formatNumber(stats.shares)}
                  </StyledText>
                  <StyledText className="text-gray-600">Shares</StyledText>
                </StyledView>
              </StyledView>

              <StyledView className="mt-4">
                <StyledText className="text-gray-600">
                  Engagement Rate:
                  <StyledText className="font-medium">
                    {" "}
                    {(
                      ((stats.likes + stats.comments + stats.shares) /
                        stats.impressions) *
                      100
                    ).toFixed(2)}
                    %
                  </StyledText>
                </StyledText>
              </StyledView>
            </StyledView>
          ))}
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <StyledText className="text-lg font-medium mb-4">
            Publishing Status
          </StyledText>
          <StyledView className="flex-row justify-between">
            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold text-green-600">
                {analytics.filter((a) => a.status === "published").length}
              </StyledText>
              <StyledText className="text-gray-600">Published</StyledText>
            </StyledView>

            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold text-primary-600">
                {analytics.filter((a) => a.status === "scheduled").length}
              </StyledText>
              <StyledText className="text-gray-600">Scheduled</StyledText>
            </StyledView>

            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold text-red-600">
                {analytics.filter((a) => a.status === "failed").length}
              </StyledText>
              <StyledText className="text-gray-600">Failed</StyledText>
            </StyledView>
          </StyledView>
        </Card.Content>
      </Card>
    </StyledView>
  );
}
