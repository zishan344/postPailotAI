import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatNumber } from "../../utils";
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

interface PlatformStat {
  platform: string;
  total_posts: number;
  total_engagement: number;
  followers: number;
  growth_rate: number;
}

interface PlatformStatsProps {
  data: PlatformStat[];
}

export function PlatformStats({ data }: PlatformStatsProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;

  const platformColors = {
    twitter: "#1DA1F2",
    linkedin: "#0077B5",
    facebook: "#4267B2",
    instagram: "#E1306C",
  };

  const chartData = data.map((item) => ({
    name: item.platform,
    engagement: item.total_engagement,
    color: platformColors[item.platform as keyof typeof platformColors],
    legendFontColor: theme.colors.onSurface,
    legendFontSize: 12,
  }));

  const renderPlatformMetrics = (platform: PlatformStat) => (
    <View key={platform.platform} style={styles.platformCard}>
      <View style={styles.platformHeader}>
        <MaterialCommunityIcons
          name={platform.platform.toLowerCase() as any}
          size={24}
          color={
            platformColors[platform.platform as keyof typeof platformColors]
          }
        />
        <Text variant="titleMedium" style={styles.platformName}>
          {platform.platform}
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metric}>
          <Text variant="bodySmall">Posts</Text>
          <Text variant="titleSmall">{formatNumber(platform.total_posts)}</Text>
        </View>
        <View style={styles.metric}>
          <Text variant="bodySmall">Followers</Text>
          <Text variant="titleSmall">{formatNumber(platform.followers)}</Text>
        </View>
        <View style={styles.metric}>
          <Text variant="bodySmall">Growth</Text>
          <Text
            variant="titleSmall"
            style={{
              color:
                platform.growth_rate >= 0
                  ? theme.colors.success
                  : theme.colors.error,
            }}>
            {platform.growth_rate > 0 ? "+" : ""}
            {platform.growth_rate.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Platform Performance
        </Text>

        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 64}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => theme.colors.onSurface,
            }}
            accessor="engagement"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
        </View>

        <View style={styles.platformsContainer}>
          {data.map(renderPlatformMetrics)}
        </View>
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
  chartContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  platformsContainer: {
    gap: 16,
  },
  platformCard: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  platformHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  platformName: {
    marginLeft: 8,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    alignItems: "center",
  },
});
