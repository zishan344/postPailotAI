import { ScrollView, StyleSheet } from "react-native";
import { List, Switch } from "react-native-paper";
import { useAuthStore } from "../../src/stores/authStore";

export default function SettingsScreen() {
  const { signOut } = useAuthStore();

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Profile"
          left={(props) => <List.Icon {...props} icon="account" />}
          onPress={() => {}}
        />
        <List.Item
          title="Subscription"
          left={(props) => <List.Icon {...props} icon="star" />}
          onPress={() => {}}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Social Accounts</List.Subheader>
        <List.Item
          title="Connected Accounts"
          left={(props) => <List.Icon {...props} icon="link" />}
          onPress={() => {}}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={(props) => <Switch value={true} onValueChange={() => {}} />}
        />
      </List.Section>

      <List.Section>
        <List.Item
          title="Sign Out"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={signOut}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
