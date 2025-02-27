-- Trigger for new comments
create or replace function notify_post_comment() returns trigger as $$
begin
  perform create_notification(
    (select user_id from posts where id = new.post_id),
    'New Comment',
    format('%s commented on your post', (select username from profiles where id = new.user_id)),
    'comment'::notification_type,
    jsonb_build_object(
      'post_id', new.post_id,
      'comment_id', new.id,
      'commenter_id', new.user_id
    )
  );
  return new;
end;
$$ language plpgsql;

create trigger on_new_comment
  after insert on comments
  for each row
  execute function notify_post_comment();

-- Trigger for scheduled posts
create or replace function notify_scheduled_post() returns trigger as $$
begin
  -- Create a notification 15 minutes before the scheduled time
  perform create_notification(
    new.user_id,
    'Scheduled Post Reminder',
    format('Your post is scheduled to be published in 15 minutes'),
    'schedule'::notification_type,
    jsonb_build_object(
      'post_id', new.id,
      'scheduled_for', new.scheduled_for
    )
  )
  where new.scheduled_for is not null
    and new.scheduled_for > now()
    and new.status = 'scheduled';
  return new;
end;
$$ language plpgsql;

create trigger on_post_schedule
  after insert or update of scheduled_for on posts
  for each row
  execute function notify_scheduled_post(); 