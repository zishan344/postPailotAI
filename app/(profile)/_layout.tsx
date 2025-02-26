import React from "react";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="user-profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="subscription"
        options={{
          title: "Subscription",
        }}
      />
      <Stack.Screen
        name="social-accounts"
        options={{
          title: "Social Accounts",
        }}
      />
    </Stack>
  );
}
