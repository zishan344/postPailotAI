import { View, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface EngagementData {
  date: string;
  engagement_rate: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const chartData = {
    labels: data.map((stat) =>
      new Date(stat.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        data: data.map((stat) => stat.engagement_rate),
        color: () => theme.colors.primary,
      },
    ],
  };

  return (
    <StyledView className="mb-6">
      <StyledText className="text-lg font-medium mb-4 px-4">
        Engagement Rate Over Time
      </StyledText>

      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surface,
          backgroundGradientTo: theme.colors.surface,
          decimalPlaces: 1,
          color: () => theme.colors.primary,
          labelColor: () => theme.colors.onSurface,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: theme.colors.primary,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </StyledView>
  );
}
