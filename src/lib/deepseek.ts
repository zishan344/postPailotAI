import { EXPO_PUBLIC_OPENROUTER_API_KEY } from "@env";

interface GenerateOptions {
  prompt: string;
  platform: string;
  tone?: string;
  maxTokens?: number;
}

export const deepseek = {
  async generate({
    prompt,
    platform,
    tone = "professional",
    maxTokens = 500,
  }: GenerateOptions) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${EXPO_PUBLIC_OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://postpilotai.com",
            "X-Title": "PostPilotAI",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat:free",
            messages: [
              {
                role: "system",
                content: `You are a social media content expert. Create content for ${platform} with a ${tone} tone.`,
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: maxTokens,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("OpenRouter API error:", error);
      throw error;
    }
  },

  async generateSuggestions(
    content: string,
    platform: string
  ): Promise<string[]> {
    try {
      if (!content.trim()) {
        throw new Error("Content cannot be empty");
      }

      if (!platform) {
        throw new Error("Platform must be selected");
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${EXPO_PUBLIC_OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://postpilotai.com",
            "X-Title": "PostPilotAI",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a social media content expert. Provide 3 alternative versions of the given post, numbered 1-3.",
              },
              {
                role: "user",
                content: `Generate 3 alternative versions of this ${platform} post:\n${content}`,
              },
            ],
            max_tokens: 1000,
            temperature: 0.8,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const suggestions = data.choices[0].message.content
        .split(/\d\./)
        .filter(Boolean)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 3);

      if (suggestions.length === 0) {
        throw new Error("No valid suggestions received");
      }

      return suggestions;
    } catch (error) {
      console.error("OpenRouter API error:", error);
      throw error;
    }
  },
};

export interface GenerationParams {
  prompt: string;
  tone?: "professional" | "casual" | "friendly" | "engaging";
  platform?: "twitter" | "linkedin" | "facebook" | "instagram";
  maxLength?: number;
}

export const generateContent = async ({
  prompt,
  tone = "professional",
  platform = "twitter",
  maxLength = 280,
}: GenerationParams): Promise<string> => {
  try {
    const response = await fetch(
      `${EXPO_PUBLIC_OPENROUTER_API_KEY}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${EXPO_PUBLIC_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are a social media content expert. Create content for ${platform} with a ${tone} tone.`,
            },
            {
              role: "user",
              content: `Generate a ${tone} social media post for ${platform} about: ${prompt}. Keep it under ${maxLength} characters.`,
            },
          ],
          max_tokens: maxLength,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw new Error("Failed to generate content");
  }
};

export const generateSuggestions = async (
  content: string,
  platform: string
): Promise<string[]> => {
  try {
    const response = await fetch(
      `${EXPO_PUBLIC_OPENROUTER_API_KEY}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${EXPO_PUBLIC_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are a social media content expert. Create content for ${platform} with a professional tone.`,
            },
            {
              role: "user",
              content: `Suggest 3 alternative versions of this social media post for ${platform}: ${content}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0].message.content
        ?.split("\n")
        .filter((text: string) => text.trim().length > 0)
        .slice(0, 3) || []
    );
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw new Error("Failed to generate suggestions");
  }
};
