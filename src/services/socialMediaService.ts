import { supabase } from "../lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";

const TWITTER_CLIENT_ID = process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID!;
const LINKEDIN_CLIENT_ID = process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID!;

interface SocialAccount {
  id: string;
  platform: "twitter" | "linkedin";
  username: string;
  profile_image_url?: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export const socialMediaService = {
  async getConnectedAccounts(): Promise<SocialAccount[]> {
    const { data, error } = await supabase.from("social_accounts").select("*");

    if (error) throw error;
    return data;
  },

  async connectTwitter() {
    const redirectUri = makeRedirectUri({
      path: "social/twitter-callback",
    });

    const state = Math.random().toString(36).substring(7);

    const authUrl =
      `https://twitter.com/i/oauth2/authorize?` +
      `response_type=code` +
      `&client_id=${TWITTER_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent("tweet.read tweet.write users.read")}` +
      `&state=${state}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${await this.generateCodeChallenge()}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success") {
      const { code } = Linking.parse(result.url).queryParams;
      await this.handleTwitterCallback(code);
    }
  },

  async connectLinkedIn() {
    const redirectUri = makeRedirectUri({
      path: "social/linkedin-callback",
    });

    const state = Math.random().toString(36).substring(7);

    const authUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent("w_member_social r_basicprofile")}` +
      `&state=${state}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success") {
      const { code } = Linking.parse(result.url).queryParams;
      await this.handleLinkedInCallback(code);
    }
  },

  async disconnectAccount(platform: string) {
    const { error } = await supabase
      .from("social_accounts")
      .delete()
      .eq("platform", platform);

    if (error) throw error;
  },

  async handleTwitterCallback(code: string) {
    // Exchange code for tokens and save to database
    const response = await fetch("your-backend-url/twitter/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    await supabase.from("social_accounts").insert([
      {
        platform: "twitter",
        username: data.username,
        profile_image_url: data.profile_image_url,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      },
    ]);
  },

  async handleLinkedInCallback(code: string) {
    // Similar to Twitter callback handling
    const response = await fetch("your-backend-url/linkedin/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    await supabase.from("social_accounts").insert([
      {
        platform: "linkedin",
        username: data.username,
        profile_image_url: data.profile_image_url,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      },
    ]);
  },

  async generateCodeChallenge(): Promise<string> {
    const verifier = Math.random().toString(36).substring(7);
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  },
};
