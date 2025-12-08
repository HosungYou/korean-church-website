-- Migration Script v2.0.0
-- Run this if posts table already exists and is missing new columns
-- Project ID: wesqwvlwieijorayicqf

-- Step 1: Add category column (without constraint first)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Step 2: Add attachment columns
ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachment_name TEXT;

-- Step 3: Add check constraint for category (drop if exists first)
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_check;
ALTER TABLE posts ADD CONSTRAINT posts_category_check
  CHECK (category IN ('general', 'wednesday', 'sunday', 'bible'));

-- Step 4: Create index for category
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Verify: Show all columns in posts table
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;
