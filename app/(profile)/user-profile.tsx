import React from "react";
import { View } from "react-native";
import { Text, Avatar, Button, Surface } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function UserProfile() {
  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={require("../../assets/default-avatar.png")}
        />
        <Text variant="headlineMedium" style={styles.name}>
          User Name
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          user@example.com
        </Text>
      </View>

      <View style={styles.section}>
        <Button
          mode="contained"
          onPress={() => console.log("Edit profile")}
          style={styles.button}>
          Edit Profile
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    elevation: 0,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  name: {
    marginTop: 16,
  },
  email: {
    marginTop: 8,
    opacity: 0.7,
  },
  section: {
    marginTop: 24,
  },
  button: {
    marginTop: 8,
  },
});
