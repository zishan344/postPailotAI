import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface AnalyticsData {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagement_rate: number;
}

interface PlatformStats {
  platform: string;
  total_posts: number;
  total_engagement: number;
  best_performing_post: {
    content: string;
    engagement: number;
  };
}

interface AnalyticsState {
  timeRange: "week" | "month" | "year";
  dailyStats: AnalyticsData[];
  platformStats: PlatformStats[];
  isLoading: boolean;
  error: string | null;

  fetchAnalytics: (range: "week" | "month" | "year") => Promise<void>;
  fetchPlatformStats: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  timeRange: "week",
  dailyStats: [],
  platformStats: [],
  isLoading: false,
  error: null,

  fetchAnalytics: async (range) => {
    set({ isLoading: true, error: null, timeRange: range });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user?.id)
        .gte(
          "date",
          new Date(
            Date.now() - getDaysForRange(range) * 24 * 60 * 60 * 1000
          ).toISOString()
        )
        .order("date", { ascending: true });

      if (error) throw error;
      set({ dailyStats: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      set({ error: "Failed to fetch analytics", isLoading: false });
    }
  },

  fetchPlatformStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("platform_stats")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      set({ platformStats: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      set({ error: "Failed to fetch platform stats", isLoading: false });
    }
  },
}));

function getDaysForRange(range: "week" | "month" | "year"): number {
  switch (range) {
    case "week":
      return 7;
    case "month":
      return 30;
    case "year":
      return 365;
  }
}
