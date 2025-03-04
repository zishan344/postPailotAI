import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text, List, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatNumber, formatDate } from "../../utils";
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

interface ReportData {
  summary: {
    totalEngagement: number;
    growthRate: number;
    bestPlatform: string;
    bestPerformingDay: string;
  };
  platformPerformance: Array<{
    platform: string;
    metrics: {
      engagement: number;
      growth: number;
      posts: number;
    };
    insights: string[];
  }>;
  topContent: Array<{
    content: string;
    platform: string;
    engagement: number;
    factors: string[];
  }>;
  recommendations: Array<{
    type: "action" | "insight";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
}

interface AnalyticsReportProps {
  data: ReportData;
  onExport: () => void;
  onShare: () => void;
}

export function AnalyticsReport({
  data,
  onExport,
  onShare,
}: AnalyticsReportProps) {
  const theme = useTheme();

  if (!data || !data.summary) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  const renderPriorityIcon = (priority: string) => {
    const color =
      priority === "high"
        ? theme.colors.error
        : priority === "medium"
        ? theme.colors.warning
        : theme.colors.success;

    return (
      <MaterialCommunityIcons
        name="alert-circle"
        size={20}
        color={color}
        style={styles.priorityIcon}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Performance Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="bodyLarge">Total Engagement</Text>
              <Text variant="headlineSmall">
                {formatNumber(data.summary.totalEngagement)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="bodyLarge">Growth Rate</Text>
              <Text
                variant="headlineSmall"
                style={{
                  color:
                    data.summary.growthRate >= 0
                      ? theme.colors.success
                      : theme.colors.error,
                }}>
                {data.summary.growthRate > 0 ? "+" : ""}
                {data.summary.growthRate.toFixed(1)}%
              </Text>
            </View>
          </View>

          <List.Item
            title="Best Performing Platform"
            description={data.summary.bestPlatform}
            left={(props) => (
              <MaterialCommunityIcons
                name={data.summary.bestPlatform.toLowerCase()}
                size={24}
                color={theme.colors.primary}
              />
            )}
          />

          <List.Item
            title="Best Performing Day"
            description={formatDate(data.summary.bestPerformingDay)}
            left={(props) => (
              <MaterialCommunityIcons
                name="calendar-star"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Platform Insights
          </Text>
          {data.platformPerformance.map((platform, index) => (
            <View key={index} style={styles.platformInsight}>
              <View style={styles.platformHeader}>
                <MaterialCommunityIcons
                  name={platform.platform.toLowerCase() as any}
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="titleMedium" style={styles.platformName}>
                  {platform.platform}
                </Text>
              </View>
              {platform.insights.map((insight, i) => (
                <Text key={i} variant="bodyMedium" style={styles.insight}>
                  • {insight}
                </Text>
              ))}
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Recommendations
          </Text>
          {data.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendation}>
              <View style={styles.recommendationHeader}>
                {renderPriorityIcon(rec.priority)}
                <Text variant="titleMedium">{rec.title}</Text>
              </View>
              <Text variant="bodyMedium" style={styles.recommendationDesc}>
                {rec.description}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={onExport}
          icon="file-export"
          style={styles.button}>
          Export Report
        </Button>
        <Button
          mode="outlined"
          onPress={onShare}
          icon="share-variant"
          style={styles.button}>
          Share Report
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: "center",
  },
  platformInsight: {
    marginBottom: 16,
  },
  platformHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  platformName: {
    marginLeft: 8,
  },
  insight: {
    marginLeft: 32,
    marginBottom: 4,
  },
  recommendation: {
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recommendationDesc: {
    marginLeft: 28,
  },
  priorityIcon: {
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
