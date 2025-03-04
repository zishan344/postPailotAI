import { View, ScrollView } from "react-native";
import { Text, Card, Chip, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

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
    <StyledView>
      <StyledText className="text-xl font-semibold mb-4 px-4">
        Content Suggestions
      </StyledText>

      <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="mr-4 w-80"
            style={{ marginLeft: suggestion === suggestions[0] ? 16 : 0 }}>
            <Card.Content>
              <StyledText className="text-lg font-medium mb-2">
                {suggestion.title}
              </StyledText>

              <StyledText className="text-gray-600 mb-3">
                {suggestion.content}
              </StyledText>

              <StyledView className="flex-row flex-wrap gap-2 mb-3">
                {suggestion.hashtags.map((tag) => (
                  <Chip key={tag} className="bg-primary-50">
                    #{tag}
                  </Chip>
                ))}
              </StyledView>

              <StyledView className="flex-row items-center mb-3">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={theme.colors.primary}
                />
                <StyledText className="ml-2 text-gray-600">
                  Best time to post: {suggestion.bestTime}
                </StyledText>
              </StyledView>

              <StyledView className="flex-row items-center mb-3">
                <MaterialCommunityIcons
                  name="trending-up"
                  size={20}
                  color={theme.colors.primary}
                />
                <StyledText className="ml-2 text-gray-600">
                  Predicted engagement: {suggestion.predictedEngagement}%
                </StyledText>
              </StyledView>

              <StyledView className="flex-row mb-4">
                {suggestion.platforms.map((platform) => (
                  <MaterialCommunityIcons
                    key={platform}
                    name={platform.toLowerCase()}
                    size={24}
                    color={theme.colors.primary}
                    style={{ marginRight: 8 }}
                  />
                ))}
              </StyledView>

              <Button
                mode="contained"
                onPress={() => onUseSuggestion(suggestion)}>
                Use This Template
              </Button>
            </Card.Content>
          </Card>
        ))}
      </StyledScrollView>
    </StyledView>
  );
}
