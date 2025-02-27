import { supabase } from "../lib/supabase";

export type NotificationType =
  | "comment"
  | "mention"
  | "analytics"
  | "schedule"
  | "system";

interface CreateNotificationParams {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
}

export const notificationService = {
  async createNotification({
    userId,
    title,
    body,
    type,
    data = {},
  }: CreateNotificationParams) {
    const { data: notification, error } = await supabase.rpc(
      "create_notification",
      {
        p_user_id: userId,
        p_title: title,
        p_body: body,
        p_type: type,
        p_data: data,
      }
    );

    if (error) {
      console.error("Error creating notification:", error);
      throw error;
    }

    return notification;
  },

  async createCommentNotification(
    userId: string,
    postTitle: string,
    commenterName: string
  ) {
    return this.createNotification({
      userId,
      title: "New Comment",
      body: `${commenterName} commented on your post: "${postTitle}"`,
      type: "comment",
      data: { postTitle, commenterName },
    });
  },

  async createMentionNotification(
    userId: string,
    mentionerName: string,
    postContent: string
  ) {
    return this.createNotification({
      userId,
      title: "New Mention",
      body: `${mentionerName} mentioned you in a post`,
      type: "mention",
      data: { mentionerName, postContent },
    });
  },

  async createAnalyticsNotification(
    userId: string,
    metric: string,
    value: number,
    change: number
  ) {
    const changeText =
      change >= 0
        ? `increased by ${change}%`
        : `decreased by ${Math.abs(change)}%`;

    return this.createNotification({
      userId,
      title: "Analytics Update",
      body: `Your ${metric} has ${changeText}`,
      type: "analytics",
      data: { metric, value, change },
    });
  },

  async createScheduleNotification(
    userId: string,
    postTitle: string,
    scheduledTime: string
  ) {
    return this.createNotification({
      userId,
      title: "Scheduled Post Reminder",
      body: `Your post "${postTitle}" is scheduled for ${new Date(
        scheduledTime
      ).toLocaleString()}`,
      type: "schedule",
      data: { postTitle, scheduledTime },
    });
  },

  async createSystemNotification(userId: string, title: string, body: string) {
    return this.createNotification({
      userId,
      title,
      body,
      type: "system",
    });
  },
};
