# Security Audit Report

**Project**: korean-church-website
**Date**: 2025-01-16
**Auditor**: Claude Code Security Review
**Status**: Critical issues identified - Action required

---

## Executive Summary

This security audit reviewed the Row Level Security (RLS) policies in `supabase/schema.sql`, API route authentication, and hardcoded credentials. Several security vulnerabilities were identified that require immediate attention.

### Risk Assessment

| Category | Severity | Status |
|----------|----------|--------|
| Hardcoded Admin Email | **CRITICAL** | Needs Fix |
| API Route Authentication | **HIGH** | Partial Coverage |
| RLS Policy Gaps | **MEDIUM** | Needs Improvement |
| Missing admin_users Table | **HIGH** | Pending Creation |

---

## 1. RLS Policy Analysis

### 1.1 Current RLS Status

All tables have RLS enabled, which is correct. However, several policy improvements are needed.

#### Tables with RLS Enabled:
- profiles
- posts
- prayer_requests
- new_families
- sermons
- gallery_albums
- gallery_photos
- bible_reading_plans
- bible_reading_entries
- hero_slides
- email_subscribers
- church_members
- bulletins
- new_family_registrations
- newsletter_logs

### 1.2 RLS Policy Issues

#### ISSUE 1: profiles Table - Overly Permissive SELECT Policy (MEDIUM)

**Current Policy**:
```sql
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
```

**Problem**: All profile data (including role information) is publicly readable. This could expose admin user identification.

**Recommendation**:
```sql
-- Replace with more restrictive policy
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### ISSUE 2: posts Table - Any Authenticated User Can Create (MEDIUM)

**Current Policy**:
```sql
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

**Problem**: Any authenticated user can create posts, not just admins.

**Recommendation**:
```sql
-- Only admins should create posts
CREATE POLICY "Admins can create posts" ON posts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### ISSUE 3: prayer_requests Table - No DELETE Policy (LOW)

**Problem**: There's no explicit DELETE policy for prayer_requests.

**Recommendation**:
```sql
CREATE POLICY "Admins can delete prayer requests" ON prayer_requests
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### ISSUE 4: new_families vs new_family_registrations Redundancy (LOW)

**Problem**: Two similar tables exist (`new_families` and `new_family_registrations`) with similar RLS policies, potentially causing confusion.

**Recommendation**: Consolidate into single table or clearly document purpose difference.

### 1.3 Good RLS Practices Found

- Admin-only access for sensitive tables (church_members, email_subscribers, newsletter_logs)
- Proper use of visibility flags (is_visible, is_active) for public-facing content
- Cascading visibility for related tables (gallery_photos inherit album visibility)

---

## 2. Hardcoded Admin Email Issue

### 2.1 Location

**File**: `/Volumes/External SSD/Projects/korean-church-website/supabase/schema.sql`
**Lines**: 457-472

**Current Code**:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    CASE
      WHEN new.email = 'newhosung@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.2 Security Risks

1. **Hardcoded credential**: Admin email is exposed in source code
2. **Single point of failure**: Only one email can auto-assign admin role
3. **Version control exposure**: Email visible in git history
4. **Limited flexibility**: Cannot add admins without code changes

### 2.3 Recommended Solutions

#### Option A: Use admin_users Table (RECOMMENDED)

Create a dedicated admin_users table and modify the trigger to check it:

```sql
-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Only admins can view admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Only super_admins can manage admin_users" ON admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- 4. Update trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    CASE
      WHEN EXISTS (SELECT 1 FROM admin_users WHERE email = new.email) THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Seed initial admin (run once in Supabase SQL editor)
-- INSERT INTO admin_users (id, email, name, role)
-- SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin'
-- FROM auth.users
-- WHERE email = 'newhosung@gmail.com';
```

#### Option B: Environment Variable Approach

Use environment variable for admin emails:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  admin_emails TEXT[];
BEGIN
  -- Get admin emails from app settings (requires Supabase vault or app_settings table)
  admin_emails := ARRAY(
    SELECT email FROM app_settings WHERE key = 'admin_emails'
  );

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    CASE
      WHEN new.email = ANY(admin_emails) THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. API Route Authentication Analysis

### 3.1 Current State

| API Route | Auth Status | Risk |
|-----------|-------------|------|
| `/api/upload.ts` | **NO AUTH** | **HIGH** |
| `/api/email/new-family-notification.ts` | **NO AUTH** | MEDIUM |
| `/api/email/newsletter.ts` | Bearer Token Check | GOOD |

### 3.2 Critical Issue: Upload API Has No Authentication

**File**: `/Volumes/External SSD/Projects/korean-church-website/src/pages/api/upload.ts`

