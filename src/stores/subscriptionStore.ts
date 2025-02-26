import { create } from "zustand";
import { createPaymentIntent, updateSubscription } from "../lib/stripe";
import { supabase } from "../lib/supabase";

interface SubscriptionState {
  status: "free" | "pro";
  endDate: string | null;
  isLoading: boolean;
  error: string | null;

  fetchSubscription: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  status: "free",
  endDate: null,
  isLoading: false,
  error: null,

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_end_date")
        .single();

      if (error) throw error;

      set({
        status: profile.subscription_status,
        endDate: profile.subscription_end_date,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      set({ error: "Failed to fetch subscription", isLoading: false });
    }
  },

  upgradeToPro: async () => {
    set({ isLoading: true, error: null });
    try {
      const { clientSecret } = await createPaymentIntent(999); // $9.99
      // Handle payment with Stripe SDK
      await updateSubscription("pro_subscription", "pro");
      set({ status: "pro", isLoading: false });
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      set({ error: "Failed to upgrade subscription", isLoading: false });
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      await updateSubscription("", "free");
      set({
        status: "free",
        endDate: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      set({ error: "Failed to cancel subscription", isLoading: false });
    }
  },
}));
