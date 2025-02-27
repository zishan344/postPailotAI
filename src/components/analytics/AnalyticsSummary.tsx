import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { formatNumber } from "../../utils";

interface AnalyticsSummaryProps {
  data: any[];
  timeRange: "week" | "month" | "year";
}

export function AnalyticsSummary({ data, timeRange }: AnalyticsSummaryProps) {
  const totals = data.reduce(
    (acc, day) => ({
      likes: acc.likes + day.likes,
      comments: acc.comments + day.comments,
      shares: acc.shares + day.shares,
      impressions: acc.impressions + day.impressions,
    }),
    { likes: 0, comments: 0, shares: 0, impressions: 0 }
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">Analytics Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="titleLarge">{formatNumber(totals.likes)}</Text>
            <Text variant="bodyMedium">Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleLarge">{formatNumber(totals.comments)}</Text>
            <Text variant="bodyMedium">Comments</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleLarge">{formatNumber(totals.shares)}</Text>
            <Text variant="bodyMedium">Shares</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleLarge">{formatNumber(totals.impressions)}</Text>
            <Text variant="bodyMedium">Impressions</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
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
