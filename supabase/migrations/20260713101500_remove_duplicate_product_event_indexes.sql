-- The event table existed in the connected project with these equivalent indexes.
-- Keep the earlier names so the query plan stays stable while removing duplicates.

drop index if exists clarity_square.product_events_user_id_created_at_idx;
drop index if exists clarity_square.product_events_user_id_event_name_created_at_idx;
