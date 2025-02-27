import { supabase } from "../lib/supabase";
import { formatDate } from "../utils";

export const analyticsService = {
  async fetchDailyStats(timeRange: "week" | "month" | "year") {
    const daysAgo = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .gte("date", startDate.toISOString())
      .order("date", { ascending: true });

    if (error) throw error;
    return data;
  },

  async fetchPlatformStats() {
    const { data, error } = await supabase
      .from("platform_stats")
      .select("*")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    return data;
  },

  async fetchTopPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
      .order("engagement_rate", { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  },

  async fetchEngagementByHour() {
    const { data, error } = await supabase
      .from("analytics")
      .select("hour, engagement_rate")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
      .order("hour");

    if (error) throw error;

    // Calculate average engagement rate per hour
    const hourlyAvg = data.reduce((acc: any, curr: any) => {
      if (!acc[curr.hour]) {
        acc[curr.hour] = { sum: 0, count: 0 };
      }
      acc[curr.hour].sum += curr.engagement_rate;
      acc[curr.hour].count += 1;
      return acc;
    }, {});

    return Object.entries(hourlyAvg).map(([hour, stats]: [string, any]) => ({
      hour: parseInt(hour),
      avg: stats.sum / stats.count,
    }));
  },
};
