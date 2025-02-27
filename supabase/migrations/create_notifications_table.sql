create type notification_type as enum (
  'comment',
  'mention',
  'analytics',
  'schedule',
  'system'
);

create table notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  type notification_type not null,
  read boolean default false,
  data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index notifications_user_id_idx on notifications(user_id);
create index notifications_created_at_idx on notifications(created_at);

-- Set up RLS (Row Level Security)
alter table notifications enable row level security;

create policy "Users can view their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on notifications for delete
  using (auth.uid() = user_id);

-- Function to create notifications
create or replace function create_notification(
  p_user_id uuid,
  p_title text,
  p_body text,
  p_type notification_type,
  p_data jsonb default '{}'::jsonb
) returns notifications as $$
declare
  v_notification notifications;
begin
  insert into notifications (user_id, title, body, type, data)
  values (p_user_id, p_title, p_body, p_type, p_data)
  returning * into v_notification;
  
  return v_notification;
end;
$$ language plpgsql security definer; 