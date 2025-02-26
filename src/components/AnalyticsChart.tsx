import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export const AnalyticsChart = () => {
  return (
    <View style={styles.container}>
      <Text>Analytics Chart Component</Text>
      {/* Add your chart implementation here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
  },
});
