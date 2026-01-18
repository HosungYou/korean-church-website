-- Migration: Fix gallery RLS policies to use admin_users table
-- Date: 2026-01-18
-- Version: 2.2.2
-- Description: Updates RLS policies to check admin_users table instead of profiles table
-- Issue: Admins in admin_users table couldn't edit gallery albums/photos due to RLS checking profiles table

-- ========== DROP EXISTING POLICIES ==========

-- Drop all existing gallery_albums policies
DROP POLICY IF EXISTS "Visible albums are viewable by everyone" ON gallery_albums;
DROP POLICY IF EXISTS "Admins can manage albums" ON gallery_albums;
DROP POLICY IF EXISTS "gallery_albums_select_visible" ON gallery_albums;
DROP POLICY IF EXISTS "gallery_albums_select_admin" ON gallery_albums;
DROP POLICY IF EXISTS "gallery_albums_insert_admin" ON gallery_albums;
DROP POLICY IF EXISTS "gallery_albums_update_admin" ON gallery_albums;
DROP POLICY IF EXISTS "gallery_albums_delete_admin" ON gallery_albums;

-- Drop all existing gallery_photos policies
DROP POLICY IF EXISTS "Photos in visible albums are viewable" ON gallery_photos;
DROP POLICY IF EXISTS "Admins can manage photos" ON gallery_photos;
DROP POLICY IF EXISTS "gallery_photos_select_visible" ON gallery_photos;
DROP POLICY IF EXISTS "gallery_photos_select_admin" ON gallery_photos;
DROP POLICY IF EXISTS "gallery_photos_insert_admin" ON gallery_photos;
DROP POLICY IF EXISTS "gallery_photos_update_admin" ON gallery_photos;
DROP POLICY IF EXISTS "gallery_photos_delete_admin" ON gallery_photos;


-- ========== GALLERY ALBUMS POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "gallery_albums_select_public" ON gallery_albums
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "gallery_albums_insert_admin" ON gallery_albums
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "gallery_albums_update_admin" ON gallery_albums
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "gallery_albums_delete_admin" ON gallery_albums
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== GALLERY PHOTOS POLICIES ==========

-- Allow everyone to SELECT (public read)
CREATE POLICY "gallery_photos_select_public" ON gallery_photos
  FOR SELECT USING (true);

-- Allow admins to INSERT
CREATE POLICY "gallery_photos_insert_admin" ON gallery_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to UPDATE
CREATE POLICY "gallery_photos_update_admin" ON gallery_photos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to DELETE
CREATE POLICY "gallery_photos_delete_admin" ON gallery_photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
      AND admin_users.role IN ('admin', 'super_admin')
    )
  );


-- ========== COMMENTS ==========
COMMENT ON POLICY "gallery_albums_select_public" ON gallery_albums IS 'Allow public read access to all albums';
COMMENT ON POLICY "gallery_albums_insert_admin" ON gallery_albums IS 'Allow admins from admin_users table to insert albums (case-insensitive email match)';
COMMENT ON POLICY "gallery_albums_update_admin" ON gallery_albums IS 'Allow admins from admin_users table to update albums (case-insensitive email match)';
COMMENT ON POLICY "gallery_albums_delete_admin" ON gallery_albums IS 'Allow admins from admin_users table to delete albums (case-insensitive email match)';

COMMENT ON POLICY "gallery_photos_select_public" ON gallery_photos IS 'Allow public read access to all photos';
COMMENT ON POLICY "gallery_photos_insert_admin" ON gallery_photos IS 'Allow admins from admin_users table to insert photos (case-insensitive email match)';
COMMENT ON POLICY "gallery_photos_update_admin" ON gallery_photos IS 'Allow admins from admin_users table to update photos (case-insensitive email match)';
COMMENT ON POLICY "gallery_photos_delete_admin" ON gallery_photos IS 'Allow admins from admin_users table to delete photos (case-insensitive email match)';
