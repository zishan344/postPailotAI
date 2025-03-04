import { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text, Chip, Button, useTheme } from "react-native-paper";
import { format } from "date-fns";
import { ScheduleCalendar } from "../../src/components/ScheduleCalendar";
import { PostCard } from "../../src/components/PostCard";
import { schedulingService } from "../../src/services/schedulingService";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await schedulingService.getScheduledPosts();
      setScheduledPosts(posts);
    } catch (error) {
      console.error("Error loading scheduled posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.calendarCard}>
        <Card.Content>
          <ScheduleCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </Card.Content>
      </Card>

      <View style={styles.scheduleHeader}>
        <Text variant="titleLarge">Scheduled Posts</Text>
        <Chip icon="calendar">{format(new Date(), "MMM d, yyyy")}</Chip>
      </View>

      {scheduledPosts.map((post) => (
        <PostCard
          key={post.id}
          content={post.content}
          platforms={post.platforms}
          scheduledTime={format(new Date(post.scheduled_date), "PPpp")}
          status={post.status}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendarCard: {
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});
