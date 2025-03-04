import { create } from "zustand";
import { deepseek } from "../lib/deepseek";

interface AIContentState {
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  generatePost: (options: {
    prompt: string;
    platform: string;
    tone?: string;
  }) => Promise<string>;
  getSuggestions: (content: string, platform: string) => Promise<void>;
}

export const useAIContentStore = create<AIContentState>((set, get) => ({
  isLoading: false,
  error: null,
  suggestions: [],

  generatePost: async ({ prompt, platform, tone }) => {
    try {
      set({ isLoading: true, error: null });
      const content = await deepseek.generate({ prompt, platform, tone });
      set({ isLoading: false });
      return content;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to generate content",
      });
      throw error;
    }
  },

  getSuggestions: async (content: string, platform: string) => {
    try {
      set({ isLoading: true, error: null });
      const suggestions = await deepseek.generateSuggestions(content, platform);
      set({ suggestions, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to get suggestions",
        suggestions: [],
      });
      throw error;
    }
  },
}));