**Current Code** (lines 13-17):
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  // NO AUTHENTICATION CHECK - Direct file upload allowed
```

**Risk**: Anyone can upload files to the server without authentication, potentially:
- Filling server storage
- Uploading malicious files
- Using server as file hosting

### 3.3 Recommended API Middleware

Create a reusable admin authentication middleware:

**File**: `src/middleware/adminAuth.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AuthenticatedRequest extends NextApiRequest {
  adminUser?: {
    id: string
    email: string
    role: string
  }
}

type ApiHandler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>

export function withAdminAuth(handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer '

    try {
      // Verify the token with Supabase
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired token' })
      }

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('admin_users')
        .select('id, email, role')
        .eq('id', user.id)
        .single()

      if (adminError || !adminData || adminData.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' })
      }

      // Attach admin user to request
      req.adminUser = {
        id: adminData.id,
        email: adminData.email,
        role: adminData.role
      }

      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Authentication failed' })
    }
  }
}
```

**Usage in upload.ts**:

```typescript
import { withAdminAuth, AuthenticatedRequest } from '../../middleware/adminAuth'
import { NextApiResponse } from 'next'

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // req.adminUser is now available
  // ... rest of upload logic
}

export default withAdminAuth(handler)
```

---

## 4. Action Items

### Critical (Fix Immediately)

- [ ] **SEC-001**: Create `admin_users` table in Supabase
- [ ] **SEC-002**: Update `handle_new_user()` trigger to use admin_users table
- [ ] **SEC-003**: Add authentication to `/api/upload.ts`

### High Priority

- [ ] **SEC-004**: Tighten profiles table SELECT policy
- [ ] **SEC-005**: Restrict posts INSERT to admins only
- [ ] **SEC-006**: Create reusable admin auth middleware

### Medium Priority

- [ ] **SEC-007**: Add DELETE policy for prayer_requests
- [ ] **SEC-008**: Audit all API routes for auth requirements
- [ ] **SEC-009**: Add rate limiting to public API endpoints

### Low Priority

- [ ] **SEC-010**: Consolidate or document new_families vs new_family_registrations
- [ ] **SEC-011**: Add audit logging for admin actions
- [ ] **SEC-012**: Implement CSRF protection for forms

---

## 5. Improved Schema SQL

The following SQL migrations should be applied in order:

### Migration 1: Create admin_users table

```sql
-- Migration: Create admin_users table
-- Run in Supabase SQL Editor

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for admin_users
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Super admins can manage admin_users" ON admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- 4. Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- 5. Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Migration 2: Update handle_new_user trigger

```sql
-- Migration: Update handle_new_user trigger
-- Run in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    CASE
      WHEN EXISTS (SELECT 1 FROM admin_users WHERE email = new.email) THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Migration 3: Seed initial admin

```sql
-- Migration: Seed initial admin user
-- Run in Supabase SQL Editor AFTER the admin creates an account

-- Get the user ID first
-- SELECT id, email FROM auth.users WHERE email = 'newhosung@gmail.com';

-- Then insert (replace UUID with actual user ID)
-- INSERT INTO admin_users (id, email, name, role)
-- VALUES ('actual-user-uuid', 'newhosung@gmail.com', 'Admin Name', 'super_admin');
```

### Migration 4: Improve profiles RLS

```sql
-- Migration: Improve profiles RLS
-- Run in Supabase SQL Editor

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create more restrictive policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );
```

### Migration 5: Restrict posts creation

```sql
-- Migration: Restrict posts creation to admins
-- Run in Supabase SQL Editor

-- Drop existing policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;

-- Create admin-only insert policy
CREATE POLICY "Admins can create posts" ON posts
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM admin_users)
  );
```

---

## 6. Testing Checklist

After implementing fixes:

- [ ] Test admin login flow works correctly
- [ ] Test non-admin users cannot access admin dashboard
- [ ] Test upload API rejects unauthenticated requests
- [ ] Test RLS policies by querying as different user roles
- [ ] Verify profiles are not publicly queryable
- [ ] Test new user registration creates correct role
- [ ] Verify admin_users table is properly secured

---

## Appendix: useAdminAuth Hook Analysis

The current `useAdminAuth` hook at `/Volumes/External SSD/Projects/korean-church-website/src/hooks/useAdminAuth.ts` correctly:

1. Checks for active Supabase session
2. Queries admin_users table for role verification
3. Redirects non-admin users to login
4. Signs out users without admin privileges

**Note**: The hook references `admin_users` table which does not exist yet. This table must be created for the authentication to work properly.

---

*Report generated by Claude Code Security Review*
