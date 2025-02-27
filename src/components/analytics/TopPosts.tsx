import { View, StyleSheet } from "react-native";
import { Card, Text, List, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatNumber } from "../../utils";

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
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Top Performing Posts
        </Text>

        {posts.map((post, index) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text variant="titleSmall" style={styles.rank}>
                #{index + 1}
              </Text>
              <View style={styles.platforms}>
                {post.platforms.map((platform) => (
                  <MaterialCommunityIcons
                    key={platform}
                    name={platform.toLowerCase() as any}
                    size={20}
                    color={theme.colors.primary}
                    style={styles.platformIcon}
                  />
                ))}
              </View>
            </View>

            <Text variant="bodyMedium" numberOfLines={2} style={styles.content}>
              {post.content}
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="heart"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall">{formatNumber(post.likes)}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="comment"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall">{formatNumber(post.comments)}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="share"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall">{formatNumber(post.shares)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.primary }}>
                  {post.engagement_rate.toFixed(1)}%
                </Text>
                <Text variant="bodySmall">Engagement</Text>
              </View>
            </View>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 16,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rank: {
    opacity: 0.7,
  },
  platforms: {
    flexDirection: "row",
  },
  platformIcon: {
    marginLeft: 8,
  },
  content: {
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
});
