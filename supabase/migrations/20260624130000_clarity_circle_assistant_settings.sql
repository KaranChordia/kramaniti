-- Kramaniti Clarity Circle assistant settings
-- Stores user-owned response-style preferences for the dedicated Circle Assistant.

alter table clarity_circle.profiles
add column if not exists assistant_settings jsonb not null default '{}'::jsonb;
