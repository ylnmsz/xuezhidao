CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  grade TEXT,
  class_name TEXT,
  school TEXT,
  signature TEXT,
  level INT DEFAULT 1,
  streak_days INT DEFAULT 0,
  weekly_study_hours NUMERIC(5,1) DEFAULT 0,
  homework_done INT DEFAULT 0,
  accuracy NUMERIC(5,2) DEFAULT 0,
  points INT DEFAULT 0,
  combat_power INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_members (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes(id),
  user_id UUID REFERENCES users(id),
  role TEXT DEFAULT 'student',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure a user cannot be added to the same class multiple times
-- Remove any accidental duplicate memberships, keeping the earliest joined_at per (class_id, user_id)
WITH duplicates AS (
  SELECT id
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY class_id, user_id ORDER BY joined_at, id) AS rn
    FROM class_members
  ) t
  WHERE t.rn > 1
)
DELETE FROM class_members WHERE id IN (SELECT id FROM duplicates);

CREATE UNIQUE INDEX IF NOT EXISTS idx_class_member_unique ON class_members(class_id, user_id);

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes(id),
  teacher_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  question_ids JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrations: add columns if upgrading from older schema
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES users(id);
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS question_ids JSONB NOT NULL DEFAULT '[]';

-- Add gamification columns to users (if upgrading from older schema)
ALTER TABLE users ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS combat_power INT DEFAULT 0;

-- Add practice tracking columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS practice_questions_done INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_practice_time_seconds INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_practice_date DATE;

-- Add student_answer column to error_book
ALTER TABLE error_book ADD COLUMN IF NOT EXISTS student_answer TEXT;

-- Migrate English question_type values to Chinese
UPDATE questions SET question_type = '单选题' WHERE question_type = 'single_choice';
UPDATE questions SET question_type = '多选题' WHERE question_type IN ('multi_choice', 'multiple_choice');
UPDATE questions SET question_type = '判断题' WHERE question_type = 'true_false';
UPDATE questions SET question_type = '填空题' WHERE question_type = 'fill_blank';
UPDATE questions SET question_type = '简答题' WHERE question_type = 'short_answer';
UPDATE questions SET question_type = '问答题' WHERE question_type = 'essay';
UPDATE questions SET question_type = '阅读理解' WHERE question_type = 'reading_comprehension';
UPDATE questions SET question_type = '连线题' WHERE question_type = 'matching';
UPDATE questions SET question_type = '翻译题' WHERE question_type = 'english_translation';
UPDATE questions SET question_type = '改错题' WHERE question_type IN ('english_error_correction', 'error_correction');
UPDATE questions SET question_type = '编程题' WHERE question_type = 'programming';
UPDATE questions SET question_type = '完形填空' WHERE question_type = 'cloze';
UPDATE questions SET question_type = '古诗默写' WHERE question_type = 'classical_poem_dictation';
UPDATE questions SET question_type = '翻译' WHERE question_type = 'translation';
UPDATE questions SET question_type = '其他' WHERE question_type = 'other';

-- Migrate English subject values to Chinese
UPDATE questions SET subject = '语文' WHERE LOWER(subject) = 'chinese';
UPDATE questions SET subject = '数学' WHERE LOWER(subject) IN ('math', 'mathematics');
UPDATE questions SET subject = '英语' WHERE LOWER(subject) = 'english';
UPDATE questions SET subject = '物理' WHERE LOWER(subject) = 'physics';
UPDATE questions SET subject = '化学' WHERE LOWER(subject) = 'chemistry';
UPDATE questions SET subject = '生物' WHERE LOWER(subject) = 'biology';
UPDATE questions SET subject = '历史' WHERE LOWER(subject) = 'history';
UPDATE questions SET subject = '政治' WHERE LOWER(subject) IN ('politics', 'political');
UPDATE questions SET subject = '地理' WHERE LOWER(subject) = 'geography';

-- Points log for tracking point earnings and history
CREATE TABLE IF NOT EXISTS points_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  points INT NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id),
  student_id UUID REFERENCES users(id),
  content TEXT,
  score NUMERIC(5,2),
  status TEXT DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  graded_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS question_banks (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY,
  bank_id UUID REFERENCES question_banks(id),
  content TEXT NOT NULL,
  stem_image_url TEXT,
  option_images TEXT,
  subject TEXT,
  grade TEXT,
  difficulty TEXT,
  question_type TEXT,
  answer TEXT,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS error_book (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question_id UUID REFERENCES questions(id),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_invites (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes(id),
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE users ADD COLUMN IF NOT EXISTS study_goal TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reminder_time TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS weak_subjects JSONB DEFAULT '[]'::jsonb;
