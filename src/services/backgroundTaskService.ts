import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { supabase } from "../lib/supabase";
import { notificationService } from "./notificationService";

const ANALYTICS_UPDATE_TASK = "ANALYTICS_UPDATE_TASK";
const SCHEDULED_POSTS_TASK = "SCHEDULED_POSTS_TASK";
const BACKGROUND_FETCH_TASK = "background-fetch";

export const backgroundTaskService = {
  async registerTasks() {
    try {
      // Register analytics update task
      await BackgroundFetch.registerTaskAsync(ANALYTICS_UPDATE_TASK, {
        minimumInterval: 60 * 60, // 1 hour
        stopOnTerminate: false,
        startOnBoot: true,
      });

      // Register scheduled posts check task
      await BackgroundFetch.registerTaskAsync(SCHEDULED_POSTS_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });

      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error("Error registering background tasks:", error);
    }
  },

  async unregisterTasks() {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    } catch (err) {
      console.warn("Task unregistration failed:", err);
    }
  },

  async checkAnalytics() {
    try {
      const { data: analytics, error } = await supabase
        .from("analytics")
        .select("*")
        .gte(
          "date",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) throw error;

      // Calculate significant changes
      const significantChanges = analyzeAnalytics(analytics);

      // Create notifications for significant changes
      for (const change of significantChanges) {
        await notificationService.createAnalyticsNotification(
          change.userId,
          change.metric,
          change.value,
          change.percentageChange
        );
      }

      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error("Error in analytics background task:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  },

  async checkScheduledPosts() {
    try {
      const now = new Date();
      const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "scheduled")
        .gte("scheduled_for", now.toISOString())
        .lte("scheduled_for", fifteenMinutesFromNow.toISOString());

      if (error) throw error;

      // Create notifications for posts about to be published
      for (const post of posts) {
        await notificationService.createScheduleNotification(
          post.user_id,
          post.content.substring(0, 50) + "...",
          post.scheduled_for
        );
      }

      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error("Error in scheduled posts background task:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  },
};

// Helper function to analyze analytics data
function analyzeAnalytics(analytics: any[]) {
  const significantChanges = [];
  const metrics = ["likes", "comments", "shares", "impressions"];

  // Group by user
  const userAnalytics = analytics.reduce((acc, item) => {
    if (!acc[item.user_id]) {
      acc[item.user_id] = [];
    }
    acc[item.user_id].push(item);
    return acc;
  }, {});

  // Analyze each user's data
  for (const [userId, data] of Object.entries(userAnalytics)) {
    const sortedData = data.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Compare latest with previous day
    if (sortedData.length >= 2) {
      const latest = sortedData[sortedData.length - 1];
      const previous = sortedData[sortedData.length - 2];

      for (const metric of metrics) {
        const percentageChange =
          ((latest[metric] - previous[metric]) / previous[metric]) * 100;

        // Report significant changes (>20%)
        if (Math.abs(percentageChange) >= 20) {
          significantChanges.push({
            userId,
            metric,
            value: latest[metric],
            percentageChange: Math.round(percentageChange),
          });
        }
      }
    }
  }

  return significantChanges;
}

// Register background tasks
TaskManager.defineTask(
  ANALYTICS_UPDATE_TASK,
  backgroundTaskService.checkAnalytics
);
TaskManager.defineTask(
  SCHEDULED_POSTS_TASK,
  backgroundTaskService.checkScheduledPosts
);

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Add your background task logic here
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background task failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
