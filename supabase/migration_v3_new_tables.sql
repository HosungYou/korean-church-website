-- ============================================
-- Migration V3: 교회 웹사이트 리팩토링 - 새 테이블 추가
-- 날짜: 2025-01-11
-- 설명: 설교, 갤러리, 성경읽기표, 슬라이더, 구독자, 교회 구성원, 주보 테이블 추가
-- ============================================

-- ============================================
-- 1. 설교 관리 테이블 (sermons)
-- ============================================
CREATE TABLE IF NOT EXISTS sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL DEFAULT '연규홍 목사',
  scripture TEXT NOT NULL,
  sermon_date DATE NOT NULL,
  youtube_url TEXT,
  youtube_video_id TEXT,
  sermon_type TEXT NOT NULL CHECK (sermon_type IN ('sunday', 'wednesday', 'friday', 'special')),
  series_name TEXT,
  description TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE sermons IS '설교 영상 관리 테이블';
COMMENT ON COLUMN sermons.sermon_type IS 'sunday: 주일설교, wednesday: 수요예배, friday: 금요기도회, special: 특별집회';
COMMENT ON COLUMN sermons.youtube_video_id IS 'YouTube URL에서 자동 추출된 Video ID';

-- ============================================
-- 2. 갤러리 앨범 테이블 (gallery_albums)
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  album_date DATE NOT NULL,
  year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM album_date)::INTEGER) STORED,
  month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM album_date)::INTEGER) STORED,
  category TEXT DEFAULT 'general' CHECK (category IN ('sunday', 'event', 'education', 'missions', 'general')),
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  photo_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE gallery_albums IS '갤러리 앨범 - 년/월별 자동 정렬 지원';
COMMENT ON COLUMN gallery_albums.year IS 'album_date에서 자동 계산된 연도';
COMMENT ON COLUMN gallery_albums.month IS 'album_date에서 자동 계산된 월';

-- ============================================
-- 3. 갤러리 사진 테이블 (gallery_photos)
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE gallery_photos IS '갤러리 개별 사진';

-- ============================================
-- 4. 성경읽기 계획 테이블 (bible_reading_plans)
-- ============================================
CREATE TABLE IF NOT EXISTS bible_reading_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE bible_reading_plans IS '성경읽기 계획 (예: 2025년 성경통독)';

-- ============================================
-- 5. 성경읽기 항목 테이블 (bible_reading_entries)
-- ============================================
CREATE TABLE IF NOT EXISTS bible_reading_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES bible_reading_plans(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  old_testament TEXT,
  new_testament TEXT,
  psalms TEXT,
  proverbs TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE bible_reading_entries IS '일일 성경읽기 항목';
COMMENT ON COLUMN bible_reading_entries.old_testament IS '구약 범위 (예: 창세기 1-3장)';
COMMENT ON COLUMN bible_reading_entries.new_testament IS '신약 범위 (예: 마태복음 1장)';

-- ============================================
-- 6. 슬라이더/배너 관리 테이블 (hero_slides)
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  bible_verse TEXT,
  image_url TEXT,
  link_url TEXT,
  link_text TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE hero_slides IS '홈페이지 히어로 슬라이더';
COMMENT ON COLUMN hero_slides.bible_verse IS '슬라이드에 표시할 성경구절';

-- ============================================
-- 7. 이메일 구독자 테이블 (email_subscribers)
-- ============================================
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE email_subscribers IS '이메일 뉴스레터 구독자';

-- ============================================
-- 8. 교회 구성원 관리 테이블 (church_members)
-- ============================================
CREATE TABLE IF NOT EXISTS church_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  korean_name TEXT NOT NULL,
  english_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  member_type TEXT DEFAULT 'member' CHECK (member_type IN ('member', 'deacon', 'elder', 'pastor', 'staff')),
  department TEXT,
  baptized BOOLEAN DEFAULT false,
  baptism_date DATE,
  registered_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred', 'deceased')),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE church_members IS '교회 구성원 관리';
COMMENT ON COLUMN church_members.member_type IS 'member: 성도, deacon: 집사, elder: 장로, pastor: 목사, staff: 교역자';

-- ============================================
-- 9. 주보 테이블 (bulletins)
-- ============================================
CREATE TABLE IF NOT EXISTS bulletins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  bulletin_date DATE NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE bulletins IS '주보 PDF 관리';

-- ============================================
-- 10. 뉴스레터 발송 기록 테이블 (newsletter_sent)
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_sent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('announcement', 'event', 'general', 'newsletter')),
  recipient_count INTEGER DEFAULT 0,
  recipients JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE newsletter_sent IS '뉴스레터 발송 이력';

