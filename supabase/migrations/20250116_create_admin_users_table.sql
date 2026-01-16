-- Migration: Create admin_users table and improve security
-- Date: 2025-01-16
-- Description: Creates admin_users table to replace hardcoded email in trigger,
--              improves RLS policies for better security
--
-- IMPORTANT: Run this migration in Supabase SQL Editor
-- After running, you MUST seed the initial admin user (see step 7)

-- ============================================================================
-- STEP 1: Create admin_users table
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

COMMENT ON TABLE admin_users IS 'Stores admin user information. Users in this table have admin access.';
COMMENT ON COLUMN admin_users.role IS 'admin = regular admin, super_admin = can manage other admins';

-- ============================================================================
-- STEP 2: Enable RLS on admin_users
-- ============================================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Create RLS policies for admin_users
-- ============================================================================

-- Admins can view the admin_users table
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Only super_admins can insert new admins
CREATE POLICY "Super admins can insert admin_users" ON admin_users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Only super_admins can update admin_users
CREATE POLICY "Super admins can update admin_users" ON admin_users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Only super_admins can delete admins (but not themselves)
CREATE POLICY "Super admins can delete other admin_users" ON admin_users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin')
    AND auth.uid() != id  -- Prevent self-deletion
  );

-- ============================================================================
-- STEP 4: Create indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ============================================================================
-- STEP 5: Create trigger for updated_at
-- ============================================================================

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: Update handle_new_user trigger function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    CASE
      -- Check if email exists in admin_users table
      WHEN EXISTS (SELECT 1 FROM admin_users WHERE email = new.email) THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Automatically creates a profile when a new user signs up. Sets role to admin if email is in admin_users table.';

-- ============================================================================
-- STEP 7: Seed initial admin user (MANUAL STEP)
-- ============================================================================

-- IMPORTANT: After running this migration, you need to manually add the initial
-- admin user. First, find the user ID:
--
-- SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';
--
-- Then insert (replace values as needed):
--
-- INSERT INTO admin_users (id, email, name, role)
-- VALUES (
--   'your-user-uuid-here',
--   'your-admin-email@example.com',
--   'Admin Name',
--   'super_admin'
-- );
--
-- Also update the existing profile if it exists:
--
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- ============================================================================
-- STEP 8: Improve profiles RLS (Optional but recommended)
-- ============================================================================

-- Comment out existing overly permissive policy if you want stricter security
-- DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Add more restrictive policies (uncomment to apply)
-- CREATE POLICY "Users can view own profile" ON profiles
--   FOR SELECT USING (auth.uid() = id);
--
-- CREATE POLICY "Admins can view all profiles" ON profiles
--   FOR SELECT USING (
--     auth.uid() IN (SELECT id FROM admin_users)
--   );

-- ============================================================================
-- STEP 9: Restrict posts creation to admins (Optional)
-- ============================================================================

-- Uncomment if you want only admins to create posts
-- DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
--
-- CREATE POLICY "Admins can create posts" ON posts
--   FOR INSERT WITH CHECK (
--     auth.uid() IN (SELECT id FROM admin_users)
--   );

-- ============================================================================
-- VERIFICATION QUERIES (Run after migration)
-- ============================================================================

-- Verify table was created:
-- SELECT * FROM admin_users;

-- Verify RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'admin_users';

-- Verify policies exist:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'admin_users';

-- Verify trigger function was updated:
-- SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';
