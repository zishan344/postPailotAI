import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Avatar } from "react-native-paper";

export function PostCard() {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Avatar.Image
            size={40}
            source={{ uri: "https://placeholder.com/40" }}
          />
          <View style={styles.headerText}>
            <Text variant="titleMedium">Post Title</Text>
            <Text variant="bodySmall">2 hours ago • Twitter</Text>
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.content}>
          Post content goes here...
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 12,
    justifyContent: "center",
  },
  content: {
    marginBottom: 8,
  },
});
