import { View, Dimensions, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";

interface EngagementByHourProps {
  data: { hour: number; avg: number }[];
}

export function EngagementByHourChart({ data }: EngagementByHourProps) {
  const theme = useTheme();

  const chartData = {
    labels: data.map((d) => `${d.hour}:00`),
    datasets: [
      {
        data: data.map((d) => d.avg),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Best Time to Post
      </Text>
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={220}
        yAxisLabel="%"
        yAxisSuffix=""
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
          barPercentage: 0.7,
        }}
        style={styles.chart}
      />
      <Text variant="bodySmall" style={styles.subtitle}>
        Average engagement rate by hour of day
      </Text>
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
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
});
