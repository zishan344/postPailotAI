import { ScrollView, StyleSheet } from "react-native";
import { List, Switch, Card, Button } from "react-native-paper";
import { useState } from "react";

export default function NotificationsScreen() {
  const [preferences, setPreferences] = useState({
    newComments: true,
    mentions: true,
    analytics: true,
    scheduling: true,
    marketing: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          <List.Section>
            <List.Subheader>Push Notifications</List.Subheader>
            <List.Item
              title="New Comments"
              description="When someone comments on your posts"
              right={() => (
                <Switch
                  value={preferences.newComments}
                  onValueChange={() => togglePreference("newComments")}
                />
              )}
            />
            <List.Item
              title="Mentions"
              description="When someone mentions you"
              right={() => (
                <Switch
                  value={preferences.mentions}
                  onValueChange={() => togglePreference("mentions")}
                />
              )}
            />
            <List.Item
              title="Analytics Updates"
              description="Weekly performance reports"
              right={() => (
                <Switch
                  value={preferences.analytics}
                  onValueChange={() => togglePreference("analytics")}
                />
              )}
            />
            <List.Item
              title="Scheduled Posts"
              description="Reminders about scheduled posts"
              right={() => (
                <Switch
                  value={preferences.scheduling}
                  onValueChange={() => togglePreference("scheduling")}
                />
              )}
            />
            <List.Item
              title="Marketing Updates"
              description="News and special offers"
              right={() => (
                <Switch
                  value={preferences.marketing}
                  onValueChange={() => togglePreference("marketing")}
                />
              )}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={() => {}} style={styles.saveButton}>
        Save Preferences
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});
