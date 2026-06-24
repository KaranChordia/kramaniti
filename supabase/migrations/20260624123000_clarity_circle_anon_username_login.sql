-- Kramaniti Clarity Circle username sign-in access
-- Lets the unauthenticated sign-in screen resolve a username before password auth.

grant usage on schema clarity_circle to anon;
grant execute on function clarity_circle.resolve_login_email(text) to anon, authenticated;
