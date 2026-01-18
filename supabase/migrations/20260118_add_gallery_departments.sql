-- Migration: Add department-based folder structure to gallery_albums
-- Date: 2026-01-18
-- Description: Adds department and district_number columns for organizing albums by church departments

-- Add department column (nullable to support existing data)
ALTER TABLE gallery_albums
ADD COLUMN IF NOT EXISTS department VARCHAR(50) DEFAULT 'general';

-- Add district_number column (for district department only)
ALTER TABLE gallery_albums
ADD COLUMN IF NOT EXISTS district_number INTEGER;

-- Create index for faster department queries
CREATE INDEX IF NOT EXISTS idx_gallery_albums_department
ON gallery_albums(department);

-- Create index for district number queries
CREATE INDEX IF NOT EXISTS idx_gallery_albums_district_number
ON gallery_albums(district_number)
WHERE district_number IS NOT NULL;

-- Add check constraint for valid department values
ALTER TABLE gallery_albums
ADD CONSTRAINT chk_gallery_albums_department
CHECK (department IN ('children', 'youth', 'young_adults', 'district', 'general') OR department IS NULL);

-- Add check constraint for district numbers (1-4)
ALTER TABLE gallery_albums
ADD CONSTRAINT chk_gallery_albums_district_number
CHECK (district_number IS NULL OR (district_number >= 1 AND district_number <= 4));

-- Update existing albums to have 'general' department if null
UPDATE gallery_albums
SET department = 'general'
WHERE department IS NULL;

-- Comment on columns
COMMENT ON COLUMN gallery_albums.department IS 'Department folder: children (유년부), youth (중고등부), young_adults (청년대학부), district (구역), general (일반)';
COMMENT ON COLUMN gallery_albums.district_number IS 'District number (1-4) when department is district';
