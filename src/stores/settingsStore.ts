import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface NotificationPreferences {
  newComments: boolean;
  mentions: boolean;
  analytics: boolean;
  scheduling: boolean;
  marketing: boolean;
}

interface SettingsState {
  notificationPreferences: NotificationPreferences;
  theme: "light" | "dark" | "system";
  isLoading: boolean;
  updateNotificationPreferences: (
    preferences: NotificationPreferences
  ) => Promise<void>;
  updateTheme: (theme: "light" | "dark" | "system") => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  notificationPreferences: {
    newComments: true,
    mentions: true,
    analytics: true,
    scheduling: true,
    marketing: false,
  },
  theme: "system",
  isLoading: true,

  loadSettings: async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("notification_preferences")
        .single();

      if (profile?.notification_preferences) {
        set({
          notificationPreferences: profile.notification_preferences,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      set({ isLoading: false });
    }
  },

  updateNotificationPreferences: async (preferences) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: preferences })
        .eq("id", user?.id);

      if (error) throw error;
      set({ notificationPreferences: preferences });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      throw error;
    }
  },

  updateTheme: async (theme) => {
    set({ theme });
  },
}));
