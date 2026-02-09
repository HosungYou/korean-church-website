// ===========================================
// VS Design Diverge: Missionary Support Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { Globe } from 'lucide-react'

const MissionarySupportPage: NextPage = () => {
  const { i18n } = useTranslation('common')
  const isKorean = i18n.language === 'ko'

  return (
    <Layout>
      <PageHeader
        label={isKorean ? '선교' : 'Missions'}
        title={isKorean ? '선교사 지원' : 'Missionary Support'}
        subtitle={isKorean
          ? '세계 각지에서 복음을 전하는 선교사들을 후원하고 섬깁니다'
          : 'Supporting and serving missionaries spreading the Gospel around the world'
        }
      />

      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-3xl mx-auto py-32 px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          >
            <Globe className="w-10 h-10" style={{ color: 'oklch(0.98 0.003 75)' }} />
          </div>

          <div className="h-0.5 w-12 mb-8 mx-auto" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />

          <h2
            className="font-headline font-bold mb-6"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              letterSpacing: '-0.02em',
              color: 'oklch(0.25 0.05 265)',
            }}
          >
            Coming Soon
          </h2>

          <p className="leading-relaxed mb-4" style={{ color: 'oklch(0.55 0.01 75)', fontSize: '1.125rem' }}>
            {isKorean
              ? '선교사 지원 페이지가 곧 새롭게 준비됩니다.'
              : 'The Missionary Support page is being prepared and will be available soon.'}
          </p>
          <p className="leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
            {isKorean
              ? '문의사항은 교회 사무실로 연락해 주세요.'
              : 'For inquiries, please contact the church office.'}
          </p>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default MissionarySupportPage
