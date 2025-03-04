import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Chip,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import { aiService } from "../../services/aiService";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#E0E0FF',
  },
  view: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  button: {
    marginBottom: 16,
  },
});

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
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.text}>Content Optimizer</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={setContent}
            style={styles.button}
          />
          <Button
            mode="contained"
            onPress={handleOptimize}
            loading={isOptimizing}
            style={styles.button}>
            Optimize Content
          </Button>
          <Button
            mode="outlined"
            onPress={handleGenerateContent}
            style={styles.button}>
            Generate Content
          </Button>
        </Card.Content>
      </Card>

      {optimization && (
        <>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.text}>Suggested Hashtags</Text>
              <View style={styles.view}>
                {optimization.suggestedHashtags.map((tag) => (
                  <Chip key={tag} style={styles.chip} onPress={() => setContent(content + " #" + tag)}>
                    #{tag}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.text}>Content Analysis</Text>
              <View style={styles.view}>
                <Text style={styles.text}>Tone: {optimization.toneAnalysis.tone}({optimization.toneAnalysis.confidence}% confidence)</Text>
              </View>
              <Text style={styles.text}>Suggested Improvements</Text>
              {optimization.improvements.map((improvement, index) => (
                <Text key={index} style={styles.text}>• {improvement}</Text>
              ))}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.text}>Platform-Specific Suggestions</Text>
              {optimization.platformSpecificSuggestions.map(({ platform, suggestions }) => (
                <View key={platform} style={styles.view}>
                  <Text style={styles.text}>{platform}</Text>
                  {suggestions.map((suggestion, index) => (
                    <Text key={index} style={styles.text}>• {suggestion}</Text>
                  ))}
                </View>
              ))}
            </Card.Content>
          </Card>

          <Button mode="contained" onPress={handleApplyOptimization}>
            Apply Optimized Content
          </Button>
        </>
      )}
    </ScrollView>
  );
}
