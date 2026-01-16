/**
 * Admin Authentication Middleware for Next.js API Routes
 *
 * This middleware verifies that the requesting user:
 * 1. Has a valid Supabase JWT token
 * 2. Exists in the admin_users table with admin role
 *
 * Usage:
 * ```typescript
 * import { withAdminAuth, AuthenticatedRequest } from '@/middleware/adminAuth'
 *
 * async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
 *   // req.adminUser is available here
 *   console.log(req.adminUser?.email)
 * }
 *
 * export default withAdminAuth(handler)
 * ```
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Extended request type with admin user information
 */
export interface AuthenticatedRequest extends NextApiRequest {
  adminUser?: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

/**
 * Type for API handler functions
 */
type ApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void

/**
 * Higher-order function that wraps an API handler with admin authentication
 *
 * @param handler - The API handler function to wrap
 * @returns Wrapped handler with authentication
 */
export function withAdminAuth(handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        error: 'Missing authorization header',
        code: 'AUTH_HEADER_MISSING'
      })
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Invalid authorization header format. Expected: Bearer <token>',
        code: 'AUTH_HEADER_INVALID'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        error: 'Empty token provided',
        code: 'TOKEN_EMPTY'
      })
    }

    try {
      // Verify the JWT token with Supabase
      const {
        data: { user },
        error: authError
      } = await supabaseAdmin.auth.getUser(token)

      if (authError) {
        console.error('Auth verification error:', authError.message)
        return res.status(401).json({
          error: 'Invalid or expired token',
          code: 'TOKEN_INVALID'
        })
      }

      if (!user) {
        return res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        })
      }

      // Check if user exists in admin_users table with admin role
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('admin_users')
        .select('id, email, name, role')
        .eq('id', user.id)
        .single()

      if (adminError) {
        // If table doesn't exist or user not found
        if (adminError.code === 'PGRST116') {
          // No rows returned
          return res.status(403).json({
            error: 'Admin access required. User is not an administrator.',
            code: 'NOT_ADMIN'
          })
        }

        if (adminError.code === '42P01') {
          // Table doesn't exist
          console.error('admin_users table does not exist')
          return res.status(500).json({
            error: 'Admin authentication not configured',
            code: 'ADMIN_TABLE_MISSING'
          })
        }

        console.error('Admin lookup error:', adminError)
        return res.status(500).json({
          error: 'Error verifying admin status',
          code: 'ADMIN_LOOKUP_ERROR'
        })
      }

      if (!adminData) {
        return res.status(403).json({
          error: 'Admin access required',
          code: 'NOT_ADMIN'
        })
      }

      // Verify role is admin or super_admin
      if (adminData.role !== 'admin' && adminData.role !== 'super_admin') {
        return res.status(403).json({
          error: 'Insufficient privileges',
          code: 'INSUFFICIENT_ROLE'
        })
      }

      // Attach admin user info to request
      req.adminUser = {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role
      }

      // Call the actual handler
      return handler(req, res)
    } catch (error) {
      console.error('Admin auth middleware error:', error)
      return res.status(500).json({
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      })
    }
  }
}

/**
 * Middleware that allows both admin and specific roles
 *
 * @param allowedRoles - Array of roles that are allowed access
 * @param handler - The API handler function to wrap
 * @returns Wrapped handler with role-based authentication
 */
export function withRoleAuth(allowedRoles: string[], handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid authorization header',
        code: 'AUTH_HEADER_INVALID'
      })
    }

    const token = authHeader.substring(7)

    try {
      const {
        data: { user },
        error: authError
      } = await supabaseAdmin.auth.getUser(token)

      if (authError || !user) {
        return res.status(401).json({
          error: 'Invalid or expired token',
          code: 'TOKEN_INVALID'
        })
      }

      // Check admin_users first
      const { data: adminData } = await supabaseAdmin
        .from('admin_users')
        .select('id, email, name, role')
        .eq('id', user.id)
        .single()

      if (adminData && allowedRoles.includes(adminData.role)) {
        req.adminUser = {
          id: adminData.id,
          email: adminData.email,
          name: adminData.name,
          role: adminData.role
        }
        return handler(req, res)
      }

      // Check profiles table as fallback
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', user.id)
        .single()

      if (profileData && allowedRoles.includes(profileData.role || 'user')) {
        req.adminUser = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.full_name,
          role: profileData.role || 'user'
        }
        return handler(req, res)
      }

      return res.status(403).json({
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        code: 'ROLE_REQUIRED'
      })
    } catch (error) {
      console.error('Role auth middleware error:', error)
      return res.status(500).json({
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      })
    }
  }
}

/**
 * Simple authentication check without admin requirement
 * Useful for routes that need authentication but not admin privileges
 */
export function withAuth(handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid authorization header',
        code: 'AUTH_HEADER_INVALID'
      })
    }

    const token = authHeader.substring(7)

    try {
      const {
        data: { user },
        error: authError
      } = await supabaseAdmin.auth.getUser(token)

      if (authError || !user) {
        return res.status(401).json({
          error: 'Invalid or expired token',
          code: 'TOKEN_INVALID'
        })
      }

      // Get user profile
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', user.id)
        .single()

      if (profileData) {
        req.adminUser = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.full_name,
          role: profileData.role || 'user'
        }
      } else {
        // Fallback to basic user info from auth
        req.adminUser = {
          id: user.id,
          email: user.email || '',
          name: (user.user_metadata as any)?.full_name || null,
          role: 'user'
        }
      }

      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({
        error: 'Authentication failed',
        code: 'AUTH_FAILED'
      })
    }
  }
}

export default withAdminAuth
