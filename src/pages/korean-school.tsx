// ===========================================
// VS Design Diverge: Korean School Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GraduationCap } from 'lucide-react'

const KoreanSchool: NextPage = () => {
  const { t, i18n } = useTranslation('common')
  const isKorean = i18n.language === 'ko'

  return (
    <Layout>
      <PageHeader
        label={isKorean ? '교육' : 'Education'}
        title={isKorean ? '한국학교' : 'Korean School'}
        subtitle={isKorean
          ? '차세대가 한국어와 한국 문화를 배우며 정체성을 확립할 수 있도록 돕는 교육기관입니다'
          : 'An educational institution helping the next generation learn Korean language and culture while establishing their identity'
        }
      />

      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-3xl mx-auto py-32 px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          >
            <GraduationCap className="w-10 h-10" style={{ color: 'oklch(0.98 0.003 75)' }} />
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
              ? '한국학교 페이지가 곧 새롭게 준비됩니다.'
              : 'The Korean School page is being prepared and will be available soon.'}
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

export default KoreanSchool
