import { View } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatNumber } from "../../utils";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledCard = styled(Card);

interface SummaryData {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagement_rate: number;
  change?: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    engagement_rate: number;
  };
}

interface AnalyticsSummaryProps {
  data: any[];
  timeRange: "week" | "month" | "year";
}

export function AnalyticsSummary({ data, timeRange }: AnalyticsSummaryProps) {
  const theme = useTheme();

  const calculateSummary = (): SummaryData => {
    // ... existing calculation logic
  };

  const summary = calculateSummary();

  const renderMetric = (
    label: string,
    value: number,
    change: number | undefined,
    icon: string
  ) => (
    <StyledCard className="flex-1 mx-2">
      <Card.Content>
        <StyledView className="flex-row items-center mb-2">
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={theme.colors.primary}
          />
          <StyledText className="ml-2 text-sm text-gray-600">
            {label}
          </StyledText>
        </StyledView>
        <StyledText className="text-xl font-semibold">
          {formatNumber(value)}
        </StyledText>
        {change !== undefined && (
          <StyledText
            className={`text-sm font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}>
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
          </StyledText>
        )}
      </Card.Content>
    </StyledCard>
  );

  return (
    <StyledView className="mb-4">
      <StyledView className="flex-row mb-4">
        {renderMetric(
          "Impressions",
          summary.impressions,
          summary.change?.impressions,
          "eye"
        )}
        {renderMetric(
          "Engagement",
          summary.engagement_rate,
          summary.change?.engagement_rate,
          "chart-line"
        )}
      </StyledView>
      <StyledView className="flex-row">
        {renderMetric("Likes", summary.likes, summary.change?.likes, "heart")}
        {renderMetric(
          "Comments",
          summary.comments,
          summary.change?.comments,
          "comment"
        )}
      </StyledView>
    </StyledView>
  );
}
