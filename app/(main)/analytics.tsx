import { useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Text, SegmentedButtons, useTheme } from "react-native-paper";
import { styled } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../../src/services/analyticsService";
import { EngagementChart } from "../../src/components/analytics/EngagementChart";
import { TopPosts } from "../../src/components/analytics/TopPosts";
import { AnalyticsSummary } from "../../src/components/analytics/AnalyticsSummary";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

type TimeRange = "week" | "month" | "year";

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: () => analyticsService.fetchDailyStats(timeRange),
  });

  return (
    <StyledView className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StyledView className="px-4 py-3 border-b border-gray-200">
        <StyledText className="text-2xl font-semibold mb-3">
          Analytics
        </StyledText>
        <SegmentedButtons
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
          buttons={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ]}
        />
      </StyledView>

      <StyledScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
          />
        }>
        <StyledView className="p-4">
          {stats && (
            <>
              <AnalyticsSummary data={stats} timeRange={timeRange} />
              <EngagementChart data={stats} />
              <TopPosts posts={stats.topPosts} />
            </>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
