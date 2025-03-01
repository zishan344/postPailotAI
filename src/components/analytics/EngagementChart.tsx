import { View, Dimensions, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

interface EngagementChartProps {
  data: any[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  const theme = useTheme();

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
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Engagement Rate Over Time
      </Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 48}
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
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
