drop policy if exists "Users can read their own product events" on clarity_square.product_events;
drop policy if exists "Users can insert their own product events" on clarity_square.product_events;
drop policy if exists "clarity_square_product_events_select_own" on clarity_square.product_events;
drop policy if exists "clarity_square_product_events_insert_own" on clarity_square.product_events;

create policy "clarity_square_product_events_select_own"
  on clarity_square.product_events for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "clarity_square_product_events_insert_own"
  on clarity_square.product_events for insert to authenticated
  with check ((select auth.uid()) = user_id);
