import { View } from "react-native";
import { Text, Checkbox, Button, SegmentedButtons } from "react-native-paper";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface RecurringPostSettingsProps {
  isRecurring: boolean;
  frequency: "daily" | "weekly" | "monthly";
  selectedDays: number[];
  onRecurringChange: (value: boolean) => void;
  onFrequencyChange: (value: "daily" | "weekly" | "monthly") => void;
  onDaysChange: (days: number[]) => void;
}

export function RecurringPostSettings({
  isRecurring,
  frequency,
  selectedDays,
  onRecurringChange,
  onFrequencyChange,
  onDaysChange,
}: RecurringPostSettingsProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  return (
    <StyledView className="mt-4">
      <StyledView className="flex-row items-center mb-4">
        <Checkbox
          status={isRecurring ? "checked" : "unchecked"}
          onPress={() => onRecurringChange(!isRecurring)}
        />
        <StyledText className="ml-2">Make this a recurring post</StyledText>
      </StyledView>

      {isRecurring && (
        <>
          <StyledView className="mb-4">
            <SegmentedButtons
              value={frequency}
              onValueChange={(value) =>
                onFrequencyChange(value as "daily" | "weekly" | "monthly")
              }
              buttons={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]}
            />
          </StyledView>

          {frequency === "weekly" && (
            <StyledView className="mb-4">
              <StyledText className="mb-2 text-gray-600">
                Select days of the week
              </StyledText>
              <StyledView className="flex-row flex-wrap gap-2">
                {weekDays.map((day, index) => (
                  <Button
                    key={day}
                    mode={
                      selectedDays.includes(index) ? "contained" : "outlined"
                    }
                    onPress={() => toggleDay(index)}
                    className="min-w-[45px]">
                    {day}
                  </Button>
                ))}
              </StyledView>
            </StyledView>
          )}

          {frequency === "monthly" && (
            <StyledView className="mb-4">
              <StyledText className="mb-2 text-gray-600">
                Select days of the month
              </StyledText>
              <StyledView className="flex-row flex-wrap gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <Button
                    key={day}
                    mode={selectedDays.includes(day) ? "contained" : "outlined"}
                    onPress={() => toggleDay(day)}
                    className="min-w-[40px] mb-2">
                    {day}
                  </Button>
                ))}
              </StyledView>
            </StyledView>
          )}
        </>
      )}
    </StyledView>
  );
}
