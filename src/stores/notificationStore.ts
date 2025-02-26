import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: "comment" | "mention" | "analytics" | "schedule" | "system";
  read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  channel: RealtimeChannel | null;

  initialize: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  cleanup: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  channel: null,

  initialize: async () => {
    const { fetchNotifications } = get();
    await fetchNotifications();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Set up real-time notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          const { notifications, unreadCount } = get();
          const newNotification = payload.new as Notification;
          set({
            notifications: [newNotification, ...notifications],
            unreadCount: unreadCount + 1,
          });
        }
      )
      .subscribe();

    set({ channel });
  },

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const unreadCount = data.filter((n) => !n.read).length;
      set({
        notifications: data,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({ error: "Failed to fetch notifications", isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;

      const { notifications, unreadCount } = get();
      const updatedNotifications = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );

      set({
        notifications: updatedNotifications,
        unreadCount: Math.max(0, unreadCount - 1),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id);

      if (error) throw error;

      const { notifications } = get();
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        read: true,
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      const { notifications, unreadCount } = get();
      const deletedNotification = notifications.find((n) => n.id === id);
      const updatedNotifications = notifications.filter((n) => n.id !== id);

      set({
        notifications: updatedNotifications,
        unreadCount: deletedNotification?.read
          ? unreadCount
          : Math.max(0, unreadCount - 1),
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  },

  cleanup: () => {
    const { channel } = get();
    if (channel) {
      channel.unsubscribe();
    }
    set({ channel: null });
  },
}));
