# AI Social Media Scheduler – Mobile App

A React Native mobile application for AI-powered social media post scheduling that helps users automate and optimize their social media presence.

## Core Features

- Writes, schedules, and posts content automatically
- Optimizes engagement using AI-generated hashtags & keywords
- Supports Twitter, LinkedIn, Instagram, and Facebook posting
- Mobile-friendly analytics & content calendar
- Push notifications for post updates and engagement
- Offline support for draft posts
- Image editing and filtering capabilities
- Share extension for quick posting

## Technical Features

- **AI-Powered Content Generation**: Integration with DeepSeek API
- **Post Scheduling & Automation**: Background tasks with React Native
- **Multi-Platform Support**: Twitter, LinkedIn, Facebook, Instagram
- **Mobile UI**: React Native + Native Base or Tailwind RN
- **Payment & Subscription**: In-App Purchases / Stripe SDK
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Image Processing**: React Native Image Picker & Image Manipulation

## Architecture & Tech Stack

### Mobile App

- React Native / Expo
- Native Base or Tailwind RN for UI components
- React Navigation for routing
- Redux Toolkit / Zustand for state management
- React Query for data fetching
- Async Storage for local data

### Backend

- Django + Django REST Framework (DRF)
- PostgreSQL for database
- DeepSeek API for AI content generation
- Firebase for push notifications
- Redis for caching

### Authentication & Payments

- Firebase Auth
- In-App Purchases (IAP)
- Stripe Mobile SDK

### Deployment

- Mobile: App Store & Play Store
- Backend: Railway / DigitalOcean / AWS

## Database Schema

### User

- id: UUID (primary key)
- email: String
- username: String
- password: String (hashed)
- created_at: DateTime
- is_active: Boolean
- subscription_status: String
- subscription_end_date: DateTime
- device_token: String
- notification_settings: JSONField

### Profile

- id: UUID (primary key)
- user: ForeignKey(User)
- company_name: String
- website: String
- timezone: String
- profile_picture: String (URL)
- notification_preferences: JSONField

### SocialAccount

- id: UUID (primary key)
- user: ForeignKey(User)
- platform: String (Twitter/LinkedIn/Facebook/Instagram)
- access_token: String
- refresh_token: String
- platform_user_id: String
- connected_at: DateTime

### Post

- id: UUID (primary key)
- user: ForeignKey(User)
- content: Text
- media_urls: JSONField
- scheduled_time: DateTime
- published_time: DateTime
- status: String (draft/scheduled/published/failed)
- platform: String
- engagement_metrics: JSONField
- is_ai_generated: Boolean
- local_media_paths: JSONField
- offline_status: String

### Campaign

- id: UUID (primary key)
- user: ForeignKey(User)
- name: String
- description: Text
- start_date: DateTime
- end_date: DateTime
- status: String

### CampaignPost

- id: UUID (primary key)
- campaign: ForeignKey(Campaign)
- post: ForeignKey(Post)

### Subscription

- id: UUID (primary key)
- user: ForeignKey(User)
- plan_type: String
- status: String
- start_date: DateTime
- end_date: DateTime
- payment_status: String
- platform: String (ios/android)
- receipt_data: JSONField
- coupon_applied: ForeignKey(Coupon, null=True)
- original_price: Decimal
- final_price: Decimal

### Analytics

- id: UUID (primary key)
- post: ForeignKey(Post)
- likes: Integer
- shares: Integer
- comments: Integer
- impressions: Integer
- recorded_at: DateTime

### Coupon

- id: UUID (primary key)
- code: String (unique)
- discount_type: String (percentage/fixed)
- discount_value: Decimal
- start_date: DateTime
- end_date: DateTime
- max_uses: Integer
- current_uses: Integer
- min_purchase_amount: Decimal
- is_active: Boolean
- created_at: DateTime
- user_specific: Boolean
- allowed_subscription_plans: JSONField
- description: Text

### UserCoupon

- id: UUID (primary key)
- user: ForeignKey(User)
- coupon: ForeignKey(Coupon)
- used_at: DateTime
- order_id: String
- amount_saved: Decimal

## Mobile App Structure

## Get Started

- [Start Free Trial](#)
- [Automate Social Media Now](#)
- [Get AI-Generated Posts Instantly](#)
