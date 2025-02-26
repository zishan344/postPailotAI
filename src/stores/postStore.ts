import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Post, PostDraft } from "../types";

interface PostState {
  posts: Post[];
  scheduledPosts: Post[];
  isLoading: boolean;
  error: string | null;

  fetchPosts: () => Promise<void>;
  createPost: (post: PostDraft) => Promise<void>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  schedulePost: (post: PostDraft) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  scheduledPosts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const now = new Date();
      const scheduled = posts.filter(
        (post) => new Date(post.scheduled_for) > now
      );
      const published = posts.filter(
        (post) => !post.scheduled_for || new Date(post.scheduled_for) <= now
      );

      set({
        posts: published,
        scheduledPosts: scheduled,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ error: "Failed to fetch posts", isLoading: false });
    }
  },

  createPost: async (post: PostDraft) => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            ...post,
            user_id: user?.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const posts = get().posts;
      set({
        posts: [data as Post, ...posts],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      set({ error: "Failed to create post", isLoading: false });
    }
  },

  updatePost: async (id: string, updates: Partial<Post>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", id)
        .single();

      if (error) throw error;

      const posts = get().posts.map((post) =>
        post.id === id ? { ...post, ...updates } : post
      );
      set({ posts, isLoading: false });
    } catch (error) {
      console.error("Error updating post:", error);
      set({ error: "Failed to update post", isLoading: false });
    }
  },

  deletePost: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) throw error;

      const posts = get().posts.filter((post) => post.id !== id);
      set({ posts, isLoading: false });
    } catch (error) {
      console.error("Error deleting post:", error);
      set({ error: "Failed to delete post", isLoading: false });
    }
  },

  schedulePost: async (post: PostDraft) => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            ...post,
            user_id: user?.id,
            created_at: new Date().toISOString(),
            status: "scheduled",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const scheduledPosts = get().scheduledPosts;
      set({
        scheduledPosts: [data as Post, ...scheduledPosts],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error scheduling post:", error);
      set({ error: "Failed to schedule post", isLoading: false });
    }
  },
}));
