-- ============================================================
-- Noor-E-Islam Madrasha Management System - Database Schema
-- ============================================================

-- PROFILES (extends auth.users with role info)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null check (role in ('student', 'teacher', 'admin')),
  display_id text unique,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "Admins can insert profiles" on public.profiles for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, role, display_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'display_id'
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- NOTICES
create table if not exists public.notices (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  content text not null,
  date text not null,
  type text not null check (type in ('general', 'exam', 'fee', 'result', 'holiday')),
  target text not null check (target in ('all', 'student', 'teacher')),
  is_important boolean default false,
  posted_by text not null,
  attachment_name text,
  attachment_data text,
  created_at timestamptz default now()
);
alter table public.notices enable row level security;
create policy "Anyone authenticated can view notices" on public.notices for select using (auth.role() = 'authenticated');
create policy "Admins can insert notices" on public.notices for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "Admins can delete notices" on public.notices for delete using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "Admins can update notices" on public.notices for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- TEACHERS
create table if not exists public.teachers (
  id text primary key,
  teacher_id text unique not null,
  name text not null,
  name_bn text,
  designation text,
  department text,
  subject text[],
  classes text[],
  class_subjects jsonb,
  phone text,
  email text,
  address text,
  qualification text,
  join_date text,
  image text,
  created_at timestamptz default now()
);
alter table public.teachers enable row level security;
create policy "Anyone authenticated can view teachers" on public.teachers for select using (auth.role() = 'authenticated');
create policy "Admins can manage teachers" on public.teachers for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- STUDENTS
create table if not exists public.students (
  id text primary key,
  student_id text unique not null,
  name text not null,
  name_bn text,
  father_name text,
  mother_name text,
  class text,
  section text,
  roll integer,
  session text,
  dob text,
  gender text,
  religion text,
  phone text,
  guardian_phone text,
  address text,
  blood_group text,
  birth_cert_no text,
  image text,
  registration_status text default 'approved' check (registration_status in ('pending', 'approved', 'rejected')),
  fee_status text default 'due' check (fee_status in ('paid', 'due', 'partial')),
  created_at timestamptz default now()
);
alter table public.students enable row level security;
create policy "Authenticated users can view students" on public.students for select using (auth.role() = 'authenticated');
create policy "Admins can manage students" on public.students for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- FEES
create table if not exists public.fees (
  id text primary key default gen_random_uuid()::text,
  student_id text references public.students(student_id),
  student_name text,
  class text,
  fee_type text,
  amount numeric,
  due_date text,
  paid_date text,
  status text default 'due' check (status in ('paid', 'due', 'partial')),
  receipt_no text,
  created_at timestamptz default now()
);
alter table public.fees enable row level security;
create policy "Authenticated users can view fees" on public.fees for select using (auth.role() = 'authenticated');
create policy "Admins can manage fees" on public.fees for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- EXAM RESULTS
create table if not exists public.exam_results (
  id bigserial primary key,
  student_id text references public.students(student_id),
  student_name text,
  class text,
  roll integer,
  subjects jsonb,
  total_marks numeric,
  gpa numeric,
  grade text,
  status text check (status in ('pass', 'fail')),
  exam_name text,
  year text,
  created_at timestamptz default now()
);
alter table public.exam_results enable row level security;
create policy "Authenticated users can view results" on public.exam_results for select using (auth.role() = 'authenticated');
create policy "Admins can manage results" on public.exam_results for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- EXAM SCHEDULES
create table if not exists public.exam_schedules (
  id text primary key default gen_random_uuid()::text,
  exam_name text,
  class text,
  date text,
  start_time text,
  end_time text,
  subject text,
  room text,
  created_at timestamptz default now()
);
alter table public.exam_schedules enable row level security;
create policy "Authenticated users can view schedules" on public.exam_schedules for select using (auth.role() = 'authenticated');
create policy "Admins can manage schedules" on public.exam_schedules for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ATTENDANCE
create table if not exists public.attendance (
  id text primary key default gen_random_uuid()::text,
  student_id text references public.students(student_id),
  student_name text,
  class text,
  date text,
  status text check (status in ('present', 'absent', 'late')),
  created_at timestamptz default now()
);
alter table public.attendance enable row level security;
create policy "Authenticated users can view attendance" on public.attendance for select using (auth.role() = 'authenticated');
create policy "Teachers and admins can manage attendance" on public.attendance for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'teacher'))
);
