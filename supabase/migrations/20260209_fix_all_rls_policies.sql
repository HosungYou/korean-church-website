-- Migration: Fix ALL table RLS policies to use admin_users table
-- Date: 2026-02-09
-- Version: 2.3.0
-- Description: Comprehensive update of ALL RLS policies to check admin_users table instead of profiles table
-- Issue: Admins in admin_users table couldn't manage content due to RLS checking non-existent profiles table

-- ========== DROP EXISTING POLICIES ==========

-- Drop bulletins policies
DROP POLICY IF EXISTS "Bulletins are viewable by everyone" ON bulletins;
DROP POLICY IF EXISTS "Admins can manage bulletins" ON bulletins;
DROP POLICY IF EXISTS "bulletins_select_public" ON bulletins;
DROP POLICY IF EXISTS "bulletins_insert_admin" ON bulletins;
DROP POLICY IF EXISTS "bulletins_update_admin" ON bulletins;
DROP POLICY IF EXISTS "bulletins_delete_admin" ON bulletins;

-- Drop sermons policies
DROP POLICY IF EXISTS "Sermons are viewable by everyone" ON sermons;
DROP POLICY IF EXISTS "Admins can manage sermons" ON sermons;
DROP POLICY IF EXISTS "sermons_select_public" ON sermons;
DROP POLICY IF EXISTS "sermons_insert_admin" ON sermons;
DROP POLICY IF EXISTS "sermons_update_admin" ON sermons;
DROP POLICY IF EXISTS "sermons_delete_admin" ON sermons;

-- Drop bible_reading_plans policies
DROP POLICY IF EXISTS "Bible reading plans are viewable by everyone" ON bible_reading_plans;
DROP POLICY IF EXISTS "Admins can manage bible reading plans" ON bible_reading_plans;
DROP POLICY IF EXISTS "bible_reading_plans_select_public" ON bible_reading_plans;
DROP POLICY IF EXISTS "bible_reading_plans_insert_admin" ON bible_reading_plans;
DROP POLICY IF EXISTS "bible_reading_plans_update_admin" ON bible_reading_plans;
DROP POLICY IF EXISTS "bible_reading_plans_delete_admin" ON bible_reading_plans;

-- Drop bible_reading_entries policies
DROP POLICY IF EXISTS "Bible reading entries are viewable by everyone" ON bible_reading_entries;
DROP POLICY IF EXISTS "Admins can manage bible reading entries" ON bible_reading_entries;
DROP POLICY IF EXISTS "bible_reading_entries_select_public" ON bible_reading_entries;
DROP POLICY IF EXISTS "bible_reading_entries_insert_admin" ON bible_reading_entries;
DROP POLICY IF EXISTS "bible_reading_entries_update_admin" ON bible_reading_entries;
DROP POLICY IF EXISTS "bible_reading_entries_delete_admin" ON bible_reading_entries;

-- Drop church_members policies
DROP POLICY IF EXISTS "Admins can manage church members" ON church_members;
DROP POLICY IF EXISTS "church_members_select_admin" ON church_members;
DROP POLICY IF EXISTS "church_members_insert_admin" ON church_members;
DROP POLICY IF EXISTS "church_members_update_admin" ON church_members;
DROP POLICY IF EXISTS "church_members_delete_admin" ON church_members;

-- Drop email_subscribers policies
DROP POLICY IF EXISTS "Anyone can subscribe" ON email_subscribers;
DROP POLICY IF EXISTS "Admins can manage subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "email_subscribers_insert_public" ON email_subscribers;
DROP POLICY IF EXISTS "email_subscribers_select_admin" ON email_subscribers;
DROP POLICY IF EXISTS "email_subscribers_update_admin" ON email_subscribers;
DROP POLICY IF EXISTS "email_subscribers_delete_admin" ON email_subscribers;

-- Drop newsletter_logs policies
DROP POLICY IF EXISTS "Admins can manage newsletter logs" ON newsletter_logs;
DROP POLICY IF EXISTS "newsletter_logs_select_admin" ON newsletter_logs;
DROP POLICY IF EXISTS "newsletter_logs_insert_admin" ON newsletter_logs;
DROP POLICY IF EXISTS "newsletter_logs_update_admin" ON newsletter_logs;
DROP POLICY IF EXISTS "newsletter_logs_delete_admin" ON newsletter_logs;

-- Drop hero_slides policies
DROP POLICY IF EXISTS "Hero slides are viewable by everyone" ON hero_slides;
DROP POLICY IF EXISTS "Admins can manage hero slides" ON hero_slides;
DROP POLICY IF EXISTS "hero_slides_select_public" ON hero_slides;
DROP POLICY IF EXISTS "hero_slides_insert_admin" ON hero_slides;
DROP POLICY IF EXISTS "hero_slides_update_admin" ON hero_slides;
DROP POLICY IF EXISTS "hero_slides_delete_admin" ON hero_slides;

-- Drop new_families policies
DROP POLICY IF EXISTS "Admins can manage new families" ON new_families;
DROP POLICY IF EXISTS "new_families_select_admin" ON new_families;
DROP POLICY IF EXISTS "new_families_insert_admin" ON new_families;
DROP POLICY IF EXISTS "new_families_update_admin" ON new_families;
DROP POLICY IF EXISTS "new_families_delete_admin" ON new_families;

-- Drop new_family_registrations policies
DROP POLICY IF EXISTS "Anyone can register" ON new_family_registrations;
DROP POLICY IF EXISTS "Admins can manage registrations" ON new_family_registrations;
DROP POLICY IF EXISTS "new_family_registrations_insert_public" ON new_family_registrations;
DROP POLICY IF EXISTS "new_family_registrations_select_admin" ON new_family_registrations;
DROP POLICY IF EXISTS "new_family_registrations_update_admin" ON new_family_registrations;
DROP POLICY IF EXISTS "new_family_registrations_delete_admin" ON new_family_registrations;

-- Drop bible_materials policies
DROP POLICY IF EXISTS "Bible materials are viewable by everyone" ON bible_materials;
DROP POLICY IF EXISTS "Admins can manage bible materials" ON bible_materials;
DROP POLICY IF EXISTS "bible_materials_select_public" ON bible_materials;
DROP POLICY IF EXISTS "bible_materials_insert_admin" ON bible_materials;
DROP POLICY IF EXISTS "bible_materials_update_admin" ON bible_materials;
DROP POLICY IF EXISTS "bible_materials_delete_admin" ON bible_materials;

-- Drop posts policies
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON posts;
DROP POLICY IF EXISTS "posts_select_public" ON posts;
DROP POLICY IF EXISTS "posts_insert_admin" ON posts;
DROP POLICY IF EXISTS "posts_update_admin" ON posts;
DROP POLICY IF EXISTS "posts_delete_admin" ON posts;

-- Drop prayer_requests policies
DROP POLICY IF EXISTS "Prayer requests are viewable by everyone" ON prayer_requests;
DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Admins can manage prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "prayer_requests_select_public" ON prayer_requests;
DROP POLICY IF EXISTS "prayer_requests_insert_public" ON prayer_requests;
DROP POLICY IF EXISTS "prayer_requests_update_admin" ON prayer_requests;
DROP POLICY IF EXISTS "prayer_requests_delete_admin" ON prayer_requests;


-- ========== ENABLE ROW LEVEL SECURITY ==========

ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_reading_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_family_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;


-- ========== BULLETINS POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "bulletins_select_public" ON bulletins
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "bulletins_insert_admin" ON bulletins
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "bulletins_update_admin" ON bulletins
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "bulletins_delete_admin" ON bulletins
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== SERMONS POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "sermons_select_public" ON sermons
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "sermons_insert_admin" ON sermons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "sermons_update_admin" ON sermons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "sermons_delete_admin" ON sermons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== BIBLE READING PLANS POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "bible_reading_plans_select_public" ON bible_reading_plans
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "bible_reading_plans_insert_admin" ON bible_reading_plans
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "bible_reading_plans_update_admin" ON bible_reading_plans
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "bible_reading_plans_delete_admin" ON bible_reading_plans
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== BIBLE READING ENTRIES POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "bible_reading_entries_select_public" ON bible_reading_entries
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "bible_reading_entries_insert_admin" ON bible_reading_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "bible_reading_entries_update_admin" ON bible_reading_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "bible_reading_entries_delete_admin" ON bible_reading_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== CHURCH MEMBERS POLICIES (ADMIN ONLY) ==========

-- Allow admins to SELECT
CREATE POLICY "church_members_select_admin" ON church_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to INSERT
CREATE POLICY "church_members_insert_admin" ON church_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "church_members_update_admin" ON church_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "church_members_delete_admin" ON church_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== EMAIL SUBSCRIBERS POLICIES ==========

-- Allow anyone to INSERT (subscribe via public form)
CREATE POLICY "email_subscribers_insert_public" ON email_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow admins to SELECT
CREATE POLICY "email_subscribers_select_admin" ON email_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "email_subscribers_update_admin" ON email_subscribers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "email_subscribers_delete_admin" ON email_subscribers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== NEWSLETTER LOGS POLICIES (ADMIN ONLY) ==========

-- Allow admins to SELECT
CREATE POLICY "newsletter_logs_select_admin" ON newsletter_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to INSERT
CREATE POLICY "newsletter_logs_insert_admin" ON newsletter_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "newsletter_logs_update_admin" ON newsletter_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "newsletter_logs_delete_admin" ON newsletter_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== HERO SLIDES POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "hero_slides_select_public" ON hero_slides
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "hero_slides_insert_admin" ON hero_slides
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "hero_slides_update_admin" ON hero_slides
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "hero_slides_delete_admin" ON hero_slides
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== NEW FAMILIES POLICIES (ADMIN ONLY) ==========

-- Allow admins to SELECT
CREATE POLICY "new_families_select_admin" ON new_families
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to INSERT
CREATE POLICY "new_families_insert_admin" ON new_families
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "new_families_update_admin" ON new_families
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "new_families_delete_admin" ON new_families
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== NEW FAMILY REGISTRATIONS POLICIES ==========

-- Allow anyone to INSERT (public registration form)
CREATE POLICY "new_family_registrations_insert_public" ON new_family_registrations
  FOR INSERT WITH CHECK (true);

-- Allow admins to SELECT
CREATE POLICY "new_family_registrations_select_admin" ON new_family_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "new_family_registrations_update_admin" ON new_family_registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "new_family_registrations_delete_admin" ON new_family_registrations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== BIBLE MATERIALS POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "bible_materials_select_public" ON bible_materials
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "bible_materials_insert_admin" ON bible_materials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "bible_materials_update_admin" ON bible_materials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "bible_materials_delete_admin" ON bible_materials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== POSTS POLICIES ==========

-- Allow everyone to SELECT published posts
CREATE POLICY "posts_select_public" ON posts
  FOR SELECT USING (status = 'published');

-- Allow admins to INSERT
CREATE POLICY "posts_insert_admin" ON posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "posts_update_admin" ON posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "posts_delete_admin" ON posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== PRAYER REQUESTS POLICIES ==========

-- Allow everyone to SELECT approved prayer requests
CREATE POLICY "prayer_requests_select_public" ON prayer_requests
  FOR SELECT USING (true);

-- Allow anyone to INSERT (submit prayer request)
CREATE POLICY "prayer_requests_insert_public" ON prayer_requests
  FOR INSERT WITH CHECK (true);

-- Allow admins to UPDATE
CREATE POLICY "prayer_requests_update_admin" ON prayer_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "prayer_requests_delete_admin" ON prayer_requests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== STORAGE BUCKET POLICIES ==========

-- Drop existing storage policies
DROP POLICY IF EXISTS "Bulletins bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to bulletins" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update bulletins" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete bulletins" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_select_public" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Bible materials bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to bible-materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update bible-materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete bible-materials" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_select_public" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Sermons bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to sermons" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update sermons" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete sermons" ON storage.objects;
DROP POLICY IF EXISTS "sermons_bucket_select_public" ON storage.objects;
DROP POLICY IF EXISTS "sermons_bucket_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "sermons_bucket_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "sermons_bucket_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Members bucket is admin only" ON storage.objects;
DROP POLICY IF EXISTS "members_select_admin" ON storage.objects;
DROP POLICY IF EXISTS "members_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "members_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "members_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Posts bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to posts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update posts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete posts" ON storage.objects;
DROP POLICY IF EXISTS "posts_bucket_select_public" ON storage.objects;
DROP POLICY IF EXISTS "posts_bucket_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "posts_bucket_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "posts_bucket_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Covers bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete covers" ON storage.objects;
DROP POLICY IF EXISTS "covers_select_public" ON storage.objects;
DROP POLICY IF EXISTS "covers_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "covers_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "covers_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Slides bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to slides" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update slides" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete slides" ON storage.objects;
DROP POLICY IF EXISTS "slides_select_public" ON storage.objects;
DROP POLICY IF EXISTS "slides_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "slides_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "slides_delete_admin" ON storage.objects;


-- Create sermons bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('sermons', 'sermons', true)
ON CONFLICT (id) DO NOTHING;


-- ========== BULLETINS BUCKET POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "bulletins_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'bulletins');

-- Allow admins to INSERT
CREATE POLICY "bulletins_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bulletins' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "bulletins_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'bulletins' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "bulletins_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'bulletins' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== BIBLE-MATERIALS BUCKET POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "bible_materials_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'bible-materials');

-- Allow admins to INSERT
CREATE POLICY "bible_materials_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bible-materials' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "bible_materials_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'bible-materials' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "bible_materials_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'bible-materials' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== SERMONS BUCKET POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "sermons_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'sermons');

-- Allow admins to INSERT
CREATE POLICY "sermons_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'sermons' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "sermons_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'sermons' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "sermons_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'sermons' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== MEMBERS BUCKET POLICIES (ADMIN ONLY) ==========

-- Allow admins to SELECT
CREATE POLICY "members_bucket_select_admin" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'members' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to INSERT
CREATE POLICY "members_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'members' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "members_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'members' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "members_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'members' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== POSTS BUCKET POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "posts_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'posts');

-- Allow admins to INSERT
CREATE POLICY "posts_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'posts' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "posts_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'posts' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "posts_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'posts' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== COVERS BUCKET POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "covers_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

-- Allow admins to INSERT
CREATE POLICY "covers_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'covers' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "covers_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'covers' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "covers_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'covers' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== SLIDES BUCKET POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "slides_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'slides');

-- Allow admins to INSERT
CREATE POLICY "slides_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "slides_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "slides_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== COMMENTS ==========

-- Table policies comments
COMMENT ON POLICY "bulletins_select_public" ON bulletins IS 'Allow public read access to all bulletins';
COMMENT ON POLICY "bulletins_insert_admin" ON bulletins IS 'Allow admins from admin_users table to insert bulletins (case-insensitive email match)';
COMMENT ON POLICY "bulletins_update_admin" ON bulletins IS 'Allow admins from admin_users table to update bulletins (case-insensitive email match)';
COMMENT ON POLICY "bulletins_delete_admin" ON bulletins IS 'Allow admins from admin_users table to delete bulletins (case-insensitive email match)';

COMMENT ON POLICY "sermons_select_public" ON sermons IS 'Allow public read access to all sermons';
COMMENT ON POLICY "sermons_insert_admin" ON sermons IS 'Allow admins from admin_users table to insert sermons (case-insensitive email match)';
COMMENT ON POLICY "sermons_update_admin" ON sermons IS 'Allow admins from admin_users table to update sermons (case-insensitive email match)';
COMMENT ON POLICY "sermons_delete_admin" ON sermons IS 'Allow admins from admin_users table to delete sermons (case-insensitive email match)';

COMMENT ON POLICY "bible_reading_plans_select_public" ON bible_reading_plans IS 'Allow public read access to all bible reading plans';
COMMENT ON POLICY "bible_reading_plans_insert_admin" ON bible_reading_plans IS 'Allow admins from admin_users table to insert bible reading plans (case-insensitive email match)';
COMMENT ON POLICY "bible_reading_plans_update_admin" ON bible_reading_plans IS 'Allow admins from admin_users table to update bible reading plans (case-insensitive email match)';
COMMENT ON POLICY "bible_reading_plans_delete_admin" ON bible_reading_plans IS 'Allow admins from admin_users table to delete bible reading plans (case-insensitive email match)';

COMMENT ON POLICY "bible_reading_entries_select_public" ON bible_reading_entries IS 'Allow public read access to all bible reading entries';
COMMENT ON POLICY "bible_reading_entries_insert_admin" ON bible_reading_entries IS 'Allow admins from admin_users table to insert bible reading entries (case-insensitive email match)';
COMMENT ON POLICY "bible_reading_entries_update_admin" ON bible_reading_entries IS 'Allow admins from admin_users table to update bible reading entries (case-insensitive email match)';
COMMENT ON POLICY "bible_reading_entries_delete_admin" ON bible_reading_entries IS 'Allow admins from admin_users table to delete bible reading entries (case-insensitive email match)';

COMMENT ON POLICY "church_members_select_admin" ON church_members IS 'Allow admins from admin_users table to view church members (case-insensitive email match)';
COMMENT ON POLICY "church_members_insert_admin" ON church_members IS 'Allow admins from admin_users table to insert church members (case-insensitive email match)';
COMMENT ON POLICY "church_members_update_admin" ON church_members IS 'Allow admins from admin_users table to update church members (case-insensitive email match)';
COMMENT ON POLICY "church_members_delete_admin" ON church_members IS 'Allow admins from admin_users table to delete church members (case-insensitive email match)';

COMMENT ON POLICY "email_subscribers_insert_public" ON email_subscribers IS 'Allow anyone to subscribe via public form';
COMMENT ON POLICY "email_subscribers_select_admin" ON email_subscribers IS 'Allow admins from admin_users table to view subscribers (case-insensitive email match)';
COMMENT ON POLICY "email_subscribers_update_admin" ON email_subscribers IS 'Allow admins from admin_users table to update subscribers (case-insensitive email match)';
COMMENT ON POLICY "email_subscribers_delete_admin" ON email_subscribers IS 'Allow admins from admin_users table to delete subscribers (case-insensitive email match)';

COMMENT ON POLICY "newsletter_logs_select_admin" ON newsletter_logs IS 'Allow admins from admin_users table to view newsletter logs (case-insensitive email match)';
COMMENT ON POLICY "newsletter_logs_insert_admin" ON newsletter_logs IS 'Allow admins from admin_users table to insert newsletter logs (case-insensitive email match)';
COMMENT ON POLICY "newsletter_logs_update_admin" ON newsletter_logs IS 'Allow admins from admin_users table to update newsletter logs (case-insensitive email match)';
COMMENT ON POLICY "newsletter_logs_delete_admin" ON newsletter_logs IS 'Allow admins from admin_users table to delete newsletter logs (case-insensitive email match)';

COMMENT ON POLICY "hero_slides_select_public" ON hero_slides IS 'Allow public read access to all hero slides';
COMMENT ON POLICY "hero_slides_insert_admin" ON hero_slides IS 'Allow admins from admin_users table to insert hero slides (case-insensitive email match)';
COMMENT ON POLICY "hero_slides_update_admin" ON hero_slides IS 'Allow admins from admin_users table to update hero slides (case-insensitive email match)';
COMMENT ON POLICY "hero_slides_delete_admin" ON hero_slides IS 'Allow admins from admin_users table to delete hero slides (case-insensitive email match)';

COMMENT ON POLICY "new_families_select_admin" ON new_families IS 'Allow admins from admin_users table to view new families (case-insensitive email match)';
COMMENT ON POLICY "new_families_insert_admin" ON new_families IS 'Allow admins from admin_users table to insert new families (case-insensitive email match)';
COMMENT ON POLICY "new_families_update_admin" ON new_families IS 'Allow admins from admin_users table to update new families (case-insensitive email match)';
COMMENT ON POLICY "new_families_delete_admin" ON new_families IS 'Allow admins from admin_users table to delete new families (case-insensitive email match)';

COMMENT ON POLICY "new_family_registrations_insert_public" ON new_family_registrations IS 'Allow anyone to submit new family registration via public form';
COMMENT ON POLICY "new_family_registrations_select_admin" ON new_family_registrations IS 'Allow admins from admin_users table to view registrations (case-insensitive email match)';
COMMENT ON POLICY "new_family_registrations_update_admin" ON new_family_registrations IS 'Allow admins from admin_users table to update registrations (case-insensitive email match)';
COMMENT ON POLICY "new_family_registrations_delete_admin" ON new_family_registrations IS 'Allow admins from admin_users table to delete registrations (case-insensitive email match)';

COMMENT ON POLICY "bible_materials_select_public" ON bible_materials IS 'Allow public read access to all bible materials';
COMMENT ON POLICY "bible_materials_insert_admin" ON bible_materials IS 'Allow admins from admin_users table to insert bible materials (case-insensitive email match)';
COMMENT ON POLICY "bible_materials_update_admin" ON bible_materials IS 'Allow admins from admin_users table to update bible materials (case-insensitive email match)';
COMMENT ON POLICY "bible_materials_delete_admin" ON bible_materials IS 'Allow admins from admin_users table to delete bible materials (case-insensitive email match)';

COMMENT ON POLICY "posts_select_public" ON posts IS 'Allow public read access to published posts only';
COMMENT ON POLICY "posts_insert_admin" ON posts IS 'Allow admins from admin_users table to insert posts (case-insensitive email match)';
COMMENT ON POLICY "posts_update_admin" ON posts IS 'Allow admins from admin_users table to update posts (case-insensitive email match)';
COMMENT ON POLICY "posts_delete_admin" ON posts IS 'Allow admins from admin_users table to delete posts (case-insensitive email match)';

COMMENT ON POLICY "prayer_requests_select_public" ON prayer_requests IS 'Allow public read access to all prayer requests';
COMMENT ON POLICY "prayer_requests_insert_public" ON prayer_requests IS 'Allow anyone to submit prayer requests via public form';
COMMENT ON POLICY "prayer_requests_update_admin" ON prayer_requests IS 'Allow admins from admin_users table to update prayer requests (case-insensitive email match)';
COMMENT ON POLICY "prayer_requests_delete_admin" ON prayer_requests IS 'Allow admins from admin_users table to delete prayer requests (case-insensitive email match)';

-- Storage policies comments
COMMENT ON POLICY "bulletins_bucket_select_public" ON storage.objects IS 'Allow public read access to bulletins storage bucket';
COMMENT ON POLICY "bulletins_bucket_insert_admin" ON storage.objects IS 'Allow admins from admin_users table to upload to bulletins bucket (case-insensitive email match)';
COMMENT ON POLICY "bulletins_bucket_update_admin" ON storage.objects IS 'Allow admins from admin_users table to update bulletins bucket files (case-insensitive email match)';
COMMENT ON POLICY "bulletins_bucket_delete_admin" ON storage.objects IS 'Allow admins from admin_users table to delete from bulletins bucket (case-insensitive email match)';

COMMENT ON POLICY "bible_materials_bucket_select_public" ON storage.objects IS 'Allow public read access to bible-materials storage bucket';
COMMENT ON POLICY "bible_materials_bucket_insert_admin" ON storage.objects IS 'Allow admins from admin_users table to upload to bible-materials bucket (case-insensitive email match)';
COMMENT ON POLICY "bible_materials_bucket_update_admin" ON storage.objects IS 'Allow admins from admin_users table to update bible-materials bucket files (case-insensitive email match)';
COMMENT ON POLICY "bible_materials_bucket_delete_admin" ON storage.objects IS 'Allow admins from admin_users table to delete from bible-materials bucket (case-insensitive email match)';

COMMENT ON POLICY "sermons_bucket_select_public" ON storage.objects IS 'Allow public read access to sermons storage bucket';
COMMENT ON POLICY "sermons_bucket_insert_admin" ON storage.objects IS 'Allow admins from admin_users table to upload to sermons bucket (case-insensitive email match)';
COMMENT ON POLICY "sermons_bucket_update_admin" ON storage.objects IS 'Allow admins from admin_users table to update sermons bucket files (case-insensitive email match)';
COMMENT ON POLICY "sermons_bucket_delete_admin" ON storage.objects IS 'Allow admins from admin_users table to delete from sermons bucket (case-insensitive email match)';

COMMENT ON POLICY "members_bucket_select_admin" ON storage.objects IS 'Allow admins from admin_users table to view members storage bucket (case-insensitive email match)';
COMMENT ON POLICY "members_bucket_insert_admin" ON storage.objects IS 'Allow admins from admin_users table to upload to members bucket (case-insensitive email match)';
COMMENT ON POLICY "members_bucket_update_admin" ON storage.objects IS 'Allow admins from admin_users table to update members bucket files (case-insensitive email match)';
COMMENT ON POLICY "members_bucket_delete_admin" ON storage.objects IS 'Allow admins from admin_users table to delete from members bucket (case-insensitive email match)';

COMMENT ON POLICY "posts_bucket_select_public" ON storage.objects IS 'Allow public read access to posts storage bucket';
COMMENT ON POLICY "posts_bucket_insert_admin" ON storage.objects IS 'Allow admins from admin_users table to upload to posts bucket (case-insensitive email match)';
COMMENT ON POLICY "posts_bucket_update_admin" ON storage.objects IS 'Allow admins from admin_users table to update posts bucket files (case-insensitive email match)';
COMMENT ON POLICY "posts_bucket_delete_admin" ON storage.objects IS 'Allow admins from admin_users table to delete from posts bucket (case-insensitive email match)';

COMMENT ON POLICY "covers_bucket_select_public" ON storage.objects IS 'Allow public read access to covers storage bucket';
COMMENT ON POLICY "covers_bucket_insert_admin" ON storage.objects IS 'Allow admins from admin_users table to upload to covers bucket (case-insensitive email match)';
COMMENT ON POLICY "covers_bucket_update_admin" ON storage.objects IS 'Allow admins from admin_users table to update covers bucket files (case-insensitive email match)';
COMMENT ON POLICY "covers_bucket_delete_admin" ON storage.objects IS 'Allow admins from admin_users table to delete from covers bucket (case-insensitive email match)';

COMMENT ON POLICY "slides_bucket_select_public" ON storage.objects IS 'Allow public read access to slides storage bucket';
COMMENT ON POLICY "slides_bucket_insert_admin" ON storage.objects IS 'Allow admins from admin_users table to upload to slides bucket (case-insensitive email match)';
COMMENT ON POLICY "slides_bucket_update_admin" ON storage.objects IS 'Allow admins from admin_users table to update slides bucket files (case-insensitive email match)';
COMMENT ON POLICY "slides_bucket_delete_admin" ON storage.objects IS 'Allow admins from admin_users table to delete from slides bucket (case-insensitive email match)';


-- ========== SERMON ATTACHMENT COLUMNS ==========

-- Add sermon attachment columns for file uploads
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS attachment_name TEXT;

COMMENT ON COLUMN sermons.attachment_url IS 'URL to sermon attachment file (PDF, DOCX, etc.) stored in sermons bucket';
COMMENT ON COLUMN sermons.attachment_name IS 'Original filename of the sermon attachment';
