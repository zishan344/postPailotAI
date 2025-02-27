import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { AuthState } from "../types";
import { router } from "expo-router";

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initializeAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error || !profile) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                username: session.user.email?.split("@")[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                subscription_status: "free",
              },
            ])
            .select()
            .single();

          if (!createError && newProfile) {
            set({ session, user: session.user, profile: newProfile });
          }
        } else {
          set({ session, user: session.user, profile });
        }
      }

      // Set up auth state listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event);
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          set({ session, user: session.user, profile });
        } else {
          set({ session: null, user: null, profile: null });
        }
      });

      set({ isLoading: false, isInitialized: true });
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    router.replace("/(main)/home");
    return data;
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          email: data.user.email,
          username: data.user.email?.split("@")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subscription_status: "free",
        },
      ]);
      if (profileError) throw profileError;
    }
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.replace("/(auth)/login");
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
}));
