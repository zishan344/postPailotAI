import { supabase } from "../lib/supabase";
import { ScheduledPost } from "../stores/schedulerStore";
import { notificationService } from "./notificationService";

interface CreatePostParams {
  content: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduledFor: Date;
  isRecurring?: boolean;
  frequency?: "daily" | "weekly" | "monthly";
  recurringDays?: number[];
  endDate?: Date;
}

export const schedulingService = {
  async createPost(params: CreatePostParams): Promise<ScheduledPost> {
    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert([
        {
          content: params.content,
          platforms: params.platforms,
          media_urls: params.mediaUrls,
          scheduled_for: params.scheduledFor.toISOString(),
          is_recurring: params.isRecurring || false,
          frequency: params.frequency,
          recurring_days: params.recurringDays,
          end_date: params.endDate?.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Schedule a notification for the post
    await notificationService.scheduleNotification(data.id, data.scheduled_for);

    return data;
  },

  async getUpcomingInstances(postId: string, limit = 10) {
    const { data, error } = await supabase
      .from("recurring_post_instances")
      .select(
        `
        id,
        scheduled_for,
        status,
        error_message,
        scheduled_posts (
          content,
          platforms,
          media_urls
        )
      `
      )
      .eq("parent_post_id", postId)
      .gte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async updateRecurringPost(
    postId: string,
    updates: Partial<CreatePostParams>
  ) {
    // First update the parent post
    const { error: updateError } = await supabase
      .from("scheduled_posts")
      .update({
        content: updates.content,
        platforms: updates.platforms,
        media_urls: updates.mediaUrls,
        frequency: updates.frequency,
        recurring_days: updates.recurringDays,
        end_date: updates.endDate?.toISOString(),
      })
      .eq("id", postId);

    if (updateError) throw updateError;

    // Delete future instances
    const { error: deleteError } = await supabase
      .from("recurring_post_instances")
      .delete()
      .eq("parent_post_id", postId)
      .gte("scheduled_for", new Date().toISOString());

    if (deleteError) throw deleteError;

    // Trigger regeneration of instances
    const { error: regenerateError } = await supabase.rpc(
      "regenerate_recurring_instances",
      { post_id: postId }
    );

    if (regenerateError) throw regenerateError;
  },

  async deleteRecurringPost(postId: string, deleteFutureOnly = false) {
    if (deleteFutureOnly) {
      // Delete only future instances
      const { error } = await supabase
        .from("recurring_post_instances")
        .delete()
        .eq("parent_post_id", postId)
        .gte("scheduled_for", new Date().toISOString());

      if (error) throw error;
    } else {
      // Delete the parent post (will cascade to all instances)
      const { error } = await supabase
        .from("scheduled_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
    }
  },

  async getPostAnalytics(postId: string) {
    const { data, error } = await supabase
      .from("recurring_post_instances")
      .select(
        `
        status,
        published_at,
        error_message,
        analytics:post_analytics(
          platform,
          likes,
          comments,
          shares,
          impressions
        )
      `
      )
      .eq("parent_post_id", postId);

    if (error) throw error;
    return data;
  },

  async schedulePost(post: ScheduledPost) {
    const { error } = await supabase.from("scheduled_posts").insert([
      {
        content: post.content,
        media_urls: post.mediaUrls,
        platforms: post.platforms,
        scheduled_for: post.scheduledFor.toISOString(),
      },
    ]);

    if (error) throw error;

    // Schedule a notification for the post
    await notificationService.scheduleNotification(post.id, post.scheduledFor);
  },
};
