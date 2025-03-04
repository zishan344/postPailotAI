import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Chip, Text, useTheme } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { styled } from "nativewind";
import { createInteropElement } from "react-native-css-interop";

import { useSchedulerStore } from "../../stores/schedulerStore";
import * as ImagePicker from "expo-image-picker";
import { PostPreview } from "./PostPreview";
import { RecurringPostSettings } from "./RecurringPostSettings";

const StyledView = createInteropElement(View, {});
const StyledText = createInteropElement(Text, {});

const PLATFORMS = ["Twitter", "LinkedIn", "Facebook", "Instagram"];

interface PostSchedulerProps {
  editingPost?: ScheduledPost;
  onComplete?: () => void;
}

export function PostScheduler({ editingPost, onComplete }: PostSchedulerProps) {
  const theme = useTheme();
  const { createScheduledPost, updateRecurringPost, isLoading } =
    useSchedulerStore();
  const [content, setContent] = useState(editingPost?.content || "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    editingPost?.platforms || []
  );
  const [scheduledDate, setScheduledDate] = useState(
    editingPost ? new Date(editingPost.scheduled_for) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>(
    editingPost?.media_urls || []
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(
    editingPost?.is_recurring || false
  );
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
    editingPost?.frequency || "weekly"
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    editingPost?.recurring_days || []
  );

  const handleSubmit = async () => {
    try {
      if (editingPost) {
        await updateRecurringPost(editingPost.id, {
          content,
          platforms: selectedPlatforms,
          mediaUrls,
          scheduledFor: scheduledDate,
          isRecurring,
          frequency,
          recurringDays: selectedDays,
        });
      } else {
        await createScheduledPost({
          content,
          platforms: selectedPlatforms,
          mediaUrls,
          scheduledFor: scheduledDate,
          isRecurring,
          frequency,
          recurringDays: selectedDays,
        });
      }
      onComplete?.();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUrls(result.assets.map((asset) => asset.uri));
    }
  };

  return (
    <StyledView className="p-4 bg-white rounded-lg shadow-sm">
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={4}
        placeholder="What would you like to share?"
        value={content}
        onChangeText={setContent}
        className="mb-4"
      />

      <StyledText className="text-sm text-gray-600 mb-2">
        Select Platforms
      </StyledText>
      <StyledView className="flex-row flex-wrap gap-2 mb-4">
        {PLATFORMS.map((platform) => (
          <Chip
            key={platform}
            selected={selectedPlatforms.includes(platform)}
            onPress={() => {
              setSelectedPlatforms((prev) =>
                prev.includes(platform)
                  ? prev.filter((p) => p !== platform)
                  : [...prev, platform]
              );
            }}
            className={
              selectedPlatforms.includes(platform) ? "bg-primary-100" : ""
            }>
            {platform}
          </Chip>
        ))}
      </StyledView>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        className="mb-4">
        Schedule for: {scheduledDate.toLocaleString()}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="datetime"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setScheduledDate(date);
          }}
        />
      )}

      <Button
        mode="outlined"
        onPress={handleImagePick}
        icon="image"
        className="mb-4">
        Add Images
      </Button>

      {mediaUrls.length > 0 && (
        <StyledText className="text-sm text-gray-600 mb-4">
          {mediaUrls.length} image(s) selected
        </StyledText>
      )}

      <RecurringPostSettings
        isRecurring={isRecurring}
        frequency={frequency}
        selectedDays={selectedDays}
        onRecurringChange={setIsRecurring}
        onFrequencyChange={setFrequency}
        onDaysChange={setSelectedDays}
      />

      {selectedPlatforms.map((platform) => (
        <PostPreview
          key={platform}
          platform={platform}
          content={content}
          mediaUrls={mediaUrls}
        />
      ))}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={!content.trim() || selectedPlatforms.length === 0}
        className="mt-4">
        Schedule Post
      </Button>
    </StyledView>
  );
}
