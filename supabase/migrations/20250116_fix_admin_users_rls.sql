-- Migration: Fix admin_users RLS infinite recursion
-- Date: 2025-01-16
-- Description: Fixes the infinite recursion error in admin_users RLS policies
--              by using SECURITY DEFINER functions
--
-- IMPORTANT: Run this in Supabase SQL Editor IMMEDIATELY

-- ============================================================================
-- STEP 1: Drop problematic policies
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can delete other admin_users" ON admin_users;

-- ============================================================================
-- STEP 2: Create helper function with SECURITY DEFINER
-- This function bypasses RLS and runs as the function owner (superuser)
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_admin(UUID) IS 'Check if user is an admin. Uses SECURITY DEFINER to bypass RLS.';
COMMENT ON FUNCTION is_super_admin(UUID) IS 'Check if user is a super_admin. Uses SECURITY DEFINER to bypass RLS.';

-- ============================================================================
-- STEP 3: Recreate policies using helper functions
-- Now the policies call functions instead of querying admin_users directly
-- ============================================================================

-- Admins can view the admin_users table
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT USING (is_admin(auth.uid()));

-- Only super_admins can insert new admins
CREATE POLICY "Super admins can insert admin_users" ON admin_users
  FOR INSERT WITH CHECK (is_super_admin(auth.uid()));

-- Only super_admins can update admin_users
CREATE POLICY "Super admins can update admin_users" ON admin_users
  FOR UPDATE USING (is_super_admin(auth.uid()));

-- Only super_admins can delete admins (but not themselves)
CREATE POLICY "Super admins can delete other admin_users" ON admin_users
  FOR DELETE USING (
    is_super_admin(auth.uid())
    AND auth.uid() != id  -- Prevent self-deletion
  );

-- ============================================================================
-- STEP 4: Verify newhosung@gmail.com is in admin_users
-- ============================================================================

-- First check if user exists in auth.users
-- SELECT id, email FROM auth.users WHERE email = 'newhosung@gmail.com';

-- Insert admin user (uncomment and run with correct UUID)
-- If the user already exists, this will do nothing (ON CONFLICT)
INSERT INTO admin_users (id, email, name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin'
FROM auth.users
WHERE email = 'newhosung@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

-- ============================================================================
-- STEP 5: Update profiles table if needed
-- ============================================================================

UPDATE profiles
SET role = 'admin'
WHERE email = 'newhosung@gmail.com';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Run these to verify:
-- SELECT * FROM admin_users;
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'admin_users';
-- SELECT is_admin('your-uuid-here');
