export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  PRO: "pro",
} as const;

export const POST_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  FAILED: "failed",
} as const;

export const SOCIAL_PLATFORMS = {
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
} as const;

export const ERROR_MESSAGES = {
  DEFAULT: "An error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_IN_USE: "Email already in use",
    WEAK_PASSWORD: "Password is too weak",
  },
  UPLOAD: {
    FILE_TOO_LARGE: "File size exceeds limit",
    INVALID_TYPE: "Invalid file type",
  },
} as const;
