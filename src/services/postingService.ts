import { supabase } from "../lib/supabase";

interface PostContent {
  text: string;
  mediaUrls?: string[];
  platform: string;
  scheduledFor: Date;
}

export const postingService = {
  async publishToTwitter(content: PostContent) {
    const { data: account } = await supabase
      .from("social_accounts")
      .select("access_token")
      .eq("platform", "twitter")
      .single();

    if (!account) throw new Error("Twitter account not connected");

    // Upload media first if present
    let mediaIds = [];
    if (content.mediaUrls?.length) {
      mediaIds = await Promise.all(
        content.mediaUrls.map((url) =>
          this.uploadTwitterMedia(url, account.access_token)
        )
      );
    }

    // Post tweet
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: content.text,
        media: mediaIds.length ? { media_ids: mediaIds } : undefined,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post to Twitter");
    }

    return response.json();
  },

  async publishToLinkedIn(content: PostContent) {
    const { data: account } = await supabase
      .from("social_accounts")
      .select("access_token")
      .eq("platform", "linkedin")
      .single();

    if (!account) throw new Error("LinkedIn account not connected");

    // Upload media first if present
    let mediaAssets = [];
    if (content.mediaUrls?.length) {
      mediaAssets = await Promise.all(
        content.mediaUrls.map((url) =>
          this.uploadLinkedInMedia(url, account.access_token)
        )
      );
    }

    // Create LinkedIn post
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: `urn:li:person:${account.id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: content.text,
            },
            media: mediaAssets,
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post to LinkedIn");
    }

    return response.json();
  },

  async uploadTwitterMedia(url: string, accessToken: string) {
    // First, download the media file
    const mediaResponse = await fetch(url);
    const mediaBlob = await mediaResponse.blob();

    // Upload to Twitter
    const formData = new FormData();
    formData.append("media", mediaBlob);

    const response = await fetch(
      "https://upload.twitter.com/1.1/media/upload.json",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload media to Twitter");
    }

    const data = await response.json();
    return data.media_id_string;
  },

  async uploadLinkedInMedia(url: string, accessToken: string) {
    // First, register upload
    const registerResponse = await fetch(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: "urn:li:person:" + account.id,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        }),
      }
    );

    const { value } = await registerResponse.json();

    // Upload the image
    const mediaResponse = await fetch(url);
    const mediaBlob = await mediaResponse.blob();

    await fetch(
      value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl,
      {
        method: "PUT",
        body: mediaBlob,
      }
    );

    return {
      status: "READY",
      asset: value.asset,
    };
  },

  async schedulePost(content: PostContent) {
    const { error } = await supabase.from("scheduled_posts").insert([
      {
        content: content.text,
        media_urls: content.mediaUrls,
        platforms: [content.platform],
        scheduled_for: content.scheduledFor.toISOString(),
      },
    ]);

    if (error) throw error;
  },
};
