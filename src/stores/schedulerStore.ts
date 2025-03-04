import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { schedulingService } from "../services/schedulingService";

interface RecurringPostInstance {
  id: string;
  scheduled_for: string;
  status: "scheduled" | "published" | "failed";
  error_message?: string;
}

export interface ScheduledPost {
  id: string;
  content: string;
  media_urls?: string[];
  platforms: string[];
  scheduled_for: string;
  status: "scheduled" | "published" | "failed";
  created_at: string;
  is_recurring?: boolean;
  frequency?: "daily" | "weekly" | "monthly";
  recurring_days?: number[];
  end_date?: string;
  instances?: RecurringPostInstance[];
}

interface SchedulerState {
  posts: ScheduledPost[];
  isLoading: boolean;
  error: string | null;
  fetchScheduledPosts: () => Promise<void>;
  createScheduledPost: (
    post: Omit<ScheduledPost, "id" | "status" | "created_at">
  ) => Promise<void>;
  deleteScheduledPost: (id: string) => Promise<void>;
  updateScheduledPost: (
    id: string,
    updates: Partial<ScheduledPost>
  ) => Promise<void>;
  createRecurringPost: (post: CreatePostParams) => Promise<void>;
  updateRecurringPost: (
    id: string,
    updates: Partial<CreatePostParams>
  ) => Promise<void>;
  deleteRecurringPost: (
    id: string,
    deleteFutureOnly?: boolean
  ) => Promise<void>;
  fetchPostInstances: (postId: string) => Promise<void>;
}

export const useSchedulerStore = create<SchedulerState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchScheduledPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("scheduled_posts")
        .select("*")
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      set({ posts: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      set({ error: "Failed to fetch scheduled posts", isLoading: false });
    }
  },

  createScheduledPost: async (post) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("scheduled_posts")
        .insert([
          {
            ...post,
            status: "scheduled",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const { posts } = get();
      set({
        posts: [...posts, data],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error creating scheduled post:", error);
      set({ error: "Failed to create scheduled post", isLoading: false });
    }
  },

  deleteScheduledPost: async (id) => {
    try {
      const { error } = await supabase
        .from("scheduled_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      const { posts } = get();
      set({ posts: posts.filter((post) => post.id !== id) });
    } catch (error) {
      console.error("Error deleting scheduled post:", error);
      set({ error: "Failed to delete scheduled post" });
    }
  },

  updateScheduledPost: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("scheduled_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const { posts } = get();
      set({
        posts: posts.map((post) =>
          post.id === id ? { ...post, ...data } : post
        ),
      });
    } catch (error) {
      console.error("Error updating scheduled post:", error);
      set({ error: "Failed to update scheduled post" });
    }
  },

  createRecurringPost: async (post) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = await schedulingService.createPost(post);
      const { posts } = get();
      set({
        posts: [...posts, newPost],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error creating recurring post:", error);
      set({ error: "Failed to create recurring post", isLoading: false });
    }
  },

  updateRecurringPost: async (id, updates) => {
    try {
      await schedulingService.updateRecurringPost(id, updates);
      await get().fetchScheduledPosts();
    } catch (error) {
      console.error("Error updating recurring post:", error);
      set({ error: "Failed to update recurring post" });
    }
  },

  deleteRecurringPost: async (id, deleteFutureOnly = false) => {
    try {
      await schedulingService.deleteRecurringPost(id, deleteFutureOnly);
      if (!deleteFutureOnly) {
        const { posts } = get();
        set({ posts: posts.filter((post) => post.id !== id) });
      }
    } catch (error) {
      console.error("Error deleting recurring post:", error);
      set({ error: "Failed to delete recurring post" });
    }
  },

  fetchPostInstances: async (postId) => {
    try {
      const instances = await schedulingService.getUpcomingInstances(postId);
      const { posts } = get();
      set({
        posts: posts.map((post) =>
          post.id === postId ? { ...post, instances } : post
        ),
      });
    } catch (error) {
      console.error("Error fetching post instances:", error);
      set({ error: "Failed to fetch post instances" });
    }
  },
}));
