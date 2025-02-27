import { useState, useCallback } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { Text, SegmentedButtons, Card, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../../src/services/analyticsService";
import { EngagementChart } from "../../src/components/analytics/EngagementChart";
import { EngagementByHourChart } from "../../src/components/analytics/EngagementByHourChart";
import { TopPosts } from "../../src/components/analytics/TopPosts";
import { PlatformStats } from "../../src/components/analytics/PlatformStats";
import { AnalyticsSummary } from "../../src/components/analytics/AnalyticsSummary";

type TimeRange = "week" | "month" | "year";

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    data: dailyStats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["analytics", "daily", timeRange],
    queryFn: () => analyticsService.fetchDailyStats(timeRange),
  });

  const {
    data: platformStats,
    isLoading: isLoadingPlatforms,
    refetch: refetchPlatforms,
  } = useQuery({
    queryKey: ["analytics", "platforms"],
    queryFn: analyticsService.fetchPlatformStats,
  });

  const {
    data: topPosts,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["analytics", "top-posts"],
    queryFn: analyticsService.fetchTopPosts,
  });

  const {
    data: hourlyEngagement,
    isLoading: isLoadingHourly,
    refetch: refetchHourly,
  } = useQuery({
    queryKey: ["analytics", "hourly"],
    queryFn: analyticsService.fetchEngagementByHour,
  });

  const isLoading =
    isLoadingStats || isLoadingPlatforms || isLoadingPosts || isLoadingHourly;

  const onRefresh = useCallback(() => {
    refetchStats();
    refetchPlatforms();
    refetchPosts();
    refetchHourly();
  }, [refetchStats, refetchPlatforms, refetchPosts, refetchHourly]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Analytics</Text>
        <SegmentedButtons
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
          buttons={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ]}
          style={styles.timeRangeSelector}
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        style={styles.content}>
        {dailyStats && (
          <>
            <AnalyticsSummary data={dailyStats} timeRange={timeRange} />
            <EngagementChart data={dailyStats} />
          </>
        )}

        {hourlyEngagement && <EngagementByHourChart data={hourlyEngagement} />}

        {platformStats && <PlatformStats data={platformStats} />}

        {topPosts && <TopPosts posts={topPosts} />}

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  timeRangeSelector: {
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
