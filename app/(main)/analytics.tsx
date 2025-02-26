import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text, SegmentedButtons, useTheme } from "react-native-paper";
import { useState } from "react";
import { AnalyticsChart } from "../../src/components/AnalyticsChart";
import { PlatformSelector } from "../../src/components/PlatformSelector";

type Platform = "instagram" | "facebook" | "twitter" | "linkedin";

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.filterCard}>
        <Card.Content>
          <PlatformSelector
            selected={selectedPlatforms}
            onSelect={setSelectedPlatforms}
          />

          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleMedium">Overview</Text>
          <View style={styles.statsGrid}>
            <StatItem title="Engagement" value="2.5K" change="+15%" />
            <StatItem title="Impressions" value="10.2K" change="+8%" />
            <StatItem title="Followers" value="5.6K" change="+12%" />
            <StatItem title="Posts" value="48" change="+5%" />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium">Engagement Over Time</Text>
          <AnalyticsChart />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function StatItem({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  const theme = useTheme();
  const isPositive = change.startsWith("+");

  return (
    <View style={styles.statItem}>
      <Text variant="bodyMedium">{title}</Text>
      <Text variant="headlineSmall">{value}</Text>
      <Text
        variant="bodySmall"
        style={{
          color: isPositive ? theme.colors.primary : theme.colors.error,
        }}>
        {change}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterCard: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginTop: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  chartCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
});
