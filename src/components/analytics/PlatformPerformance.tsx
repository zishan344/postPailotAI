import { View, StyleSheet } from "react-native";
import { Card, Text, List, useTheme } from "react-native-paper";
import { useAnalyticsStore } from "../../stores/analyticsStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatNumber } from "../../utils";

export function PlatformPerformance() {
  const { platformStats } = useAnalyticsStore();
  const theme = useTheme();

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "twitter";
      case "linkedin":
        return "linkedin";
      case "facebook":
        return "facebook";
      case "instagram":
        return "instagram";
      default:
        return "account-group";
    }
  } as const;

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Platform Performance
        </Text>

        {platformStats.map((stat) => (
          <View key={stat.platform} style={styles.platformCard}>
            <View style={styles.platformHeader}>
              <MaterialCommunityIcons
                name={getPlatformIcon(stat.platform)}
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="titleSmall" style={styles.platformName}>
                {stat.platform}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="bodySmall">Posts</Text>
                <Text variant="titleMedium">
                  {formatNumber(stat.total_posts)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodySmall">Engagement</Text>
                <Text variant="titleMedium">
                  {formatNumber(stat.total_engagement)}
                </Text>
              </View>
            </View>

            <List.Item
              title="Best Performing Post"
              description={stat.best_performing_post.content}
              right={() => (
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.primary }}>
                  {formatNumber(stat.best_performing_post.engagement)}
                </Text>
              )}
              style={styles.bestPost}
            />
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 16,
  },
  platformCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  platformHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  platformName: {
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  bestPost: {
    padding: 0,
  },
});
