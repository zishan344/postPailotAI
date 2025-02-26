import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text, Button, List, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: [
      "Up to 5 posts per month",
      "Basic analytics",
      "Single user account",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    features: [
      "Unlimited posts",
      "Advanced analytics",
      "AI content generation",
      "Priority support",
    ],
  },
];

export default function SubscriptionScreen() {
  const theme = useTheme();
  const currentPlan = "free";

  return (
    <ScrollView style={styles.container}>
      {PLANS.map((plan) => (
        <Card
          key={plan.id}
          style={[
            styles.planCard,
            currentPlan === plan.id && {
              borderColor: theme.colors.primary,
              borderWidth: 2,
            },
          ]}>
          <Card.Content>
            <View style={styles.planHeader}>
              <Text variant="headlineSmall">{plan.name}</Text>
              <Text variant="headlineMedium">{plan.price}</Text>
            </View>

            <View style={styles.features}>
              {plan.features.map((feature, index) => (
                <List.Item
                  key={index}
                  title={feature}
                  left={(props) => (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                />
              ))}
            </View>

            <Button
              mode={currentPlan === plan.id ? "outlined" : "contained"}
              onPress={() => {}}
              style={styles.button}>
              {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
            </Button>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  planCard: {
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  features: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
