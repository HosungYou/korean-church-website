import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Lock, Mail, Eye, EyeOff, Church } from 'lucide-react'
import { createSupabaseClient } from '../../lib/supabaseClient'
import type { AdminUser as AdminUserRow } from '../../types/supabase'

// ===========================================
// VS Design Diverge: Admin Login Form
// OKLCH Color System + Editorial Style
// ===========================================

interface AdminLoginFormProps {
  showHeader?: boolean
  className?: string
  cardClassName?: string
  onSuccessRedirect?: string
}

interface AdminUserData {
  name: string | null
  role: AdminUserRow['role'] | null
}

const AdminLoginForm = ({
  showHeader = true,
  className = '',
  cardClassName = '',
  onSuccessRedirect = '/admin/dashboard'
}: AdminLoginFormProps) => {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseClient(), [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const setAdminState = (sessionUser: any, adminUser?: any) => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('adminLoggedIn', 'true')
    window.localStorage.setItem(
      'adminUser',
      JSON.stringify({
        email: sessionUser.email,
        name: adminUser?.name || sessionUser.user_metadata?.full_name || '관리자',
        photoURL: sessionUser.user_metadata?.avatar_url || null,
        uid: sessionUser.id,
        role: adminUser?.role ?? null,
        loginTime: new Date().toISOString()
      })
    )
    window.dispatchEvent(new Event('admin-auth-changed'))
  }

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          return
        }

        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('name, role')
          .eq('id', data.session.user.id)
          .single<AdminUserData>()

        if (adminError || !adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin')) {
          await supabase.auth.signOut()
          return
        }

        setAdminState(data.session.user, adminUser)
        if (router.asPath !== onSuccessRedirect) {
          await router.replace(onSuccessRedirect)
        }
      } catch (sessionError) {
        console.error('Session restore failed:', sessionError)
      }
    }

    restoreSession()
  }, [router, onSuccessRedirect, supabase])

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError || !data.session) {
        setError(signInError?.message || '로그인에 실패했습니다. 다시 시도해주세요.')
        return
      }

      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('name, role')
        .eq('id', data.session.user.id)
        .single<AdminUserData>()

      if (adminError || !adminUser || adminUser.role !== 'admin') {
        await supabase.auth.signOut()
        setError('관리자 권한이 없는 계정입니다.')
        return
      }

      setAdminState(data.session.user, adminUser)
      await router.replace(onSuccessRedirect)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError('')

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      })

      if (oauthError) {
        console.error('Google login error:', oauthError)
        setError(oauthError.message)
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-16 h-16 rounded-sm flex items-center justify-center mb-4"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          >
            <Lock className="w-8 h-8" style={{ color: 'oklch(0.72 0.10 75)' }} />
          </div>
          <h2
            className="font-headline font-bold text-2xl"
            style={{ color: 'oklch(0.98 0.003 75)' }}
          >
            관리자 로그인
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: 'oklch(0.60 0.01 75)' }}
          >
            교회 웹사이트 관리 시스템에 접속하세요
          </p>
        </div>
      )}

      <div
        className={`py-8 px-6 rounded-sm ${cardClassName}`.trim()}
        style={{
          background: 'oklch(0.20 0.04 265)',
          border: '1px solid oklch(0.30 0.06 265)',
        }}
      >
        {/* Google Login Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            style={{
              background: 'oklch(0.98 0.003 75)',
              color: 'oklch(0.25 0.02 75)',
            }}
          >
            {isGoogleLoading ? (
              <>
                <div
                  className="animate-spin rounded-full h-5 w-5 mr-2"
                  style={{ border: '2px solid oklch(0.45 0.12 265)', borderTopColor: 'transparent' }}
                />
                <span className="font-medium">Google 로그인 중...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Google 계정으로 로그인</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div
              className="w-full h-px"
              style={{ background: 'oklch(0.35 0.05 265)' }}
            />
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className="px-3"
              style={{
                background: 'oklch(0.20 0.04 265)',
                color: 'oklch(0.55 0.01 75)',
              }}
            >
              또는 이메일로 로그인
            </span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleEmailLogin}>
          {error && (
            <div
              className="rounded-sm p-4"
              style={{
                background: 'oklch(0.35 0.12 25 / 0.2)',
                border: '1px solid oklch(0.50 0.15 25)',
              }}
            >
              <p
                className="text-sm"
                style={{ color: 'oklch(0.75 0.12 25)' }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium mb-2"
              style={{ color: 'oklch(0.80 0.01 75)' }}
            >
              이메일 주소
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5" style={{ color: 'oklch(0.50 0.01 75)' }} />
              </div>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: 'oklch(0.15 0.04 265)',
                  border: '1px solid oklch(0.30 0.06 265)',
                  color: 'oklch(0.98 0.003 75)',
                }}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium mb-2"
              style={{ color: 'oklch(0.80 0.01 75)' }}
            >
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" style={{ color: 'oklch(0.50 0.01 75)' }} />
              </div>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: 'oklch(0.15 0.04 265)',
                  border: '1px solid oklch(0.30 0.06 265)',
                  color: 'oklch(0.98 0.003 75)',
                }}
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                style={{ color: 'oklch(0.50 0.01 75)' }}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'oklch(0.72 0.10 75)',
              color: 'oklch(0.15 0.05 265)',
            }}
          >
            {isLoading ? (
              <>
                <div
                  className="animate-spin rounded-full h-5 w-5 mr-2"
                  style={{ border: '2px solid oklch(0.15 0.05 265)', borderTopColor: 'transparent' }}
                />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginForm
