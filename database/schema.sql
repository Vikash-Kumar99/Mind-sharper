-- Mind Shaper PostgreSQL / Supabase Relational Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extensions of auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    xp integer default 0 not null,
    level integer default 1 not null,
    streak_count integer default 0 not null,
    last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Allow public read-access to profiles" on public.profiles for select using (true);
create policy "Allow users to edit their own profile" on public.profiles for update using (auth.uid() = id);

-- 2. HABITS TABLE
create table public.habits (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    category text not null, -- 'mindfulness', 'learning', 'exercise', 'work', 'health'
    frequency text default 'daily' not null,
    streak integer default 0 not null,
    last_completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.habits enable row level security;
create policy "Users can modify their own habits" on public.habits for all using (auth.uid() = user_id);

-- 3. HABIT LOGS TABLE
create table public.habit_logs (
    id uuid default gen_random_uuid() primary key,
    habit_id uuid references public.habits(id) on delete cascade not null,
    completed_date date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(habit_id, completed_date)
);

alter table public.habit_logs enable row level security;
create policy "Users can modify logs of their own habits" on public.habit_logs 
    for all using (exists (select 1 from public.habits where id = habit_logs.habit_id and user_id = auth.uid()));

-- 4. GOALS TABLE
create table public.goals (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    status text default 'pending' not null check (status in ('pending', 'completed')),
    xp_reward integer default 150 not null,
    target_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;
create policy "Users can modify their own goals" on public.goals for all using (auth.uid() = user_id);

-- 5. MOOD LOGS TABLE
create table public.mood_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    mood_score integer not null check (mood_score >= 1 and mood_score <= 5),
    note text,
    logged_date date default current_date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.mood_logs enable row level security;
create policy "Users can modify their own mood logs" on public.mood_logs for all using (auth.uid() = user_id);

-- 6. FOCUS SESSIONS TABLE
create table public.focus_sessions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    duration_minutes integer not null,
    type text default 'pomodoro' not null check (type in ('pomodoro', 'deep_work')),
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.focus_sessions enable row level security;
create policy "Users can modify their own focus sessions" on public.focus_sessions for all using (auth.uid() = user_id);

-- 7. EXERCISE SCORES TABLE
create table public.exercise_scores (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    game_type text not null check (game_type in ('memory', 'focus', 'reflex')),
    score integer not null,
    xp_earned integer not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exercise_scores enable row level security;
create policy "Users can modify their own exercise scores" on public.exercise_scores for all using (auth.uid() = user_id);

-- 8. ACHIEVEMENTS TABLE
create table public.achievements (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    icon_key text not null,
    xp_reward integer not null,
    criteria_type text not null, -- 'focus_minutes', 'streak_days', 'game_xp', 'mood_entries'
    criteria_val integer not null
);

alter table public.achievements enable row level security;
create policy "Achievements are readable by everyone" on public.achievements for select using (true);

-- Populate achievements list
insert into public.achievements (title, description, icon_key, xp_reward, criteria_type, criteria_val) values
('First Light', 'Log your first brain training score', 'sparkles', 100, 'game_xp', 50),
('Focus Master', 'Complete a deep work focus session of 25 minutes or more', 'zap', 200, 'focus_minutes', 25),
('Iron Will', 'Maintain a brain training streak of 5 active daily logs', 'flame', 300, 'streak_days', 5),
('Mind Architect', 'Accumulate 2,000 Total XP across games and habits', 'brain', 500, 'game_xp', 2000),
('Inner Zen', 'Log your mood 3 days in a row to establish mindful awareness', 'heart', 150, 'mood_entries', 3)
on conflict do nothing;

-- 9. USER ACHIEVEMENTS TABLE
create table public.user_achievements (
    user_id uuid references public.profiles(id) on delete cascade not null,
    achievement_id uuid references public.achievements(id) on delete cascade not null,
    unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;
create policy "Users can read their own achievement triggers" on public.user_achievements for select using (auth.uid() = user_id);

-- ==========================================
-- TRIGGERS & PROCEDURES (GAMIFICATION ENGINE)
-- ==========================================

-- A. Auto-handle leveling progression
create or replace function public.process_xp_leveling()
returns trigger as $$
declare
    new_level integer;
    target_xp integer;
begin
    -- Simple leveling threshold: level * 1000
    -- E.g., Level 1 requires 1000 XP to reach Level 2, Level 2 requires 2000 XP (3000 total) to reach Level 3, etc.
    -- Cumulative formula: Level = floor((sqrt(2 * xp + 25) + 5) / 10) approximate, or linear logic:
    -- Level 1: 0 - 999 XP
    -- Level 2: 1000 - 1999 XP
    -- Level 3: 2000 - 2999 XP
    -- Let's use easy linear leveling: Level = 1 + floor(xp / 1000)
    
    new_level := 1 + floor(NEW.xp / 1000);
    
    if new_level != NEW.level then
        NEW.level := new_level;
    end if;
    
    return NEW;
end;
$$ language plpgsql;

create trigger tr_xp_leveling
before update of xp on public.profiles
for each row
execute function public.process_xp_leveling();


-- B. Auto-update profile XP from exercise scores
create or replace function public.log_exercise_xp()
returns trigger as $$
begin
    update public.profiles
    set xp = xp + NEW.xp_earned,
        last_active_at = timezone('utc'::text, now())
    where id = NEW.user_id;
    return NEW;
end;
$$ language plpgsql;

create trigger tr_log_exercise_xp
after insert on public.exercise_scores
for each row
execute function public.log_exercise_xp();


-- C. Auto-update profile XP from completing focus sessions
create or replace function public.log_focus_xp()
returns trigger as $$
declare
    earned_xp integer;
begin
    -- 1 XP per minute of focus
    earned_xp := NEW.duration_minutes;
    
    update public.profiles
    set xp = xp + earned_xp,
        last_active_at = timezone('utc'::text, now())
    where id = NEW.user_id;
    return NEW;
end;
$$ language plpgsql;

create trigger tr_log_focus_xp
after insert on public.focus_sessions
for each row
execute function public.log_focus_xp();
