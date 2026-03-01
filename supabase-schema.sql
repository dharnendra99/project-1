-- ============================================
-- Anti-Gravity Portfolio — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================
-- PROJECTS TABLE
-- ==================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT,
  long_desc TEXT,
  thumbnail_url TEXT,
  images TEXT[] DEFAULT '{}',
  tech_tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Full Stack',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('live', 'draft')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- SKILLS TABLE
-- ==================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('Frontend', 'Backend', 'Tools')),
  icon_url TEXT,
  proficiency INTEGER DEFAULT 3 CHECK (proficiency BETWEEN 1 AND 5),
  years_exp INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0
);

-- ==================
-- EXPERIENCE TABLE
-- ==================
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('work', 'education')),
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  order_index INTEGER DEFAULT 0
);

-- ==================
-- CONTACT MESSAGES TABLE
-- ==================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- SITE SETTINGS TABLE
-- ==================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- ROW LEVEL SECURITY
-- ==================

-- Projects: public can read live, authenticated can do everything
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view live projects"
  ON projects FOR SELECT
  USING (status = 'live');

CREATE POLICY "Authenticated users full access to projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

-- Skills: public can read, authenticated can do everything
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users full access to skills"
  ON skills FOR ALL
  USING (auth.role() = 'authenticated');

-- Experience: public can read, authenticated can do everything
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view experience"
  ON experience FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users full access to experience"
  ON experience FOR ALL
  USING (auth.role() = 'authenticated');

-- Contact Messages: public can insert, authenticated can do everything
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users full access to messages"
  ON contact_messages FOR ALL
  USING (auth.role() = 'authenticated');

-- Site Settings: public can read, authenticated can do everything
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users full access to settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- ==================
-- STORAGE BUCKETS (run in Supabase Dashboard → Storage)
-- ==================
-- Create these buckets manually:
-- 1. project-images (public)
-- 2. avatars (public)
-- 3. resume (public)
