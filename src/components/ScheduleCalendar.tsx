import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

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
          onDayPress={(day) => {
            const newDate = new Date(selectedDate);
            newDate.setFullYear(day.year, day.month - 1, day.day);
            onSelectDate(newDate);
          }}
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
      <View style={styles.timeContainer}>
        <Text variant="titleMedium">Time</Text>
        <DateTimePicker
          value={selectedDate}
          mode="time"
          is24Hour={false}
          onChange={(event, date) => {
            if (date) onSelectDate(date);
          }}
        />
      </View>
      <Text style={styles.selectedDateTime}>
        Selected: {format(selectedDate, "PPpp")}
      </Text>
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
  timeContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedDateTime: {
    marginTop: 16,
    textAlign: "center",
    opacity: 0.7,
  },
});
