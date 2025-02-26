import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text, Chip, Button, useTheme } from "react-native-paper";
import { ScheduleCalendar } from "../../src/components/ScheduleCalendar";
import { PostCard } from "../../src/components/PostCard";

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();

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
        <Chip icon="calendar">Today</Chip>
      </View>

      <PostCard />
      <PostCard />
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
