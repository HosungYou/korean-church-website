import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../../lib/supabase'
import type { AdminUser as AdminUserRow } from '../../types/supabase'

export interface AdminUser {
  id: string
  email: string
  name: string
  role?: AdminUserRow['role'] | null
  avatarUrl?: string | null
}

interface AdminUserData {
  name: string | null
  role: AdminUserRow['role'] | null
}

export function useAdminAuth() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        setLoading(true)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !sessionData.session) {
          if (isMounted) {
            setAdmin(null)
            setError(sessionError?.message || null)
          }
          router.replace('/admin/login')
          return
        }

        const session = sessionData.session

        // Query by email instead of id to handle first-time logins
        const { data: adminUserData, error: adminError } = await supabase
          .from('admin_users')
          .select('id, name, role')
          .eq('email', session.user.email)
          .single<AdminUserData & { id: string }>()

        if (adminError || !adminUserData || (adminUserData.role !== 'admin' && adminUserData.role !== 'super_admin')) {
          await supabase.auth.signOut()
          if (isMounted) {
            setAdmin(null)
            setError(adminError?.message || '관리자 권한이 없습니다.')
          }
          router.replace('/admin/login?error=not_admin')
          return
        }

        // Sync admin_users.id with auth.users.id if different
        if (adminUserData.id !== session.user.id) {
          await supabase
            .from('admin_users')
            .update({ id: session.user.id })
            .eq('email', session.user.email)
        }

        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email ?? '',
          name:
            adminUserData?.name ||
            (session.user.user_metadata as any)?.full_name ||
            '관리자',
          role: adminUserData?.role ?? null,
          avatarUrl: (session.user.user_metadata as any)?.avatar_url || null
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('adminLoggedIn', 'true')
          localStorage.setItem('adminUser', JSON.stringify(adminUser))
          window.dispatchEvent(new Event('admin-auth-changed'))
        }

        if (isMounted) {
          setAdmin(adminUser)
          setError(null)
        }
      } catch (err: any) {
        if (isMounted) {
          setAdmin(null)
          setError(err?.message || '인증 과정에서 오류가 발생했습니다.')
        }
        router.replace('/admin/login')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminLoggedIn')
          localStorage.removeItem('adminUser')
          window.dispatchEvent(new Event('admin-auth-changed'))
        }
        setAdmin(null)
        router.replace('/admin/login')
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminUser')
      window.dispatchEvent(new Event('admin-auth-changed'))
    }
    router.replace('/admin/login')
  }

  return { admin, loading, error, signOut }
}
