import { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Chip,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import { styled } from "nativewind";
import { aiService } from "../../services/aiService";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

interface ContentOptimizerProps {
  initialContent: string;
  platforms: string[];
  onOptimized: (optimizedContent: string) => void;
}

export function ContentOptimizer({
  initialContent,
  platforms,
  onOptimized,
}: ContentOptimizerProps) {
  const [content, setContent] = useState(initialContent);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<any>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await aiService.optimizeContent(content, platforms);
      setOptimization(result);
      setContent(result.optimizedContent);
    } catch (error) {
      console.error("Optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateContent = async () => {
    // Implement content generation logic
    // For example, you could prompt the user for details and call aiService.generateContent
  };

  const handleApplyOptimization = () => {
    onOptimized(content);
  };

  return (
    <StyledScrollView className="p-4">
      <Card className="mb-4">
        <Card.Content>
          <StyledText className="text-lg font-medium mb-2">
            Content Optimizer
          </StyledText>
          <TextInput
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={setContent}
            className="mb-4"
          />
          <Button
            mode="contained"
            onPress={handleOptimize}
            loading={isOptimizing}
            className="mb-2">
            Optimize Content
          </Button>
          <Button
            mode="outlined"
            onPress={handleGenerateContent}
            className="mb-2">
            Generate Content
          </Button>
        </Card.Content>
      </Card>

      {optimization && (
        <>
          <Card className="mb-4">
            <Card.Content>
              <StyledText className="font-medium mb-2">
                Suggested Hashtags
              </StyledText>
              <StyledView className="flex-row flex-wrap gap-2">
                {optimization.suggestedHashtags.map((tag) => (
                  <Chip
                    key={tag}
                    onPress={() => setContent(content + " #" + tag)}>
                    #{tag}
                  </Chip>
                ))}
              </StyledView>
            </Card.Content>
          </Card>

          <Card className="mb-4">
            <Card.Content>
              <StyledText className="font-medium mb-2">
                Content Analysis
              </StyledText>
              <StyledView className="mb-2">
                <StyledText className="text-gray-600">
                  Tone: {optimization.toneAnalysis.tone}(
                  {optimization.toneAnalysis.confidence}% confidence)
                </StyledText>
              </StyledView>
              <StyledText className="font-medium mb-2">
                Suggested Improvements
              </StyledText>
              {optimization.improvements.map((improvement, index) => (
                <StyledText key={index} className="text-gray-600 mb-1">
                  • {improvement}
                </StyledText>
              ))}
            </Card.Content>
          </Card>

          <Card className="mb-4">
            <Card.Content>
              <StyledText className="font-medium mb-2">
                Platform-Specific Suggestions
              </StyledText>
              {optimization.platformSpecificSuggestions.map(
                ({ platform, suggestions }) => (
                  <StyledView key={platform} className="mb-3">
                    <StyledText className="font-medium mb-1">
                      {platform}
                    </StyledText>
                    {suggestions.map((suggestion, index) => (
                      <StyledText key={index} className="text-gray-600 mb-1">
                        • {suggestion}
                      </StyledText>
                    ))}
                  </StyledView>
                )
              )}
            </Card.Content>
          </Card>

          <Button mode="contained" onPress={handleApplyOptimization}>
            Apply Optimized Content
          </Button>
        </>
      )}
    </StyledScrollView>
  );
}
