import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Chip, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginRight: 16,
    width: 320,
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

interface ContentSuggestion {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  bestTime: string;
  predictedEngagement: number;
  platforms: string[];
}

interface ContentSuggestionsProps {
  suggestions: ContentSuggestion[];
  onUseSuggestion: (suggestion: ContentSuggestion) => void;
}

export function ContentSuggestions({
  suggestions,
  onUseSuggestion,
}: ContentSuggestionsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content Suggestions</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} style={[styles.card, { marginLeft: suggestion === suggestions[0] ? 16 : 0 }]}>
            <Card.Content>
              <Text style={styles.text}>{suggestion.title}</Text>
              <Text style={styles.text}>{suggestion.content}</Text>
              <View style={styles.view}>
                {suggestion.hashtags.map((tag) => (
                  <Chip key={tag} style={styles.chip}>
                    #{tag}
                  </Chip>
                ))}
              </View>
              <View style={styles.view}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.text}>Best time to post: {suggestion.bestTime}</Text>
              </View>
              <View style={styles.view}>
                <MaterialCommunityIcons name="trending-up" size={20} color={theme.colors.primary} />
                <Text style={styles.text}>Predicted engagement: {suggestion.predictedEngagement}%</Text>
              </View>
              <View style={styles.view}>
                {suggestion.platforms.map((platform) => (
                  <MaterialCommunityIcons key={platform} name={platform.toLowerCase()} size={24} color={theme.colors.primary} style={{ marginRight: 8 }} />
                ))}
              </View>
              <Button mode="contained" onPress={() => onUseSuggestion(suggestion)}>
                Use This Template
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
