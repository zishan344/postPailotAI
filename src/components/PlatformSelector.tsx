import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

type Platform = "instagram" | "facebook" | "twitter" | "linkedin";

interface PlatformSelectorProps {
  selected: Platform[];
  onSelect: (platforms: Platform[]) => void;
}

export const PlatformSelector = ({
  selected,
  onSelect,
}: PlatformSelectorProps) => {
  const handleSelect = (platform: Platform) => {
    onSelect([platform]); // Single selection mode
  };

  return (
    <View style={styles.container}>
      {["instagram", "facebook", "twitter", "linkedin"].map((platform) => (
        <Chip
          key={platform}
          selected={selected.includes(platform as Platform)}
          onPress={() => handleSelect(platform as Platform)}
          style={styles.chip}>
          {platform}
        </Chip>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
});
