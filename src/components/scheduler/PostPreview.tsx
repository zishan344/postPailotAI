import { View, Image } from "react-native";
import { Text, Card, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

interface PostPreviewProps {
  platform: string;
  content: string;
  mediaUrls: string[];
}

export function PostPreview({
  platform,
  content,
  mediaUrls,
}: PostPreviewProps) {
  const theme = useTheme();

  const renderPlatformSpecificPreview = () => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return (
          <StyledView className="rounded-lg bg-white p-4 border border-gray-200">
            <StyledView className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="account-circle"
                size={40}
                color={theme.colors.primary}
              />
              <StyledView className="ml-2">
                <StyledText className="font-bold">Your Name</StyledText>
                <StyledText className="text-gray-500">@yourhandle</StyledText>
              </StyledView>
            </StyledView>
            <StyledText className="mb-3">{content}</StyledText>
            {mediaUrls.length > 0 && (
              <StyledView className="flex-row flex-wrap gap-2">
                {mediaUrls.map((url, index) => (
                  <StyledImage
                    key={index}
                    source={{ uri: url }}
                    className="w-[48%] h-32 rounded-lg"
                  />
                ))}
              </StyledView>
            )}
          </StyledView>
        );

      case "linkedin":
        return (
          <StyledView className="rounded-lg bg-white p-4 border border-gray-200">
            <StyledView className="flex-row items-center mb-3">
              <MaterialCommunityIcons
                name="account-circle"
                size={48}
                color={theme.colors.primary}
              />
              <StyledView className="ml-2">
                <StyledText className="font-bold">Your Name</StyledText>
                <StyledText className="text-gray-500">Your Title</StyledText>
              </StyledView>
            </StyledView>
            <StyledText className="mb-4 text-base">{content}</StyledText>
            {mediaUrls.length > 0 && (
              <StyledImage
                source={{ uri: mediaUrls[0] }}
                className="w-full h-48 rounded-lg"
              />
            )}
          </StyledView>
        );

      default:
        return (
          <StyledView className="rounded-lg bg-white p-4 border border-gray-200">
            <StyledText className="mb-3">{content}</StyledText>
            {mediaUrls.length > 0 && (
              <StyledView className="flex-row flex-wrap gap-2">
                {mediaUrls.map((url, index) => (
                  <StyledImage
                    key={index}
                    source={{ uri: url }}
                    className="w-[48%] h-32 rounded-lg"
                  />
                ))}
              </StyledView>
            )}
          </StyledView>
        );
    }
  };

  return (
    <Card className="mb-4">
      <Card.Content>
        <StyledView className="flex-row items-center mb-2">
          <MaterialCommunityIcons
            name={platform.toLowerCase()}
            size={24}
            color={theme.colors.primary}
          />
          <StyledText className="ml-2 font-medium">
            {platform} Preview
          </StyledText>
        </StyledView>
        {renderPlatformSpecificPreview()}
      </Card.Content>
    </Card>
  );
}
