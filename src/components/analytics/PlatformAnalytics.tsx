import { View, ScrollView } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart, BarChart } from "react-native-chart-kit";
import styled from 'styled-components/native';
import { formatNumber } from "../../utils";

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

const StyledScrollView = styled.ScrollView;

interface PlatformMetrics {
  date: string;
  impressions: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
}

interface PlatformAnalyticsProps {
  platform: string;
  metrics: PlatformMetrics[];
  bestPerformingTimes: {
    dayOfWeek: string;
    hourOfDay: number;
    engagement: number;
  }[];
  topHashtags: {
    tag: string;
    count: number;
    engagement: number;
  }[];
}

export function PlatformAnalytics({
  platform,
  metrics,
  bestPerformingTimes,
  topHashtags,
}: PlatformAnalyticsProps) {
  const theme = useTheme();

  const engagementData = {
    labels: metrics.map((m) => m.date),
    datasets: [
      {
        data: metrics.map((m) => m.engagement),
      },
    ],
  };

  const timeData = {
    labels: bestPerformingTimes.map((t) => `${t.dayOfWeek} ${t.hourOfDay}:00`),
    datasets: [
      {
        data: bestPerformingTimes.map((t) => t.engagement),
      },
    ],
  };

  return (
    <StyledScrollView>
      <Card className="m-4">
        <Card.Content>
          <StyledView className="flex-row items-center mb-4">
            <MaterialCommunityIcons
              name={platform.toLowerCase()}
              size={24}
              color={theme.colors.primary}
            />
            <StyledText className="text-xl font-semibold ml-2">
              {platform} Performance
            </StyledText>
          </StyledView>

          <StyledView className="flex-row justify-between mb-6">
            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold">
                {formatNumber(
                  metrics.reduce((sum, m) => sum + m.impressions, 0)
                )}
              </StyledText>
              <StyledText className="text-gray-600">
                Total Impressions
              </StyledText>
            </StyledView>
            <StyledView className="items-center">
              <StyledText className="text-2xl font-bold">
                {(
                  metrics.reduce((sum, m) => sum + m.engagement, 0) /
                  metrics.length
                ).toFixed(2)}
                %
              </StyledText>
              <StyledText className="text-gray-600">Avg. Engagement</StyledText>
            </StyledView>
          </StyledView>

          <StyledText className="text-lg font-medium mb-4">
            Engagement Over Time
          </StyledText>
          <LineChart
            data={engagementData}
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

          <StyledText className="text-lg font-medium mt-6 mb-4">
            Best Performing Times
          </StyledText>
          <BarChart
            data={timeData}
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
            style={{ marginVertical: 8, borderRadius: 16 }}
          />

          <StyledText className="text-lg font-medium mt-6 mb-4">
            Top Performing Hashtags
          </StyledText>
          {topHashtags.map((tag) => (
            <StyledView
              key={tag.tag}
              className="flex-row justify-between items-center p-3 border-b border-gray-100">
              <StyledText className="text-primary-600">#{tag.tag}</StyledText>
              <StyledView className="flex-row items-center">
                <StyledText className="text-gray-600 mr-2">
                  Used {tag.count} times
                </StyledText>
                <StyledText className="text-green-600">
                  {tag.engagement.toFixed(2)}% engagement
                </StyledText>
              </StyledView>
            </StyledView>
          ))}
        </Card.Content>
      </Card>
    </StyledScrollView>
  );
}
