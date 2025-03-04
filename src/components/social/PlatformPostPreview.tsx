import { View, Image } from "react-native";
import { Text, Avatar, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { formatTimeAgo } from "../../utils";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

interface PlatformPostPreviewProps {
  platform: string;
  content: string;
  mediaUrls?: string[];
  account?: {
    username: string;
    profileImage?: string;
  };
}

export function PlatformPostPreview({
  platform,
  content,
  mediaUrls = [],
  account,
}: PlatformPostPreviewProps) {
  const theme = useTheme();

  const renderTwitterPreview = () => (
    <StyledView className="bg-white rounded-lg border border-gray-200 p-4">
      <StyledView className="flex-row items-start">
        <Avatar.Image
          size={48}
          source={
            account?.profileImage
              ? { uri: account.profileImage }
              : require("../../../assets/default-avatar.png")
          }
        />
        <StyledView className="flex-1 ml-3">
          <StyledView className="flex-row items-center">
            <StyledText className="font-bold">
              {account?.username || "Username"}
            </StyledText>
            <StyledText className="text-gray-500 ml-2">
              @{account?.username || "handle"}
            </StyledText>
          </StyledView>
          <StyledText className="mt-1">{content}</StyledText>
          {mediaUrls.length > 0 && (
            <StyledView className="mt-3 flex-row flex-wrap">
              {mediaUrls.map((url, index) => (
                <StyledImage
                  key={index}
                  source={{ uri: url }}
                  className="w-[48%] h-32 rounded-lg mr-2 mb-2"
                />
              ))}
            </StyledView>
          )}
          <StyledView className="flex-row mt-3">
            <MaterialCommunityIcons
              name="heart-outline"
              size={20}
              color={theme.colors.primary}
            />
            <MaterialCommunityIcons
              name="repeat"
              size={20}
              color={theme.colors.primary}
              style={{ marginLeft: 16 }}
            />
            <MaterialCommunityIcons
              name="reply"
              size={20}
              color={theme.colors.primary}
              style={{ marginLeft: 16 }}
            />
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  );

  const renderLinkedInPreview = () => (
    <StyledView className="bg-white rounded-lg border border-gray-200 p-4">
      <StyledView className="flex-row items-center mb-3">
        <Avatar.Image
          size={48}
          source={
            account?.profileImage
              ? { uri: account.profileImage }
              : require("../../../assets/default-avatar.png")
          }
        />
        <StyledView className="ml-3">
          <StyledText className="font-bold">
            {account?.username || "Your Name"}
          </StyledText>
          <StyledText className="text-gray-500 text-sm">
            {formatTimeAgo(new Date())}
          </StyledText>
        </StyledView>
      </StyledView>

      <StyledText className="mb-3">{content}</StyledText>

      {mediaUrls.length > 0 && (
        <StyledImage
          source={{ uri: mediaUrls[0] }}
          className="w-full h-48 rounded-lg mb-3"
        />
      )}

      <StyledView className="flex-row justify-between border-t border-gray-200 pt-3">
        <StyledView className="flex-row items-center">
          <MaterialCommunityIcons
            name="thumb-up-outline"
            size={20}
            color={theme.colors.primary}
          />
          <StyledText className="ml-1">Like</StyledText>
        </StyledView>
        <StyledView className="flex-row items-center">
          <MaterialCommunityIcons
            name="comment-outline"
            size={20}
            color={theme.colors.primary}
          />
          <StyledText className="ml-1">Comment</StyledText>
        </StyledView>
        <StyledView className="flex-row items-center">
          <MaterialCommunityIcons
            name="share-outline"
            size={20}
            color={theme.colors.primary}
          />
          <StyledText className="ml-1">Share</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );

  return (
    <StyledView className="mb-4">
      <StyledText className="text-lg font-medium mb-2">
        {platform} Preview
      </StyledText>
      {platform.toLowerCase() === "twitter"
        ? renderTwitterPreview()
        : renderLinkedInPreview()}
    </StyledView>
  );
}
