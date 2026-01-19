import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// 헌금 안내 페이지 → 예배 안내 #giving 섹션으로 리다이렉트
const GivingRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/about/service-info#giving')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.985 0.003 75)' }}>
      <div className="text-center">
        <div
          className="w-12 h-12 mx-auto rounded-sm animate-pulse mb-4"
          style={{ background: 'oklch(0.45 0.12 265)' }}
        />
        <p style={{ color: 'oklch(0.55 0.01 75)' }}>
          헌금 안내 페이지로 이동 중...
        </p>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default GivingRedirect
