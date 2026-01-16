import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AdminLoginForm from '@/components/AdminLoginForm'
import { Church } from 'lucide-react'
import Link from 'next/link'

// ===========================================
// VS Design Diverge: Admin Login Page
// Deep Indigo + Gold Accent + Grain Texture
// ===========================================

const AdminLoginPage: NextPage = () => {
  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'oklch(0.15 0.05 265)' }}
    >
      {/* Grain texture overlay */}
      <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />

      {/* Decorative gradient */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, oklch(0.72 0.10 75 / 0.15), transparent 60%)',
        }}
      />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="max-w-md">
          {/* Gold accent line */}
          <div
            className="h-0.5 w-16 mb-8"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), transparent)',
            }}
          />

          <h1
            className="font-headline font-black mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              letterSpacing: '-0.03em',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            State College
            <br />
            Korean Church
          </h1>

          <p
            className="text-lg leading-relaxed mb-8"
            style={{ color: 'oklch(0.70 0.01 75)' }}
          >
            관리자 시스템에 로그인하여
            <br />
            교회 웹사이트를 관리하세요.
          </p>

          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium transition-all duration-300 hover:translate-x-1"
            style={{ color: 'oklch(0.72 0.10 75)' }}
          >
            ← 사이트로 돌아가기
          </Link>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center mb-4"
              style={{ background: 'oklch(0.72 0.10 75)' }}
            >
              <Church className="w-8 h-8" style={{ color: 'oklch(0.15 0.05 265)' }} />
            </div>
            <h1
              className="font-headline font-bold text-xl text-center"
              style={{ color: 'oklch(0.98 0.003 75)' }}
            >
              SCKC Admin
            </h1>
          </div>

          <AdminLoginForm
            showHeader={true}
            className=""
            cardClassName=""
            onSuccessRedirect="/admin/dashboard"
          />

          {/* Mobile back link */}
          <div className="lg:hidden mt-8 text-center">
            <Link
              href="/"
              className="text-sm font-medium transition-colors"
              style={{ color: 'oklch(0.60 0.01 75)' }}
            >
              ← 사이트로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminLoginPage
