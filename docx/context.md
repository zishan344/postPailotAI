## Architecture & Tech Stack

### Mobile App

- React Native / Expo
- React Native Paper for UI components
- React Navigation for routing
- Zustand for state management
- React Query for data fetching
- Async Storage for local data

### Backend

- Supabase for:
  - Database (PostgreSQL)
  - Authentication
  - Real-time subscriptions
  - Storage for media files
  - Edge Functions for serverless computing
- DeepSeek API for AI content generation
- Firebase for push notifications
- Redis for caching

### Authentication & Payments

- Supabase Auth
- In-App Purchases (IAP)
- Stripe Mobile SDK

### Deployment

- Mobile: App Store & Play Store
- Backend: Supabase Cloud

## Database Schema (Supabase)

### Users (Built-in Supabase Auth)

- id: UUID (primary key, managed by Supabase Auth)
- email: String
- created_at: DateTime
- last_sign_in: DateTime
- metadata: JSON

### Profiles

- id: UUID (primary key, references auth.users.id)
- username: String
- company_name: String
- website: String
- timezone: String
- profile_picture: String (URL)
- notification_preferences: JSONB
- subscription_status: String
- subscription_end_date: DateTime
- device_token: String
- created_at: DateTime
- updated_at: DateTime

### Social_Accounts

- id: UUID (primary key)
- user_id: UUID (references auth.users.id)
- platform: String (Twitter/LinkedIn/Facebook/Instagram)
- access_token: String
- refresh_token: String
- platform_user_id: String
- connected_at: DateTime
- updated_at: DateTime

## Mobile App Structure

### UI Components (React Native Paper)

- CustomButton
- PostCard
- MediaPicker
- AnalyticsChart
- ScheduleCalendar
- PlatformSelector
- NotificationBadge
- SubscriptionCard

### Screens

- Auth
  - Login
  - Register
  - ForgotPassword
- Main
  - Dashboard
  - PostCreation
  - Schedule
  - Analytics
  - Settings
- Profile
  - UserProfile
  - SocialAccounts
  - Subscription
  - Notifications

### Navigation

- AuthStack
- MainStack
- ProfileStack
- ModalStack

### State Management

- useAuthStore (Zustand)
- usePostStore (Zustand)
- useSettingsStore (Zustand)

### API Integration

- supabaseClient
- queryClient (React Query)
- deepseekClient
- stripeClient
