-- Migration: Fix ALL table RLS policies to use admin_users table
-- Date: 2026-02-09
-- Version: 2.3.2
-- Description: Comprehensive update of ALL RLS policies to check admin_users table instead of profiles table
-- Issue: Admins in admin_users table couldn't manage content due to RLS checking non-existent profiles table
-- Safety: All table operations are wrapped in existence checks with EXECUTE to prevent parse-time errors


-- ========== BULLETINS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bulletins') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Bulletins are viewable by everyone" ON bulletins';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage bulletins" ON bulletins';
  EXECUTE 'DROP POLICY IF EXISTS "bulletins_select_public" ON bulletins';
  EXECUTE 'DROP POLICY IF EXISTS "bulletins_insert_admin" ON bulletins';
  EXECUTE 'DROP POLICY IF EXISTS "bulletins_update_admin" ON bulletins';
  EXECUTE 'DROP POLICY IF EXISTS "bulletins_delete_admin" ON bulletins';

  -- Enable RLS
  EXECUTE 'ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY';

  -- Create new policies
  EXECUTE 'CREATE POLICY "bulletins_select_public" ON bulletins FOR SELECT USING (true)';

  EXECUTE 'CREATE POLICY "bulletins_insert_admin" ON bulletins
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bulletins_update_admin" ON bulletins
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bulletins_delete_admin" ON bulletins
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'bulletins: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'bulletins: table does not exist, skipping';
END IF;
END $$;


-- ========== SERMONS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sermons') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Sermons are viewable by everyone" ON sermons';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage sermons" ON sermons';
  EXECUTE 'DROP POLICY IF EXISTS "sermons_select_public" ON sermons';
  EXECUTE 'DROP POLICY IF EXISTS "sermons_insert_admin" ON sermons';
  EXECUTE 'DROP POLICY IF EXISTS "sermons_update_admin" ON sermons';
  EXECUTE 'DROP POLICY IF EXISTS "sermons_delete_admin" ON sermons';

  -- Enable RLS
  EXECUTE 'ALTER TABLE sermons ENABLE ROW LEVEL SECURITY';

  -- Create new policies
  EXECUTE 'CREATE POLICY "sermons_select_public" ON sermons FOR SELECT USING (true)';

  EXECUTE 'CREATE POLICY "sermons_insert_admin" ON sermons
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "sermons_update_admin" ON sermons
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "sermons_delete_admin" ON sermons
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'sermons: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'sermons: table does not exist, skipping';
END IF;
END $$;


-- ========== BIBLE READING PLANS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bible_reading_plans') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Bible reading plans are viewable by everyone" ON bible_reading_plans';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage bible reading plans" ON bible_reading_plans';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_plans_select_public" ON bible_reading_plans';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_plans_insert_admin" ON bible_reading_plans';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_plans_update_admin" ON bible_reading_plans';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_plans_delete_admin" ON bible_reading_plans';

  -- Enable RLS
  EXECUTE 'ALTER TABLE bible_reading_plans ENABLE ROW LEVEL SECURITY';

  -- Create new policies
  EXECUTE 'CREATE POLICY "bible_reading_plans_select_public" ON bible_reading_plans FOR SELECT USING (true)';

  EXECUTE 'CREATE POLICY "bible_reading_plans_insert_admin" ON bible_reading_plans
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bible_reading_plans_update_admin" ON bible_reading_plans
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bible_reading_plans_delete_admin" ON bible_reading_plans
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'bible_reading_plans: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'bible_reading_plans: table does not exist, skipping';
END IF;
END $$;


-- ========== BIBLE READING ENTRIES POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bible_reading_entries') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Bible reading entries are viewable by everyone" ON bible_reading_entries';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage bible reading entries" ON bible_reading_entries';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_entries_select_public" ON bible_reading_entries';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_entries_insert_admin" ON bible_reading_entries';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_entries_update_admin" ON bible_reading_entries';
  EXECUTE 'DROP POLICY IF EXISTS "bible_reading_entries_delete_admin" ON bible_reading_entries';

  -- Enable RLS
  EXECUTE 'ALTER TABLE bible_reading_entries ENABLE ROW LEVEL SECURITY';

  -- Create new policies
  EXECUTE 'CREATE POLICY "bible_reading_entries_select_public" ON bible_reading_entries FOR SELECT USING (true)';

  EXECUTE 'CREATE POLICY "bible_reading_entries_insert_admin" ON bible_reading_entries
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bible_reading_entries_update_admin" ON bible_reading_entries
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bible_reading_entries_delete_admin" ON bible_reading_entries
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'bible_reading_entries: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'bible_reading_entries: table does not exist, skipping';
END IF;
END $$;


