import { useState } from "react";
import { ScrollView, View, StyleSheet, Animated } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Chip,
  Text,
  Portal,
  Modal,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { MediaPicker } from "../../src/components/MediaPicker";
import { PlatformSelector } from "../../src/components/PlatformSelector";
import { useAIContentStore } from "../../src/stores/aiContentStore";
import { ScheduleCalendar } from "../../src/components/ScheduleCalendar";
import { schedulingService } from "../../src/services/schedulingService";

type Platform = "twitter" | "linkedin" | "facebook" | "instagram";

export default function PostCreationScreen() {
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [isScheduling, setIsScheduling] = useState(false);
  const { generatePost, getSuggestions, suggestions, isLoading } =
    useAIContentStore();
  const router = useRouter();
  const theme = useTheme();

  // Configure animation settings for ScrollView and Modal
  const scrollViewConfig = {
    useNativeDriver: false // We need to set this to false since native driver isn't available
  };

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
    if (!content || selectedPlatforms.length === 0) {
      return;
    }
    try {
      await getSuggestions(content, selectedPlatforms[0]);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    }
  };

  const handleSchedule = async () => {
    if (!content || selectedPlatforms.length === 0) {
      return;
    }

    try {
      setIsScheduling(true);
      await schedulingService.schedulePost({
        content,
        platforms: selectedPlatforms,
        scheduledFor: scheduledDate,  // Changed from scheduledDate to scheduledFor
        mediaUrls,
      });
      setShowScheduleModal(false);
      router.push("/schedule");
    } catch (error) {
      console.error("Error scheduling post:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <>
      <ScrollView 
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        scrollEventThrottle={16}
        // Apply animation configuration
        contentOffset={{ x: 0, y: 0 }}
      >
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
                  loading={isLoading}
                  disabled={!content || selectedPlatforms.length === 0}>
                  Get Suggestions
                </Button>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                // Apply animation configuration
                scrollEventThrottle={16}
              >
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
              <Button
                mode="contained"
                onPress={() => setShowScheduleModal(true)}
                disabled={!content || selectedPlatforms.length === 0}
                style={styles.button}>
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

      <Portal>
        <Modal
          visible={showScheduleModal}
          onDismiss={() => setShowScheduleModal(false)}
          contentContainerStyle={styles.modalContainer}
          // Use animation props that don't require native driver
          animationType="fade"
        >
          <Card>
            <Card.Content>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Schedule Post
              </Text>
              <ScheduleCalendar
                selectedDate={scheduledDate}
                onSelectDate={setScheduledDate}
              />
              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowScheduleModal(false)}
                  style={styles.modalButton}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSchedule}
                  loading={isScheduling}
                  style={styles.modalButton}>
                  Confirm
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </>
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
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },
  modalButton: {
    minWidth: 100,
  },
});
