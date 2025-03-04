import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { formatNumber } from "../../utils";

const StyledView = styled(View);
const StyledText = styled(Text);

interface TopPost {
  id: string;
  content: string;
  platforms: string[];
  engagement_rate: number;
  likes: number;
  comments: number;
  shares: number;
}

interface TopPostsProps {
  posts: TopPost[];
}

export function TopPosts({ posts }: TopPostsProps) {
  const theme = useTheme();

  return (
    <StyledView className="bg-white rounded-lg shadow-sm mb-6">
      <StyledView className="p-4 border-b border-gray-100">
        <StyledText className="text-lg font-medium">
          Top Performing Posts
        </StyledText>
      </StyledView>

      {posts.map((post, index) => (
        <StyledView key={post.id} className="p-4 border-b border-gray-100">
          <StyledView className="flex-row justify-between items-center mb-2">
            <StyledText className="text-gray-500 font-medium">
              #{index + 1}
            </StyledText>
            <StyledView className="flex-row">
              {post.platforms.map((platform) => (
                <MaterialCommunityIcons
                  key={platform}
                  name={platform.toLowerCase()}
                  size={20}
                  color={theme.colors.primary}
                  style={{ marginLeft: 8 }}
                />
              ))}
            </StyledView>
          </StyledView>

          <StyledText numberOfLines={2} className="text-gray-800 mb-3">
            {post.content}
          </StyledText>

          <StyledView className="flex-row justify-between">
            <StyledView className="items-center">
              <StyledView className="flex-row items-center">
                <MaterialCommunityIcons
                  name="heart"
                  size={16}
                  color={theme.colors.primary}
                />
                <StyledText className="ml-1 text-sm">
                  {formatNumber(post.likes)}
                </StyledText>
              </StyledView>
              <StyledText className="text-xs text-gray-500">Likes</StyledText>
            </StyledView>

            <StyledView className="items-center">
              <StyledView className="flex-row items-center">
                <MaterialCommunityIcons
                  name="comment"
                  size={16}
                  color={theme.colors.primary}
                />
                <StyledText className="ml-1 text-sm">
                  {formatNumber(post.comments)}
                </StyledText>
              </StyledView>
              <StyledText className="text-xs text-gray-500">
                Comments
              </StyledText>
            </StyledView>

            <StyledView className="items-center">
              <StyledView className="flex-row items-center">
                <MaterialCommunityIcons
                  name="share"
                  size={16}
                  color={theme.colors.primary}
                />
                <StyledText className="ml-1 text-sm">
                  {formatNumber(post.shares)}
                </StyledText>
              </StyledView>
              <StyledText className="text-xs text-gray-500">Shares</StyledText>
            </StyledView>

            <StyledView className="items-center">
              <StyledText className="text-sm text-primary-600 font-medium">
                {post.engagement_rate.toFixed(1)}%
              </StyledText>
              <StyledText className="text-xs text-gray-500">
                Engagement
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      ))}
    </StyledView>
  );
}
