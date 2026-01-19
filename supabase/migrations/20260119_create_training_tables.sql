-- Migration: Create Training System Tables
-- Date: 2026-01-19
-- Version: 2.4.0
-- Description: Creates tables for discipleship training programs and materials

-- ========== TRAINING PROGRAMS TABLE ==========
-- Represents a training course (e.g., "새가족 10주간 제자훈련")

CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    category VARCHAR(50) DEFAULT 'discipleship',
    total_weeks INTEGER DEFAULT 10,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    material_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== TRAINING MATERIALS TABLE ==========
-- Represents individual materials within a program (PDF, video, audio)

CREATE TABLE IF NOT EXISTS training_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    week_number INTEGER NOT NULL,
    material_type VARCHAR(20) NOT NULL CHECK (material_type IN ('pdf', 'video', 'audio')),
    file_url TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    video_url TEXT,
    duration_minutes INTEGER,
    thumbnail_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========

CREATE INDEX IF NOT EXISTS idx_training_programs_category ON training_programs(category);
CREATE INDEX IF NOT EXISTS idx_training_programs_visible ON training_programs(is_visible);
CREATE INDEX IF NOT EXISTS idx_training_materials_program ON training_materials(program_id);
CREATE INDEX IF NOT EXISTS idx_training_materials_week ON training_materials(week_number);
CREATE INDEX IF NOT EXISTS idx_training_materials_type ON training_materials(material_type);
CREATE INDEX IF NOT EXISTS idx_training_materials_visible ON training_materials(is_visible);

-- ========== TRIGGERS ==========

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_training_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_training_programs_updated_at
    BEFORE UPDATE ON training_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_training_updated_at();

CREATE TRIGGER trigger_training_materials_updated_at
    BEFORE UPDATE ON training_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_training_updated_at();

-- Auto-update material_count in programs
CREATE OR REPLACE FUNCTION update_program_material_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE training_programs
        SET material_count = (
            SELECT COUNT(*) FROM training_materials
            WHERE program_id = NEW.program_id AND is_visible = true
        )
        WHERE id = NEW.program_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
        UPDATE training_programs
        SET material_count = (
            SELECT COUNT(*) FROM training_materials
            WHERE program_id = OLD.program_id AND is_visible = true
        )
        WHERE id = OLD.program_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_material_count
    AFTER INSERT OR UPDATE OR DELETE ON training_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_program_material_count();

-- ========== ROW LEVEL SECURITY ==========

ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_materials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "training_programs_select_public" ON training_programs
    FOR SELECT USING (true);

CREATE POLICY "training_materials_select_public" ON training_materials
    FOR SELECT USING (true);

-- Admin write access (using admin_users table with email matching)
CREATE POLICY "training_programs_insert_admin" ON training_programs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "training_programs_update_admin" ON training_programs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "training_programs_delete_admin" ON training_programs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "training_materials_insert_admin" ON training_materials
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "training_materials_update_admin" ON training_materials
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "training_materials_delete_admin" ON training_materials
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

-- ========== INITIAL DATA ==========

INSERT INTO training_programs (title, description, category, total_weeks, is_visible, sort_order)
VALUES (
    '새가족 10주간 제자훈련',
    '새가족을 위한 10주간 제자훈련 프로그램입니다. 신앙의 기초를 다지고 교회 공동체의 일원으로 성장하도록 돕습니다.',
    'discipleship',
    10,
    true,
    0
);

-- ========== COMMENTS ==========

COMMENT ON TABLE training_programs IS '제자훈련 프로그램 (새가족 훈련, 성경공부 등)';
COMMENT ON TABLE training_materials IS '훈련 자료 (PDF, 영상, 오디오)';
COMMENT ON COLUMN training_materials.material_type IS 'pdf, video, audio 중 하나';
COMMENT ON COLUMN training_materials.week_number IS '주차 번호 (1-10 등)';
