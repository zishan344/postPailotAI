import { create } from "zustand";
import {
  generateContent,
  generateSuggestions,
  GenerationParams,
} from "../lib/deepseek";

interface AIContentState {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;

  generatePost: (params: GenerationParams) => Promise<string>;
  getSuggestions: (content: string, platform: string) => Promise<void>;
  clearSuggestions: () => void;
}

export const useAIContentStore = create<AIContentState>((set) => ({
  suggestions: [],
  isLoading: false,
  error: null,

  generatePost: async (params: GenerationParams) => {
    set({ isLoading: true, error: null });
    try {
      const content = await generateContent(params);
      set({ isLoading: false });
      return content;
    } catch (error) {
      set({ error: "Failed to generate content", isLoading: false });
      throw error;
    }
  },

  getSuggestions: async (content: string, platform: string) => {
    set({ isLoading: true, error: null });
    try {
      const suggestions = await generateSuggestions(content, platform);
      set({ suggestions, isLoading: false });
    } catch (error) {
      set({ error: "Failed to generate suggestions", isLoading: false });
      throw error;
    }
  },

  clearSuggestions: () => {
    set({ suggestions: [] });
  },
}));
