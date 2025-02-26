import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Card, Button, useTheme } from "react-native-paper";
import { PostCard } from "../../src/components/PostCard";
import { AnalyticsChart } from "../../src/components/AnalyticsChart";

export default function DashboardScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleLarge">Overview</Text>
          <View style={styles.statsGrid}>{/* Stats items */}</View>
        </Card.Content>
      </Card>

      <Card style={styles.analyticsCard}>
        <Card.Content>
          <Text variant="titleLarge">Analytics</Text>
          <AnalyticsChart />
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={styles.sectionTitle}>
        Recent Posts
      </Text>
      <PostCard />
      <PostCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  analyticsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});
