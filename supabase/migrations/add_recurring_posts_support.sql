-- Add recurring post fields to scheduled_posts table
alter table scheduled_posts 
add column is_recurring boolean default false,
add column frequency text check (frequency in ('daily', 'weekly', 'monthly')),
add column recurring_days integer[],
add column end_date timestamp with time zone,
add column parent_post_id uuid references scheduled_posts(id) on delete set null;

-- Create a table for tracking recurring post instances
create table recurring_post_instances (
  id uuid default gen_random_uuid() primary key,
  parent_post_id uuid references scheduled_posts(id) on delete cascade,
  scheduled_for timestamp with time zone not null,
  status post_status default 'scheduled',
  published_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies for recurring_post_instances
alter table recurring_post_instances enable row level security;

create policy "Users can view their own recurring post instances"
  on recurring_post_instances for select
  using (
    auth.uid() = (
      select user_id 
      from scheduled_posts 
      where id = recurring_post_instances.parent_post_id
    )
  );

-- Create function to generate recurring post instances
create or replace function generate_recurring_post_instances()
returns trigger as $$
declare
  next_date timestamp with time zone;
  end_date timestamp with time zone;
  day integer;
begin
  -- Only process recurring posts
  if not NEW.is_recurring then
    return NEW;
  end if;

  end_date := coalesce(NEW.end_date, NEW.scheduled_for + interval '1 year');

  -- Generate instances based on frequency
  next_date := NEW.scheduled_for;
  while next_date <= end_date loop
    -- For weekly posts, check if the day is selected
    if NEW.frequency = 'weekly' then
      if NEW.recurring_days @> array[extract(dow from next_date)::integer] then
        insert into recurring_post_instances (parent_post_id, scheduled_for)
        values (NEW.id, next_date);
      end if;
      next_date := next_date + interval '1 day';
    
    -- For monthly posts, check if the day is selected
    elsif NEW.frequency = 'monthly' then
      if NEW.recurring_days @> array[extract(day from next_date)::integer] then
        insert into recurring_post_instances (parent_post_id, scheduled_for)
        values (NEW.id, next_date);
      end if;
      next_date := next_date + interval '1 day';
    
    -- For daily posts, simply add each day
    else
      insert into recurring_post_instances (parent_post_id, scheduled_for)
      values (NEW.id, next_date);
      next_date := next_date + interval '1 day';
    end if;
  end loop;

  return NEW;
end;
$$ language plpgsql;

-- Create trigger for generating recurring post instances
create trigger generate_recurring_post_instances_trigger
  after insert on scheduled_posts
  for each row
  when (NEW.is_recurring)
  execute function generate_recurring_post_instances(); 