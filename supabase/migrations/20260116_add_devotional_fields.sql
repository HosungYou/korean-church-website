-- =============================================
-- Migration: Add Devotional Fields to Bible Reading Entries
-- Date: 2026-01-16
-- Description: 성경읽기표에 묵상 필드 추가 (제목, 본문, 목사님 노트, 적용, 기도)
-- =============================================

-- Add new columns to bible_reading_entries table
ALTER TABLE bible_reading_entries
ADD COLUMN IF NOT EXISTS title VARCHAR(500),
ADD COLUMN IF NOT EXISTS scripture_reference VARCHAR(200),
ADD COLUMN IF NOT EXISTS pastor_notes TEXT,
ADD COLUMN IF NOT EXISTS application TEXT,
ADD COLUMN IF NOT EXISTS prayer TEXT,
ADD COLUMN IF NOT EXISTS day_of_week VARCHAR(10),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for faster date lookups
CREATE INDEX IF NOT EXISTS idx_bible_reading_entries_date
ON bible_reading_entries(reading_date);

-- Create index for plan and date combination
CREATE INDEX IF NOT EXISTS idx_bible_reading_entries_plan_date
ON bible_reading_entries(plan_id, reading_date);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_bible_reading_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bible_reading_entries_updated_at ON bible_reading_entries;
CREATE TRIGGER bible_reading_entries_updated_at
    BEFORE UPDATE ON bible_reading_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_bible_reading_entries_updated_at();

-- Enable RLS if not already enabled
ALTER TABLE bible_reading_entries ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
DROP POLICY IF EXISTS "Anyone can view bible reading entries" ON bible_reading_entries;
CREATE POLICY "Anyone can view bible reading entries"
ON bible_reading_entries FOR SELECT
USING (true);

-- Policy for authenticated users to insert/update/delete
DROP POLICY IF EXISTS "Authenticated users can manage bible reading entries" ON bible_reading_entries;
CREATE POLICY "Authenticated users can manage bible reading entries"
ON bible_reading_entries FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add comment for documentation
COMMENT ON TABLE bible_reading_entries IS '성경읽기표 - 매일 묵상 항목';
COMMENT ON COLUMN bible_reading_entries.title IS '묵상 제목 (예: 부부안에 이뤄지는 아름다운 삶)';
COMMENT ON COLUMN bible_reading_entries.scripture_reference IS '본문 (예: 베드로전서 3:1-7)';
COMMENT ON COLUMN bible_reading_entries.pastor_notes IS '목사님 노트 - 상세 해설';
COMMENT ON COLUMN bible_reading_entries.application IS '적용';
COMMENT ON COLUMN bible_reading_entries.prayer IS '기도';
COMMENT ON COLUMN bible_reading_entries.day_of_week IS '요일 (월, 화, 수, 목, 금, 토, 일)';
