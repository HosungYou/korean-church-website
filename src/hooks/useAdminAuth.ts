import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../../lib/supabase'

export interface AdminUser {
  id: string
  email: string
  name: string
  role?: string | null
  avatarUrl?: string | null
}

interface ProfileData {
  full_name: string | null
  role: string | null
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

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single<ProfileData>()

        if (profileError || !profile || profile.role !== 'admin') {
          await supabase.auth.signOut()
          if (isMounted) {
            setAdmin(null)
            setError(profileError?.message || '관리자 권한이 없습니다.')
          }
          router.replace('/admin/login?error=not_admin')
          return
        }

        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email ?? '',
          name:
            profile?.full_name ||
            (session.user.user_metadata as any)?.full_name ||
            '관리자',
          role: profile?.role ?? null,
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
