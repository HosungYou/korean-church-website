-- Supabase Database Schema for Korean Church Website
-- Project ID: wesqwvlwieijorayicqf
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table (공지사항, 행사, 일반 게시글)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'event', 'general')) DEFAULT 'announcement',
  category TEXT CHECK (category IN ('general', 'wednesday', 'sunday', 'bible')) DEFAULT 'general',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'scheduled')) DEFAULT 'draft',
  author_email TEXT,
  author_name TEXT,
  cover_image_url TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  excerpt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ
);

-- Email subscribers table (이메일 구독자)
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ
);

-- Newsletter sent table (발송된 뉴스레터 기록)
CREATE TABLE IF NOT EXISTS newsletter_sent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'event', 'general')),
  published_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  recipients TEXT[] DEFAULT '{}'
);

-- Admin users table (관리자 사용자)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor')) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_active ON email_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to posts table
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sent ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Posts policies
-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (status = 'published');

-- Authenticated users can read all posts
CREATE POLICY "Authenticated can read all posts" ON posts
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can insert posts
CREATE POLICY "Authenticated can insert posts" ON posts
  FOR INSERT TO authenticated WITH CHECK (true);

-- Authenticated users can update posts
CREATE POLICY "Authenticated can update posts" ON posts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated users can delete posts
CREATE POLICY "Authenticated can delete posts" ON posts
  FOR DELETE TO authenticated USING (true);

-- Email subscribers policies
-- Authenticated users can manage subscribers
CREATE POLICY "Authenticated can read subscribers" ON email_subscribers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can subscribe" ON email_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can update subscribers" ON email_subscribers
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Newsletter sent policies
CREATE POLICY "Authenticated can manage newsletters" ON newsletter_sent
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin users policies
CREATE POLICY "Authenticated can read admin users" ON admin_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can manage admin users" ON admin_users
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default admin user (update email as needed)
INSERT INTO admin_users (email, name, role)
VALUES ('newhosung@gmail.com', '관리자', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Sample announcement post for testing
INSERT INTO posts (title, content, type, status, author_name, excerpt, published_at)
VALUES (
  '환영합니다',
  '스테이트 칼리지 한인교회 웹사이트에 오신 것을 환영합니다.',
  'announcement',
  'published',
  '관리자',
  '스테이트 칼리지 한인교회 웹사이트에 오신 것을 환영합니다.',
  NOW()
)
ON CONFLICT DO NOTHING;
