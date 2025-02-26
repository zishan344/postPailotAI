import { initStripe } from "@stripe/stripe-react-native";
import { supabase } from "./supabase";

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

export const initializeStripe = async () => {
  await initStripe({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    merchantIdentifier: "merchant.com.yourapp",
    urlScheme: "your-app-scheme",
  });
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = "usd"
) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "create-payment-intent",
      {
        body: { amount, currency },
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Payment intent creation error:", error);
    throw error;
  }
};

export const updateSubscription = async (
  subscriptionId: string,
  status: string
) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        subscription_status: status,
        subscription_end_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .eq("id", user?.id);

    if (error) throw error;
  } catch (error) {
    console.error("Subscription update error:", error);
    throw error;
  }
};
