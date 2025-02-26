import { ScrollView, StyleSheet } from "react-native";
import { List, Button, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SocialIcon = "twitter" | "linkedin" | "facebook" | "instagram";

const PLATFORMS: Array<{
  id: string;
  name: string;
  icon: SocialIcon;
  connected: boolean;
}> = [
  { id: "twitter", name: "Twitter", icon: "twitter", connected: true },
  { id: "linkedin", name: "LinkedIn", icon: "linkedin", connected: false },
  { id: "facebook", name: "Facebook", icon: "facebook", connected: true },
  { id: "instagram", name: "Instagram", icon: "instagram", connected: false },
];

export default function SocialAccountsScreen() {
  const handleConnect = (platformId: string) => {
    // Connect platform logic here
  };

  const handleDisconnect = (platformId: string) => {
    // Disconnect platform logic here
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          {PLATFORMS.map((platform) => (
            <List.Item
              key={platform.id}
              title={platform.name}
              left={(props) => (
                <MaterialCommunityIcons
                  name={platform.icon}
                  size={24}
                  color={props.color}
                />
              )}
              right={(props) => (
                <Button
                  mode={platform.connected ? "outlined" : "contained"}
                  onPress={() =>
                    platform.connected
                      ? handleDisconnect(platform.id)
                      : handleConnect(platform.id)
                  }>
                  {platform.connected ? "Disconnect" : "Connect"}
                </Button>
              )}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
