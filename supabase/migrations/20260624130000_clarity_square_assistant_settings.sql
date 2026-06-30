-- Kramaniti Clarity Square assistant settings
-- Stores user-owned response-style preferences for the dedicated Square Assistant.

alter table clarity_square.profiles
add column if not exists assistant_settings jsonb not null default '{}'::jsonb;
