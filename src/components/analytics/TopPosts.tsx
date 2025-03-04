import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from 'styled-components/native';
import { formatNumber } from "../../utils";

const StyledView = styled.View`
  background-color: white;
  border-radius: 8px;
  shadow-opacity: 0.1;
  margin-bottom: 24px;
`;

const StyledText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

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
    <StyledView>
      <StyledView>
        <StyledText>
          Top Performing Posts
        </StyledText>
      </StyledView>

      {posts.map((post, index) => (
        <StyledView key={post.id}>
          <StyledView>
            <StyledText>
              #{index + 1}
            </StyledText>
            <StyledView>
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

          <StyledText numberOfLines={2}>
            {post.content}
          </StyledText>

          <StyledView>
            <StyledView>
              <StyledView>
                <MaterialCommunityIcons
                  name="heart"
                  size={16}
                  color={theme.colors.primary}
                />
                <StyledText>
                  {formatNumber(post.likes)}
                </StyledText>
              </StyledView>
              <StyledText>Likes</StyledText>
            </StyledView>

            <StyledView>
              <StyledView>
                <MaterialCommunityIcons
                  name="comment"
                  size={16}
                  color={theme.colors.primary}
                />
                <StyledText>
                  {formatNumber(post.comments)}
                </StyledText>
              </StyledView>
              <StyledText>
                Comments
              </StyledText>
            </StyledView>

            <StyledView>
              <StyledView>
                <MaterialCommunityIcons
                  name="share"
                  size={16}
                  color={theme.colors.primary}
                />
                <StyledText>
                  {formatNumber(post.shares)}
                </StyledText>
              </StyledView>
              <StyledText>Shares</StyledText>
            </StyledView>

            <StyledView>
              <StyledText>
                {post.engagement_rate.toFixed(1)}%
              </StyledText>
              <StyledText>
                Engagement
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      ))}
    </StyledView>
  );
}
