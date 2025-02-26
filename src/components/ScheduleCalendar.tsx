import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { Calendar } from "react-native-calendars";

interface ScheduleCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function ScheduleCalendar({
  selectedDate,
  onSelectDate,
}: ScheduleCalendarProps) {
  const theme = useTheme();
  const formattedDate = selectedDate.toISOString().split("T")[0];

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Schedule Post</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          current={formattedDate}
          onDayPress={(day) => onSelectDate(new Date(day.timestamp))}
          markedDates={{
            [formattedDate]: {
              selected: true,
              selectedColor: theme.colors.primary,
            },
          }}
          theme={{
            todayTextColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.onPrimary,
          }}
        />
      </View>
      <Button mode="contained" onPress={() => onSelectDate(new Date())}>
        Select Date
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  calendarContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
});
