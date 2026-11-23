-- 공정 튜터 계정 동기화 표. Supabase 대시보드 → SQL Editor에 붙여 넣고 Run.
-- 사용자 한 명당 한 줄: 이 브라우저의 'tutor.*' 공부 기록(노트·진도·일정·오답·실무 연습 답안)을 JSON으로 묶어 둡니다.
-- RLS로 "로그인한 본인 줄만" 읽고 쓸 수 있습니다. API 키는 저장하지 않습니다.

create table if not exists public.study_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.study_data enable row level security;

drop policy if exists "본인 기록 읽기" on public.study_data;
drop policy if exists "본인 기록 만들기" on public.study_data;
drop policy if exists "본인 기록 고치기" on public.study_data;
drop policy if exists "본인 기록 지우기" on public.study_data;

create policy "본인 기록 읽기" on public.study_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "본인 기록 만들기" on public.study_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "본인 기록 고치기" on public.study_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "본인 기록 지우기" on public.study_data for delete to authenticated using ((select auth.uid()) = user_id);
