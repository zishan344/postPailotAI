import { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, Card, Button, DataTable, Chip } from "react-native-paper";
import { styled } from "nativewind";
import { aiService } from "../../services/aiService";

const StyledView = styled(View);
const StyledText = styled(Text);

interface SmartSchedulerProps {
  onScheduleSelected: (schedule: { day: string; hour: number }) => void;
}

export function SmartScheduler({ onScheduleSelected }: SmartSchedulerProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      const userId = "current-user-id"; // Get this from your auth context
      const result = await aiService.analyzePerformancePatterns(userId);
      setAnalysis(result);
    } catch (error) {
      console.error("Error loading analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <StyledView className="p-4">
        <StyledText>Analyzing posting patterns...</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="p-4">
      <Card className="mb-4">
        <Card.Content>
          <StyledText className="text-lg font-medium mb-4">
            Recommended Posting Times
          </StyledText>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Day</DataTable.Title>
              <DataTable.Title>Time</DataTable.Title>
              <DataTable.Title>Action</DataTable.Title>
            </DataTable.Header>

            {analysis?.bestTimes.map((time, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{time.day}</DataTable.Cell>
                <DataTable.Cell>{time.hour}:00</DataTable.Cell>
                <DataTable.Cell>
                  <Button
                    mode="contained"
                    compact
                    onPress={() => onScheduleSelected(time)}>
                    Select
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      <Card className="mb-4">
        <Card.Content>
          <StyledText className="text-lg font-medium mb-2">
            Top Performing Topics
          </StyledText>
          <StyledView className="flex-row flex-wrap gap-2">
            {analysis?.topPerformingTopics.map((topic, index) => (
              <Chip key={index}>{topic}</Chip>
            ))}
          </StyledView>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <StyledText className="text-lg font-medium mb-2">
            Engagement Insights
          </StyledText>
          {/* Add visualization of engagement patterns */}
          <StyledText className="text-gray-600">
            Based on your historical data, we've identified optimal posting
            patterns for maximum engagement.
          </StyledText>
        </Card.Content>
      </Card>
    </StyledView>
  );
}
