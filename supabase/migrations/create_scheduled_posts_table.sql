create type post_status as enum ('scheduled', 'published', 'failed');

create table scheduled_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  media_urls text[] default array[]::text[],
  platforms text[] not null,
  scheduled_for timestamp with time zone not null,
  status post_status default 'scheduled',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone,
  error_message text
);

-- Create indexes
create index scheduled_posts_user_id_idx on scheduled_posts(user_id);
create index scheduled_posts_scheduled_for_idx on scheduled_posts(scheduled_for);
create index scheduled_posts_status_idx on scheduled_posts(status);

-- Set up RLS policies
alter table scheduled_posts enable row level security;

create policy "Users can view their own scheduled posts"
  on scheduled_posts for select
  using (auth.uid() = user_id);

create policy "Users can create their own scheduled posts"
  on scheduled_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own scheduled posts"
  on scheduled_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own scheduled posts"
  on scheduled_posts for delete
  using (auth.uid() = user_id); 