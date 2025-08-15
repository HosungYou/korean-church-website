import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { auth } from '../../../lib/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const TestAuthPage = () => {
  const [diagnostics, setDiagnostics] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {}

      // 1. Check Firebase Config
      results.firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
      }

      // 2. Check Auth Instance
      results.authInstance = auth ? '✅ Initialized' : '❌ Failed'

      // 3. Check Google Provider
      try {
        const provider = new GoogleAuthProvider()
        results.googleProvider = '✅ Available'
      } catch (error) {
        results.googleProvider = '❌ Error: ' + error
      }

      // 4. Check Current Domain
      results.currentDomain = window.location.hostname
      results.currentPort = window.location.port || '443'
      results.currentProtocol = window.location.protocol

      // 5. Check Browser Features
      results.popupsEnabled = !window.opener ? '⚠️ May be blocked' : '✅ Enabled'
      results.cookiesEnabled = navigator.cookieEnabled ? '✅ Enabled' : '❌ Disabled'
      results.javascriptEnabled = '✅ Enabled'

      // 6. API Key Length Check
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
      results.apiKeyLength = `${apiKey.length} characters`
      results.apiKeyValid = apiKey.length === 39 ? '✅ Valid length' : `❌ Invalid (should be 39)`

      // 7. Auth Domain Check
      const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''
      results.authDomainFormat = authDomain.includes('firebaseapp.com') ? '✅ Valid format' : '❌ Invalid format'

      setDiagnostics(results)
      setIsLoading(false)
    }

    runDiagnostics()
  }, [])

  const testGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      // This will trigger the actual popup
      await signInWithPopup(auth, provider)
      alert('✅ Google login successful!')
    } catch (error: any) {
      alert(`❌ Error: ${error.code} - ${error.message}`)
      console.error('Full error:', error)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Firebase Auth Diagnostics</h1>
          
          {isLoading ? (
            <div className="text-center">Loading diagnostics...</div>
          ) : (
            <div className="space-y-6">
              {/* Firebase Configuration */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">1. Firebase Configuration</h2>
                <div className="space-y-2">
                  {Object.entries(diagnostics.firebaseConfig || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-mono text-sm">{key}:</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auth Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">2. Authentication Status</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Auth Instance:</span>
                    <span>{diagnostics.authInstance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Google Provider:</span>
                    <span>{diagnostics.googleProvider}</span>
                  </div>
                </div>
              </div>

              {/* Environment */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">3. Current Environment</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Domain:</span>
                    <span className="font-mono">{diagnostics.currentDomain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Port:</span>
                    <span className="font-mono">{diagnostics.currentPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protocol:</span>
                    <span className="font-mono">{diagnostics.currentProtocol}</span>
                  </div>
                </div>
              </div>

              {/* Browser Features */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">4. Browser Features</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Popups:</span>
                    <span>{diagnostics.popupsEnabled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cookies:</span>
                    <span>{diagnostics.cookiesEnabled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>JavaScript:</span>
                    <span>{diagnostics.javascriptEnabled}</span>
                  </div>
                </div>
              </div>

              {/* API Key Validation */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">5. API Key Validation</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>API Key Length:</span>
                    <span>{diagnostics.apiKeyLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validation:</span>
                    <span>{diagnostics.apiKeyValid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auth Domain Format:</span>
                    <span>{diagnostics.authDomainFormat}</span>
                  </div>
                </div>
              </div>

              {/* Test Button */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">6. Live Test</h2>
                <button
                  onClick={testGoogleLogin}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Google Login Popup
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  Click to test the actual Google login flow. Check console for detailed errors.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">⚠️ Required Actions</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Go to <a href="https://console.firebase.google.com/project/sckc-54d97/authentication/providers" target="_blank" className="text-blue-600 underline">Firebase Console</a></li>
                  <li>Enable Google Sign-in method</li>
                  <li>Add authorized domains: localhost:3001, korean-church-website.vercel.app</li>
                  <li>Check OAuth consent screen configuration</li>
                  <li>Verify API restrictions in Google Cloud Console</li>
                </ol>
              </div>
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

export default TestAuthPage