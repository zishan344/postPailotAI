import { View, Dimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useEffect, useState } from "react";
import styled from 'styled-components/native';

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

interface EngagementData {
  date: string;
  engagement_rate: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  
  useEffect(() => {
    setChartData({
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
    });
  }, [data, theme.colors.primary]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <StyledView>
      <StyledText>
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
