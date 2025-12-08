import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createSupabaseClient } from '../../lib/supabaseClient'

type Status = 'loading' | 'success' | 'error'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createSupabaseClient()

      const setLegacyAdminState = (user: any, profile: any) => {
        if (typeof window === 'undefined') {
          return
        }

        const adminUser = {
          email: user.email ?? '',
          name: profile?.full_name || user.user_metadata?.full_name || '관리자',
          photoURL: user.user_metadata?.avatar_url || null,
          uid: user.id,
          role: profile?.role ?? null,
          loginTime: new Date().toISOString()
        }

        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminUser', JSON.stringify(adminUser))
        window.dispatchEvent(new Event('admin-auth-changed'))
      }

      try {
        let { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (!sessionData.session) {
          const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'))
          const queryParams = new URLSearchParams(window.location.search)

          const accessToken = hashParams.get('access_token') || queryParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token')

          if (accessToken && refreshToken) {
            const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })

            if (setSessionError) {
              throw setSessionError
            }

            sessionData = setSessionData
          }
        }

        if (sessionError || !sessionData.session) {
          setStatus('error')
          setMessage(sessionError?.message || '인증 정보를 찾을 수 없습니다.')
          setTimeout(() => router.replace('/admin/login?error=no_session'), 1200)
          return
        }

        const session = sessionData.session

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single()

        const role = (profile as { role?: string } | null)?.role

        if (profileError || role !== 'admin') {
          await supabase.auth.signOut()
          setStatus('error')
          setMessage('관리자 권한이 없는 계정입니다.')
          setTimeout(() => router.replace('/admin/login?error=not_admin'), 1200)
          return
        }

        setLegacyAdminState(session.user, profile)
        setStatus('success')
        router.replace('/admin/dashboard')
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error?.message || '인증 처리 중 오류가 발생했습니다.')
        setTimeout(() => router.replace('/admin/login?error=auth_failed'), 1500)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-700 font-semibold">로그인 정보를 확인하고 있습니다...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
              ✓
            </div>
            <p className="text-gray-700 font-semibold">로그인 성공! 대시보드로 이동합니다.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500 flex items-center justify-center text-white text-xl">
              !
            </div>
            <p className="text-red-600 font-semibold">로그인에 실패했습니다.</p>
            {message && <p className="text-gray-600">{message}</p>}
          </>
        )}
      </div>
    </div>
  )
}
