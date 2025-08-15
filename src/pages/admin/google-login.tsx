import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { auth } from '../../../lib/firebase'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user)
        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminUser', JSON.stringify({
          email: user.email,
          name: user.displayName || '관리자',
          photoURL: user.photoURL,
          uid: user.uid,
          loginTime: new Date().toISOString()
        }))
        router.push('/admin/dashboard')
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Email login successful:', userCredential.user.email)
    } catch (error: any) {
      console.error('Email login error:', error)
      
      // Fallback to local accounts if Firebase fails
      const localAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]')
      const defaultAccounts = [
        { email: 'newhosung@gmail.com', password: 'admin123!', name: '관리자' },
        { email: 'admin@sckc.org', password: 'sckc2025!', name: '관리자' }
      ]
      
      const allAccounts = [...defaultAccounts, ...localAccounts]
      const foundAccount = allAccounts.find(acc => acc.email === email && acc.password === password)
      
      if (foundAccount) {
        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminUser', JSON.stringify({
          email: foundAccount.email,
          name: foundAccount.name,
          loginTime: new Date().toISOString()
        }))
        router.push('/admin/dashboard')
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      console.log('Google login successful:', result.user.email)
      
      // Check if user is authorized admin
      const authorizedEmails = ['newhosung@gmail.com', 'admin@sckc.org']
      if (!authorizedEmails.includes(result.user.email || '')) {
        await signOut(auth)
        setError('권한이 없는 계정입니다. 관리자 계정으로 로그인해주세요.')
        return
      }
      
    } catch (error: any) {
      console.error('Google login error:', error)
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('로그인이 취소되었습니다.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.')
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('인증 도메인 설정 오류입니다. Firebase Console에서 도메인을 추가해주세요.')
      } else {
        setError(`로그인 실패: ${error.message}`)
      }
    } finally {
      setIsGoogleLoading(false)
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
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600 font-korean">{error}</p>
              </div>
            )}

            {/* Google Login Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                {isGoogleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-2"></div>
                    <span className="font-korean">Google 로그인 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-korean">Google 계정으로 로그인</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-korean">또는</span>
              </div>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleEmailLogin}>
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
                    '이메일로 로그인'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-korean font-semibold">
                  ✅ Google 로그인 설정 확인사항:
                </p>
                <ul className="mt-2 text-sm text-blue-700 font-korean space-y-1">
                  <li>• Firebase Console에서 Google 인증 활성화</li>
                  <li>• 승인된 도메인에 localhost:3001 및 korean-church-website.vercel.app 추가</li>
                  <li>• OAuth 2.0 클라이언트 ID 설정</li>
                  <li>• 관리자 이메일: newhosung@gmail.com</li>
                </ul>
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