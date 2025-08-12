import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../../lib/firebase'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 임시 관리자 계정 체크
    if (email === 'newhosung@gmail.com' && password === 'admin123!') {
      localStorage.setItem('adminLoggedIn', 'true')
      router.push('/admin/dashboard')
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('로그인 오류:', error)
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      console.log('🔍 Google 로그인 시도 중...')
      console.log('🔍 Auth domain:', auth.app.options.authDomain)
      console.log('🔍 Project ID:', auth.app.options.projectId)
      
      const result = await signInWithPopup(auth, provider)
      console.log('✅ Google 로그인 성공:', result.user.email)
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('❌ Google 로그인 상세 오류:', {
        code: error.code,
        message: error.message,
        details: error
      })
      
      let errorMessage = 'Google 로그인 중 오류가 발생했습니다.'
      if (error.code === 'auth/popup-blocked') {
        errorMessage = '팝업이 차단되었습니다. 팝업 차단기를 해제해주세요.'
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = '도메인이 인증되지 않았습니다.'
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google 로그인이 비활성화되어 있습니다.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 font-korean">
            관리자 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-korean">
            교회 웹사이트 관리 시스템에 접속하세요
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-korean">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-korean">
                  이메일 주소
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm font-korean"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-korean">
                  비밀번호
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm font-korean"
                    placeholder="비밀번호를 입력하세요"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 transition-colors font-korean"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      로그인 중...
                    </>
                  ) : (
                    '로그인'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-korean">또는</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-korean">
                    💡 Google 로그인은 현재 설정 중입니다. 아래 임시 계정을 사용해주세요.
                  </p>
                  <div className="mt-2 text-sm text-yellow-700 font-korean">
                    <p><strong>이메일:</strong> newhosung@gmail.com</p>
                    <p><strong>비밀번호:</strong> admin123!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-korean">보안 안내</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600 font-korean">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <p>관리자 계정만 접근할 수 있습니다.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <p>로그인 정보는 안전하게 암호화됩니다.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <p>문제가 있으시면 담당자에게 연락하세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default AdminLoginPage