-- ========== CHURCH MEMBERS POLICIES (ADMIN ONLY) ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'church_members') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage church members" ON church_members';
  EXECUTE 'DROP POLICY IF EXISTS "church_members_select_admin" ON church_members';
  EXECUTE 'DROP POLICY IF EXISTS "church_members_insert_admin" ON church_members';
  EXECUTE 'DROP POLICY IF EXISTS "church_members_update_admin" ON church_members';
  EXECUTE 'DROP POLICY IF EXISTS "church_members_delete_admin" ON church_members';

  -- Enable RLS
  EXECUTE 'ALTER TABLE church_members ENABLE ROW LEVEL SECURITY';

  -- Create new policies (admin-only for ALL operations)
  EXECUTE 'CREATE POLICY "church_members_select_admin" ON church_members
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "church_members_insert_admin" ON church_members
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "church_members_update_admin" ON church_members
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "church_members_delete_admin" ON church_members
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'church_members: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'church_members: table does not exist, skipping';
END IF;
END $$;


-- ========== EMAIL SUBSCRIBERS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_subscribers') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Anyone can subscribe" ON email_subscribers';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage subscribers" ON email_subscribers';
  EXECUTE 'DROP POLICY IF EXISTS "email_subscribers_insert_public" ON email_subscribers';
  EXECUTE 'DROP POLICY IF EXISTS "email_subscribers_select_admin" ON email_subscribers';
  EXECUTE 'DROP POLICY IF EXISTS "email_subscribers_update_admin" ON email_subscribers';
  EXECUTE 'DROP POLICY IF EXISTS "email_subscribers_delete_admin" ON email_subscribers';

  -- Enable RLS
  EXECUTE 'ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY';

  -- Create new policies (public INSERT, admin for rest)
  EXECUTE 'CREATE POLICY "email_subscribers_insert_public" ON email_subscribers FOR INSERT WITH CHECK (true)';

  EXECUTE 'CREATE POLICY "email_subscribers_select_admin" ON email_subscribers
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "email_subscribers_update_admin" ON email_subscribers
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "email_subscribers_delete_admin" ON email_subscribers
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'email_subscribers: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'email_subscribers: table does not exist, skipping';
END IF;
END $$;


-- ========== NEWSLETTER LOGS POLICIES (ADMIN ONLY) ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'newsletter_logs') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage newsletter logs" ON newsletter_logs';
  EXECUTE 'DROP POLICY IF EXISTS "newsletter_logs_select_admin" ON newsletter_logs';
  EXECUTE 'DROP POLICY IF EXISTS "newsletter_logs_insert_admin" ON newsletter_logs';
  EXECUTE 'DROP POLICY IF EXISTS "newsletter_logs_update_admin" ON newsletter_logs';
  EXECUTE 'DROP POLICY IF EXISTS "newsletter_logs_delete_admin" ON newsletter_logs';

  -- Enable RLS
  EXECUTE 'ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY';

  -- Create new policies (admin-only for ALL operations)
  EXECUTE 'CREATE POLICY "newsletter_logs_select_admin" ON newsletter_logs
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "newsletter_logs_insert_admin" ON newsletter_logs
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "newsletter_logs_update_admin" ON newsletter_logs
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "newsletter_logs_delete_admin" ON newsletter_logs
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'newsletter_logs: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'newsletter_logs: table does not exist, skipping';
END IF;
END $$;


-- ========== HERO SLIDES POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hero_slides') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Hero slides are viewable by everyone" ON hero_slides';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage hero slides" ON hero_slides';
  EXECUTE 'DROP POLICY IF EXISTS "hero_slides_select_public" ON hero_slides';
  EXECUTE 'DROP POLICY IF EXISTS "hero_slides_insert_admin" ON hero_slides';
  EXECUTE 'DROP POLICY IF EXISTS "hero_slides_update_admin" ON hero_slides';
  EXECUTE 'DROP POLICY IF EXISTS "hero_slides_delete_admin" ON hero_slides';

  -- Enable RLS
  EXECUTE 'ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY';

  -- Create new policies
  EXECUTE 'CREATE POLICY "hero_slides_select_public" ON hero_slides FOR SELECT USING (true)';

  EXECUTE 'CREATE POLICY "hero_slides_insert_admin" ON hero_slides
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "hero_slides_update_admin" ON hero_slides
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "hero_slides_delete_admin" ON hero_slides
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'hero_slides: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'hero_slides: table does not exist, skipping';
END IF;
END $$;


-- ========== NEW FAMILIES POLICIES (ADMIN ONLY) ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'new_families') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage new families" ON new_families';
  EXECUTE 'DROP POLICY IF EXISTS "new_families_select_admin" ON new_families';
  EXECUTE 'DROP POLICY IF EXISTS "new_families_insert_admin" ON new_families';
  EXECUTE 'DROP POLICY IF EXISTS "new_families_update_admin" ON new_families';
  EXECUTE 'DROP POLICY IF EXISTS "new_families_delete_admin" ON new_families';

  -- Enable RLS
  EXECUTE 'ALTER TABLE new_families ENABLE ROW LEVEL SECURITY';

  -- Create new policies (admin-only for ALL operations)
  EXECUTE 'CREATE POLICY "new_families_select_admin" ON new_families
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "new_families_insert_admin" ON new_families
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "new_families_update_admin" ON new_families
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "new_families_delete_admin" ON new_families
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'new_families: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'new_families: table does not exist, skipping';
END IF;
END $$;


-- ========== NEW FAMILY REGISTRATIONS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'new_family_registrations') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Anyone can register" ON new_family_registrations';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage registrations" ON new_family_registrations';
  EXECUTE 'DROP POLICY IF EXISTS "new_family_registrations_insert_public" ON new_family_registrations';
  EXECUTE 'DROP POLICY IF EXISTS "new_family_registrations_select_admin" ON new_family_registrations';
  EXECUTE 'DROP POLICY IF EXISTS "new_family_registrations_update_admin" ON new_family_registrations';
  EXECUTE 'DROP POLICY IF EXISTS "new_family_registrations_delete_admin" ON new_family_registrations';

  -- Enable RLS
  EXECUTE 'ALTER TABLE new_family_registrations ENABLE ROW LEVEL SECURITY';

  -- Create new policies (public INSERT, admin for rest)
  EXECUTE 'CREATE POLICY "new_family_registrations_insert_public" ON new_family_registrations FOR INSERT WITH CHECK (true)';

  EXECUTE 'CREATE POLICY "new_family_registrations_select_admin" ON new_family_registrations
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "new_family_registrations_update_admin" ON new_family_registrations
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "new_family_registrations_delete_admin" ON new_family_registrations
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'new_family_registrations: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'new_family_registrations: table does not exist, skipping';
END IF;
END $$;


-- ========== BIBLE MATERIALS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bible_materials') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Bible materials are viewable by everyone" ON bible_materials';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage bible materials" ON bible_materials';
  EXECUTE 'DROP POLICY IF EXISTS "bible_materials_select_public" ON bible_materials';
  EXECUTE 'DROP POLICY IF EXISTS "bible_materials_insert_admin" ON bible_materials';
  EXECUTE 'DROP POLICY IF EXISTS "bible_materials_update_admin" ON bible_materials';
  EXECUTE 'DROP POLICY IF EXISTS "bible_materials_delete_admin" ON bible_materials';

  -- Enable RLS
  EXECUTE 'ALTER TABLE bible_materials ENABLE ROW LEVEL SECURITY';

  -- Create new policies
  EXECUTE 'CREATE POLICY "bible_materials_select_public" ON bible_materials FOR SELECT USING (true)';

  EXECUTE 'CREATE POLICY "bible_materials_insert_admin" ON bible_materials
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bible_materials_update_admin" ON bible_materials
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "bible_materials_delete_admin" ON bible_materials
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'bible_materials: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'bible_materials: table does not exist, skipping';
END IF;
END $$;


-- ========== POSTS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage posts" ON posts';
  EXECUTE 'DROP POLICY IF EXISTS "posts_select_public" ON posts';
  EXECUTE 'DROP POLICY IF EXISTS "posts_insert_admin" ON posts';
  EXECUTE 'DROP POLICY IF EXISTS "posts_update_admin" ON posts';
  EXECUTE 'DROP POLICY IF EXISTS "posts_delete_admin" ON posts';

  -- Enable RLS
  EXECUTE 'ALTER TABLE posts ENABLE ROW LEVEL SECURITY';

  -- Create new policies (SELECT only for published posts)
  EXECUTE 'CREATE POLICY "posts_select_public" ON posts FOR SELECT USING (status = ''published'')';

  EXECUTE 'CREATE POLICY "posts_insert_admin" ON posts
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "posts_update_admin" ON posts
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "posts_delete_admin" ON posts
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'posts: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'posts: table does not exist, skipping';
END IF;
END $$;


-- ========== PRAYER REQUESTS POLICIES ==========
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prayer_requests') THEN
  -- Drop existing policies
  EXECUTE 'DROP POLICY IF EXISTS "Prayer requests are viewable by everyone" ON prayer_requests';
  EXECUTE 'DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON prayer_requests';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can manage prayer requests" ON prayer_requests';
  EXECUTE 'DROP POLICY IF EXISTS "prayer_requests_select_public" ON prayer_requests';
  EXECUTE 'DROP POLICY IF EXISTS "prayer_requests_insert_public" ON prayer_requests';
  EXECUTE 'DROP POLICY IF EXISTS "prayer_requests_update_admin" ON prayer_requests';
  EXECUTE 'DROP POLICY IF EXISTS "prayer_requests_delete_admin" ON prayer_requests';

  -- Enable RLS
  EXECUTE 'ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY';

  -- Create new policies (public SELECT and INSERT)
  EXECUTE 'CREATE POLICY "prayer_requests_select_public" ON prayer_requests FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "prayer_requests_insert_public" ON prayer_requests FOR INSERT WITH CHECK (true)';

  EXECUTE 'CREATE POLICY "prayer_requests_update_admin" ON prayer_requests
    FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  EXECUTE 'CREATE POLICY "prayer_requests_delete_admin" ON prayer_requests
    FOR DELETE USING (
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>''email'')
        AND admin_users.role IN (''admin'', ''super_admin'')
      )
    )';

  RAISE NOTICE 'prayer_requests: RLS policies updated successfully';
ELSE
  RAISE NOTICE 'prayer_requests: table does not exist, skipping';
END IF;
END $$;


-- ========== STORAGE BUCKET POLICIES ==========

-- Drop existing storage policies (storage.objects always exists)
DROP POLICY IF EXISTS "Bulletins bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to bulletins" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update bulletins" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete bulletins" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_select_public" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_delete_admin" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_bucket_select_public" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_bucket_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_bucket_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "bulletins_bucket_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Bible materials bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to bible-materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update bible-materials" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete bible-materials" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_select_public" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_delete_admin" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_bucket_select_public" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_bucket_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_bucket_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "bible_materials_bucket_delete_admin" ON storage.objects;

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
DROP POLICY IF EXISTS "members_bucket_select_admin" ON storage.objects;
DROP POLICY IF EXISTS "members_bucket_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "members_bucket_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "members_bucket_delete_admin" ON storage.objects;

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
DROP POLICY IF EXISTS "covers_bucket_select_public" ON storage.objects;
DROP POLICY IF EXISTS "covers_bucket_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "covers_bucket_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "covers_bucket_delete_admin" ON storage.objects;

DROP POLICY IF EXISTS "Slides bucket is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to slides" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update slides" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete slides" ON storage.objects;
DROP POLICY IF EXISTS "slides_select_public" ON storage.objects;
DROP POLICY IF EXISTS "slides_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "slides_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "slides_delete_admin" ON storage.objects;
DROP POLICY IF EXISTS "slides_bucket_select_public" ON storage.objects;
DROP POLICY IF EXISTS "slides_bucket_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "slides_bucket_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "slides_bucket_delete_admin" ON storage.objects;


-- Create sermons bucket if not exists (safe with ON CONFLICT)
DO $$ BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('sermons', 'sermons', true)
  ON CONFLICT (id) DO NOTHING;
  RAISE NOTICE 'sermons bucket: created or already exists';
END $$;


-- ========== BULLETINS BUCKET POLICIES ==========

CREATE POLICY "bulletins_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'bulletins');

CREATE POLICY "bulletins_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bulletins' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "bulletins_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'bulletins' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

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

CREATE POLICY "bible_materials_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'bible-materials');

CREATE POLICY "bible_materials_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bible-materials' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "bible_materials_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'bible-materials' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

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

CREATE POLICY "sermons_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'sermons');

CREATE POLICY "sermons_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'sermons' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "sermons_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'sermons' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

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

CREATE POLICY "members_bucket_select_admin" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'members' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "members_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'members' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "members_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'members' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

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

CREATE POLICY "posts_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'posts');

CREATE POLICY "posts_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'posts' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "posts_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'posts' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

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

CREATE POLICY "covers_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "covers_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'covers' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "covers_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'covers' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

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

CREATE POLICY "slides_bucket_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'slides');

CREATE POLICY "slides_bucket_insert_admin" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "slides_bucket_update_admin" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "slides_bucket_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== SERMON ATTACHMENT COLUMNS ==========

DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sermons') THEN
  EXECUTE 'ALTER TABLE sermons ADD COLUMN IF NOT EXISTS attachment_url TEXT';
  EXECUTE 'ALTER TABLE sermons ADD COLUMN IF NOT EXISTS attachment_name TEXT';
  RAISE NOTICE 'sermons: attachment columns added';
ELSE
  RAISE NOTICE 'sermons: table does not exist, skipping attachment columns';
END IF;
END $$;