-- ============================================
-- 인덱스 생성
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(sermon_date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_type ON sermons(sermon_type);
CREATE INDEX IF NOT EXISTS idx_sermons_status ON sermons(status);
CREATE INDEX IF NOT EXISTS idx_sermons_featured ON sermons(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_gallery_albums_date ON gallery_albums(album_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_year_month ON gallery_albums(year DESC, month DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_visible ON gallery_albums(is_visible) WHERE is_visible = true;
CREATE INDEX IF NOT EXISTS idx_gallery_photos_album ON gallery_photos(album_id);

CREATE INDEX IF NOT EXISTS idx_bible_reading_entries_date ON bible_reading_entries(reading_date);
CREATE INDEX IF NOT EXISTS idx_bible_reading_entries_plan ON bible_reading_entries(plan_id);

CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active, sort_order) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_email_subscribers_active ON email_subscribers(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_church_members_status ON church_members(status);
CREATE INDEX IF NOT EXISTS idx_church_members_type ON church_members(member_type);

CREATE INDEX IF NOT EXISTS idx_bulletins_date ON bulletins(bulletin_date DESC);
CREATE INDEX IF NOT EXISTS idx_bulletins_visible ON bulletins(is_visible) WHERE is_visible = true;

-- ============================================
-- RLS (Row Level Security) 정책 활성화
-- ============================================
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_reading_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sent ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Public Read 정책 (비로그인 사용자도 조회 가능)
-- ============================================

-- Sermons: 발행된 설교만 공개
CREATE POLICY "Public can view published sermons" ON sermons
  FOR SELECT USING (status = 'published');

-- Gallery Albums: 공개된 앨범만
CREATE POLICY "Public can view visible albums" ON gallery_albums
  FOR SELECT USING (is_visible = true);

-- Gallery Photos: 공개된 앨범의 사진만
CREATE POLICY "Public can view photos in visible albums" ON gallery_photos
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM gallery_albums WHERE id = album_id AND is_visible = true
  ));

-- Bible Reading Plans: 활성화된 계획만
CREATE POLICY "Public can view active reading plans" ON bible_reading_plans
  FOR SELECT USING (is_active = true);

-- Bible Reading Entries: 모두 공개
CREATE POLICY "Public can view reading entries" ON bible_reading_entries
  FOR SELECT USING (true);

-- Hero Slides: 활성화된 슬라이드만
CREATE POLICY "Public can view active slides" ON hero_slides
  FOR SELECT USING (is_active = true);

-- Bulletins: 공개된 주보만
CREATE POLICY "Public can view visible bulletins" ON bulletins
  FOR SELECT USING (is_visible = true);

-- Email Subscribers: 누구나 구독 가능
CREATE POLICY "Anyone can subscribe" ON email_subscribers
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Admin 정책 (관리자만 모든 작업 가능)
-- ============================================

CREATE POLICY "Admins can manage sermons" ON sermons
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage albums" ON gallery_albums
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage photos" ON gallery_photos
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage bible plans" ON bible_reading_plans
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage bible entries" ON bible_reading_entries
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage slides" ON hero_slides
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage subscribers" ON email_subscribers
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage members" ON church_members
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage bulletins" ON bulletins
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage newsletter_sent" ON newsletter_sent
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- 트리거: 갤러리 사진 개수 자동 업데이트
-- ============================================
CREATE OR REPLACE FUNCTION update_album_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE gallery_albums SET photo_count = photo_count + 1, updated_at = NOW() WHERE id = NEW.album_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE gallery_albums SET photo_count = photo_count - 1, updated_at = NOW() WHERE id = OLD.album_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_photo_count_trigger ON gallery_photos;
CREATE TRIGGER update_photo_count_trigger
AFTER INSERT OR DELETE ON gallery_photos
FOR EACH ROW EXECUTE FUNCTION update_album_photo_count();

-- ============================================
-- 트리거: YouTube URL에서 Video ID 자동 추출
-- ============================================
CREATE OR REPLACE FUNCTION extract_youtube_video_id()
RETURNS TRIGGER AS $$
DECLARE
  video_id TEXT;
BEGIN
  IF NEW.youtube_url IS NOT NULL AND NEW.youtube_url != '' THEN
    -- youtube.com/watch?v=VIDEO_ID 형식
    IF NEW.youtube_url ~ 'youtube\.com/watch\?v=' THEN
      video_id := substring(NEW.youtube_url from 'v=([a-zA-Z0-9_-]+)');
    -- youtu.be/VIDEO_ID 형식
    ELSIF NEW.youtube_url ~ 'youtu\.be/' THEN
      video_id := substring(NEW.youtube_url from 'youtu\.be/([a-zA-Z0-9_-]+)');
    -- youtube.com/embed/VIDEO_ID 형식
    ELSIF NEW.youtube_url ~ 'youtube\.com/embed/' THEN
      video_id := substring(NEW.youtube_url from 'embed/([a-zA-Z0-9_-]+)');
    END IF;
    NEW.youtube_video_id := video_id;
  ELSE
    NEW.youtube_video_id := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS extract_youtube_id_trigger ON sermons;
CREATE TRIGGER extract_youtube_id_trigger
BEFORE INSERT OR UPDATE ON sermons
FOR EACH ROW EXECUTE FUNCTION extract_youtube_video_id();

-- ============================================
-- 트리거: updated_at 자동 업데이트
-- ============================================
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

-- ============================================
-- Storage Buckets (Supabase Dashboard에서 실행)
-- ============================================
-- 아래 SQL은 Supabase Dashboard > Storage에서 수동 생성하거나
-- Supabase CLI를 통해 실행해야 합니다.

-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('bulletins', 'bulletins', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('slides', 'slides', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('sermons', 'sermons', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('members', 'members', true);

-- ============================================
-- 초기 데이터 (샘플)
-- ============================================

-- 기본 슬라이더 데이터
INSERT INTO hero_slides (title, subtitle, bible_verse, sort_order, is_active) VALUES
('하나님을 경험하는 교회', '함께 예배하고, 함께 성장하며, 함께 섬기는 공동체', '행 1:8', 1, true),
('함께하는 믿음의 여정', '서로 사랑하고 격려하며 성장하는 공동체', '', 2, true),
('말씀 중심의 예배', '하나님의 말씀으로 변화되는 삶', '', 3, true)
ON CONFLICT DO NOTHING;

-- 기본 성경읽기 계획 (2025년)
INSERT INTO bible_reading_plans (title, description, year, is_active) VALUES
('2025년 성경통독', '1년 동안 성경 전체를 함께 읽는 통독 프로그램입니다.', 2025, true)
ON CONFLICT DO NOTHING;
