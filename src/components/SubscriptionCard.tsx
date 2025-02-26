import { View, StyleSheet } from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";
import { useSubscriptionStore } from "../stores/subscriptionStore";
import { formatDate } from "../utils";

interface PlanFeature {
  feature: string;
  included: boolean;
}

interface PlanProps {
  name: string;
  price: string;
  features: PlanFeature[];
  current: boolean;
  onSelect: () => void;
  loading?: boolean;
}

function PlanCard({
  name,
  price,
  features,
  current,
  onSelect,
  loading,
}: PlanProps) {
  const theme = useTheme();

  return (
    <Card
      style={[
        styles.planCard,
        current && { borderColor: theme.colors.primary, borderWidth: 2 },
      ]}>
      <Card.Content>
        <Text variant="headlineSmall">{name}</Text>
        <Text variant="displaySmall" style={styles.price}>
          {price}
        </Text>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text
                variant="bodyMedium"
                style={[
                  styles.featureText,
                  !feature.included && styles.disabledFeature,
                ]}>
                {feature.feature}
              </Text>
            </View>
          ))}
        </View>

        <Button
          mode={current ? "outlined" : "contained"}
          onPress={onSelect}
          loading={loading}
          style={styles.button}>
          {current ? "Current Plan" : "Upgrade"}
        </Button>
      </Card.Content>
    </Card>
  );
}

export function SubscriptionCard() {
  const { status, endDate, isLoading, upgradeToPro, cancelSubscription } =
    useSubscriptionStore();

  const freePlanFeatures = [
    { feature: "Up to 5 posts per month", included: true },
    { feature: "Basic analytics", included: true },
    { feature: "Single user account", included: true },
    { feature: "AI content generation", included: false },
    { feature: "Priority support", included: false },
  ];

  const proPlanFeatures = [
    { feature: "Unlimited posts", included: true },
    { feature: "Advanced analytics", included: true },
    { feature: "AI content generation", included: true },
    { feature: "Priority support", included: true },
    { feature: "Custom branding", included: true },
  ];

  return (
    <View style={styles.container}>
      <PlanCard
        name="Free"
        price="$0"
        features={freePlanFeatures}
        current={status === "free"}
        onSelect={cancelSubscription}
        loading={isLoading}
      />

      <PlanCard
        name="Pro"
        price="$9.99/mo"
        features={proPlanFeatures}
        current={status === "pro"}
        onSelect={upgradeToPro}
        loading={isLoading}
      />

      {status === "pro" && endDate && (
        <Text style={styles.endDate}>
          Subscription ends: {formatDate(endDate)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  planCard: {
    marginBottom: 16,
  },
  price: {
    marginVertical: 8,
  },
  features: {
    marginVertical: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    flex: 1,
  },
  disabledFeature: {
    opacity: 0.5,
  },
  button: {
    marginTop: 8,
  },
  endDate: {
    textAlign: "center",
    opacity: 0.7,
  },
});
