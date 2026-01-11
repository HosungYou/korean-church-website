-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Posts 테이블 (공지사항, 이벤트, 일반 게시물)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'event', 'general')),
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'wednesday', 'sunday', 'bible')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_email TEXT,
  author_name TEXT,
  cover_image_url TEXT,
  excerpt TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 기도 요청 테이블
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 새가족 등록 테이블
CREATE TABLE IF NOT EXISTS new_families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  previous_church TEXT,
  baptized BOOLEAN DEFAULT false,
  baptism_date DATE,
  introduction_method TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'visiting', 'registered', 'inactive')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_new_families_status ON new_families(status);

-- RLS (Row Level Security) 정책 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_families ENABLE ROW LEVEL SECURITY;

-- RLS 정책 - profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS 정책 - posts
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update own posts" ON posts
  FOR UPDATE USING (author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authors can delete own posts" ON posts
  FOR DELETE USING (author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - prayer_requests
CREATE POLICY "Anyone can create prayer requests" ON prayer_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public prayer requests are viewable by everyone" ON prayer_requests
  FOR SELECT USING (is_private = false OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update prayer requests" ON prayer_requests
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - new_families
CREATE POLICY "Anyone can register as new family" ON new_families
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view new families" ON new_families
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can update new families" ON new_families
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 설교 테이블
CREATE TABLE IF NOT EXISTS sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL DEFAULT '연규홍 목사',
  scripture TEXT,
  sermon_date DATE NOT NULL,
  youtube_url TEXT,
  youtube_video_id TEXT,
  sermon_type TEXT NOT NULL DEFAULT 'sunday' CHECK (sermon_type IN ('sunday', 'wednesday', 'friday', 'special')),
  series_name TEXT,
  description TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 갤러리 앨범 테이블
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  album_date DATE NOT NULL,
  year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM album_date)) STORED,
  month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM album_date)) STORED,
  category TEXT DEFAULT 'general' CHECK (category IN ('worship', 'event', 'fellowship', 'education', 'general')),
  is_visible BOOLEAN DEFAULT true,
  photo_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 갤러리 사진 테이블
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 성경읽기 계획 테이블
CREATE TABLE IF NOT EXISTS bible_reading_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 성경읽기 일일 항목 테이블
CREATE TABLE IF NOT EXISTS bible_reading_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES bible_reading_plans(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  old_testament TEXT,
  new_testament TEXT,
  psalms TEXT,
  proverbs TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(plan_id, reading_date)
);

-- 히어로 슬라이더 테이블
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  link_text TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 이메일 구독자 테이블
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 교회 구성원 테이블
CREATE TABLE IF NOT EXISTS church_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  korean_name TEXT NOT NULL,
  english_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  birth_date DATE,
  member_type TEXT DEFAULT 'member' CHECK (member_type IN ('pastor', 'elder', 'deacon', 'member', 'new_family')),
  department TEXT,
  baptism_date DATE,
  membership_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred')),
  notes TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 주보 테이블
CREATE TABLE IF NOT EXISTS bulletins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  bulletin_date DATE NOT NULL,
  year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM bulletin_date)) STORED,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  description TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 새가족 등록 테이블 (확장)
CREATE TABLE IF NOT EXISTS new_family_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  korean_name TEXT NOT NULL,
  english_name TEXT,
  birth_date DATE,
  baptism_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  country TEXT DEFAULT 'United States',
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  previous_church_position TEXT,
  previous_church TEXT,
  introduction TEXT,
  family_info TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'visiting', 'registered', 'inactive')),
  admin_notes TEXT,
  contacted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  contacted_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 뉴스레터 발송 로그 테이블
CREATE TABLE IF NOT EXISTS newsletter_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'general' CHECK (type IN ('announcement', 'event', 'general')),
  recipient_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  sent_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 추가 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sermons_sermon_date ON sermons(sermon_date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_sermon_type ON sermons(sermon_type);
CREATE INDEX IF NOT EXISTS idx_sermons_status ON sermons(status);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_album_date ON gallery_albums(album_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_year ON gallery_albums(year);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_is_visible ON gallery_albums(is_visible);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_album_id ON gallery_photos(album_id);
CREATE INDEX IF NOT EXISTS idx_bible_reading_entries_plan_id ON bible_reading_entries(plan_id);
CREATE INDEX IF NOT EXISTS idx_bible_reading_entries_reading_date ON bible_reading_entries(reading_date);
CREATE INDEX IF NOT EXISTS idx_hero_slides_is_active ON hero_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_slides_sort_order ON hero_slides(sort_order);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_is_active ON email_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_church_members_status ON church_members(status);
CREATE INDEX IF NOT EXISTS idx_church_members_member_type ON church_members(member_type);
CREATE INDEX IF NOT EXISTS idx_bulletins_bulletin_date ON bulletins(bulletin_date DESC);
CREATE INDEX IF NOT EXISTS idx_bulletins_year ON bulletins(year);
CREATE INDEX IF NOT EXISTS idx_new_family_registrations_status ON new_family_registrations(status);
CREATE INDEX IF NOT EXISTS idx_new_family_registrations_submitted_at ON new_family_registrations(submitted_at DESC);

-- RLS 활성화 (새 테이블)
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_reading_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_family_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;

-- RLS 정책 - sermons (공개)
CREATE POLICY "Published sermons are viewable by everyone" ON sermons
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage sermons" ON sermons
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - gallery_albums (공개)
CREATE POLICY "Visible albums are viewable by everyone" ON gallery_albums
  FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage albums" ON gallery_albums
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - gallery_photos (공개)
CREATE POLICY "Photos in visible albums are viewable" ON gallery_photos
  FOR SELECT USING (EXISTS (SELECT 1 FROM gallery_albums WHERE id = album_id AND is_visible = true));
CREATE POLICY "Admins can manage photos" ON gallery_photos
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - bible_reading_plans (공개)
CREATE POLICY "Active plans are viewable by everyone" ON bible_reading_plans
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON bible_reading_plans
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - bible_reading_entries (공개)
CREATE POLICY "Entries in active plans are viewable" ON bible_reading_entries
  FOR SELECT USING (EXISTS (SELECT 1 FROM bible_reading_plans WHERE id = plan_id AND is_active = true));
CREATE POLICY "Admins can manage entries" ON bible_reading_entries
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - hero_slides (공개)
CREATE POLICY "Active slides are viewable by everyone" ON hero_slides
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage slides" ON hero_slides
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - email_subscribers (관리자만)
CREATE POLICY "Only admins can view subscribers" ON email_subscribers
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage subscribers" ON email_subscribers
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can subscribe" ON email_subscribers
  FOR INSERT WITH CHECK (true);

-- RLS 정책 - church_members (관리자만)
CREATE POLICY "Only admins can view members" ON church_members
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage members" ON church_members
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - bulletins (공개)
CREATE POLICY "Visible bulletins are viewable by everyone" ON bulletins
  FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage bulletins" ON bulletins
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - new_family_registrations
CREATE POLICY "Anyone can register as new family" ON new_family_registrations
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view registrations" ON new_family_registrations
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage registrations" ON new_family_registrations
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS 정책 - newsletter_logs (관리자만)
CREATE POLICY "Only admins can view newsletter logs" ON newsletter_logs
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage newsletter logs" ON newsletter_logs
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Storage Buckets 생성 SQL (Supabase Dashboard에서 실행)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('bulletins', 'bulletins', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('slides', 'slides', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('members', 'members', true);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_new_families_updated_at BEFORE UPDATE ON new_families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sermons_updated_at BEFORE UPDATE ON sermons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_albums_updated_at BEFORE UPDATE ON gallery_albums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bible_reading_plans_updated_at BEFORE UPDATE ON bible_reading_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_church_members_updated_at BEFORE UPDATE ON church_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bulletins_updated_at BEFORE UPDATE ON bulletins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_new_family_registrations_updated_at BEFORE UPDATE ON new_family_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    CASE
      WHEN new.email = 'newhosung@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 새 사용자 등록 시 프로필 자동 생성 트리거
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();