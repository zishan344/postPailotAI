import axios from "axios";

const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY!;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1";

const deepseekClient = axios.create({
  baseURL: DEEPSEEK_API_URL,
  headers: {
    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    "Content-Type": "application/json",
  },
});

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
    const response = await deepseekClient.post("/generate", {
      prompt: `Generate a ${tone} social media post for ${platform} about: ${prompt}. Keep it under ${maxLength} characters.`,
      max_tokens: maxLength,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
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
    const response = await deepseekClient.post("/suggestions", {
      prompt: `Suggest 3 alternative versions of this social media post for ${platform}: ${content}`,
      max_tokens: 500,
      temperature: 0.8,
    });

    return response.data.choices[0].text
      .split("\n")
      .filter((text: string) => text.trim().length > 0)
      .slice(0, 3);
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw new Error("Failed to generate suggestions");
  }
};
