import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { supabase } from '../../../lib/supabase'
import Layout from '../../components/Layout'

const AuthCallbackPage = () => {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('[Callback] Starting auth callback...')
        console.log('[Callback] URL hash:', window.location.hash)
        console.log('[Callback] URL search:', window.location.search)

        // Get the auth code from URL
        const { data: { session }, error } = await supabase.auth.getSession()

        console.log('[Callback] getSession result:', {
          hasSession: !!session,
          error: error?.message,
          userId: session?.user?.id
        })

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setErrorMessage(error.message)
          return
        }

        if (session?.user) {
          console.log('[Callback] Session found, checking admin role...')
          // Check if user is admin
          const { data: adminData, error: adminError } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('id', session.user.id)
            .single<{ id: string; full_name: string | null; role: string }>()

          console.log('[Callback] Admin check result:', {
            adminData,
            error: adminError?.message
          })

          if (adminError || !adminData || adminData.role !== 'admin') {
            console.error('Admin check failed:', adminError)
            await supabase.auth.signOut()
            setStatus('error')
            setErrorMessage('권한이 없는 계정입니다. 관리자에게 문의하세요.')
            setTimeout(() => router.push('/admin/login'), 2000)
            return
          }

          // Store admin info in localStorage
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('adminLoggedIn', 'true')
            window.localStorage.setItem(
              'adminUser',
              JSON.stringify({
                email: session.user.email,
                name: adminData.full_name || session.user.user_metadata?.full_name || '관리자',
                photoURL: session.user.user_metadata?.avatar_url,
                uid: session.user.id,
                role: adminData.role,
                loginTime: new Date().toISOString()
              })
            )
            window.dispatchEvent(new Event('admin-auth-changed'))
          }

          setStatus('success')
          // Redirect to dashboard
          router.push('/admin/dashboard')
        } else {
          // No session, try to exchange code
          console.log('[Callback] No session found, trying to extract tokens from URL...')
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const queryParams = new URLSearchParams(window.location.search)

          const accessToken = hashParams.get('access_token') || queryParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token')

          console.log('[Callback] Tokens found:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken
          })

          if (accessToken && refreshToken) {
            console.log('[Callback] Setting session with tokens...')
            const { data, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })

            if (setSessionError) {
              console.error('Set session error:', setSessionError)
              setStatus('error')
              setErrorMessage(setSessionError.message)
              return
            }

            if (data.session) {
              // Retry admin check
              const { data: adminData } = await supabase
                .from('profiles')
                .select('id, full_name, role')
                .eq('id', data.session.user.id)
                .single<{ id: string; full_name: string | null; role: string }>()

              if (!adminData || adminData.role !== 'admin') {
                await supabase.auth.signOut()
                setStatus('error')
                setErrorMessage('권한이 없는 계정입니다.')
                setTimeout(() => router.push('/admin/login'), 2000)
                return
              }

              if (typeof window !== 'undefined') {
                window.localStorage.setItem('adminLoggedIn', 'true')
                window.localStorage.setItem(
                  'adminUser',
                  JSON.stringify({
                    email: data.session.user.email,
                    name: adminData.full_name || data.session.user.user_metadata?.full_name || '관리자',
                    photoURL: data.session.user.user_metadata?.avatar_url,
                    uid: data.session.user.id,
                    role: adminData.role,
                    loginTime: new Date().toISOString()
                  })
                )
                window.dispatchEvent(new Event('admin-auth-changed'))
              }

              setStatus('success')
              router.push('/admin/dashboard')
              return
            }
          }

          // No session and no tokens
          setStatus('error')
          setErrorMessage('인증 정보를 찾을 수 없습니다.')
          setTimeout(() => router.push('/admin/login'), 2000)
        }
      } catch (err: any) {
        console.error('Auth callback exception:', err)
        setStatus('error')
        setErrorMessage(err.message || '인증 처리 중 오류가 발생했습니다.')
        setTimeout(() => router.push('/admin/login'), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 font-korean">로그인 처리 중...</h2>
              <p className="mt-2 text-gray-600 font-korean">잠시만 기다려주세요.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 font-korean">로그인 성공!</h2>
              <p className="mt-2 text-gray-600 font-korean">대시보드로 이동합니다...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 font-korean">로그인 실패</h2>
              <p className="mt-2 text-red-600 font-korean">{errorMessage}</p>
              <p className="mt-4 text-gray-500 font-korean text-sm">로그인 페이지로 이동합니다...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AuthCallbackPage
