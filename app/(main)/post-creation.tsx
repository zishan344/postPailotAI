import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Chip,
  Text,
  useTheme,
} from "react-native-paper";
import { MediaPicker } from "../../src/components/MediaPicker";
import { PlatformSelector } from "../../src/components/PlatformSelector";
import { useAIContentStore } from "../../src/stores/aiContentStore";

type Platform = "twitter" | "linkedin" | "facebook" | "instagram";

export default function PostCreationScreen() {
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const { generatePost, getSuggestions, suggestions, isLoading } =
    useAIContentStore();
  const theme = useTheme();

  const handleGenerate = async () => {
    try {
      const platform = selectedPlatforms[0] || ("twitter" as Platform);
      const generatedContent = await generatePost({
        prompt,
        platform,
        tone: "professional",
      });
      setContent(generatedContent);
    } catch (error) {
      console.error("Generation error:", error);
    }
  };

  const handleGetSuggestions = async () => {
    if (!content || !selectedPlatforms[0]) return;
    await getSuggestions(content, selectedPlatforms[0]);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <PlatformSelector
            selected={selectedPlatforms}
            onSelect={setSelectedPlatforms}
          />

          {/* AI Generation Section */}
          <Card style={styles.aiCard}>
            <Card.Content>
              <Text variant="titleMedium">AI Content Generation</Text>
              <TextInput
                mode="outlined"
                placeholder="What would you like to post about?"
                value={prompt}
                onChangeText={setPrompt}
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={handleGenerate}
                loading={isLoading}
                style={styles.generateButton}>
                Generate Content
              </Button>
            </Card.Content>
          </Card>

          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            style={styles.input}
          />

          <MediaPicker />

          <View style={styles.aiSuggestions}>
            <View style={styles.suggestionHeader}>
              <Text variant="titleMedium">AI Suggestions</Text>
              <Button
                mode="text"
                onPress={handleGetSuggestions}
                loading={isLoading}>
                Get Suggestions
              </Button>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  onPress={() => setContent(suggestion)}
                  style={styles.chip}>
                  Version {index + 1}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => {}} style={styles.button}>
              Schedule Post
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => {}}
              style={styles.button}>
              Post Now
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  aiCard: {
    marginVertical: 16,
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginVertical: 16,
  },
  generateButton: {
    marginTop: 8,
  },
  aiSuggestions: {
    marginVertical: 16,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 8,
  },
  button: {
    width: "100%",
  },
});
