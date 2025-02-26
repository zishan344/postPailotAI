import { Session, User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string;
}

export interface Profile {
  id: string;
  username: string;
  company_name?: string;
  website?: string;
  timezone?: string;
  profile_picture?: string;
  notification_preferences: NotificationPreferences;
  subscription_status: "free" | "pro";
  subscription_end_date?: string;
  device_token?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  newComments: boolean;
  mentions: boolean;
  analytics: boolean;
  scheduling: boolean;
  marketing: boolean;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls?: string[];
  platforms: string[];
  scheduled_for?: string;
  published_at?: string;
  status: "draft" | "scheduled" | "published" | "failed";
  analytics?: PostAnalytics;
  created_at: string;
  updated_at: string;
}

export interface PostDraft {
  content: string;
  media_urls?: string[];
  platforms: string[];
  scheduled_for?: string;
}

export interface PostAnalytics {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagement_rate: number;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: "twitter" | "linkedin" | "facebook" | "instagram";
  access_token: string;
  refresh_token?: string;
  platform_user_id: string;
  connected_at: string;
  updated_at: string;
}

export interface AuthState {
  session: any;
  user: SupabaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
