// ===========================================
// VS Design Diverge: Education/Training Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { useEffect, useState } from 'react'
import { FolderOpen, FileText, Download, Info, CheckCircle } from 'lucide-react'

type Resource = {
  id: number
  title: string
  category: string
  description: string
  fileName: string
  uploadedAt: string
  link?: string
}

const fallbackResources: Resource[] = [
  {
    id: 1,
    title: '2024년 봄학기 새가족 양육 교재',
    category: '새가족',
    description: '13주 과정으로 구성된 새가족 양육 교재 PDF입니다. 지도자를 위한 나눔 질문이 포함되어 있습니다.',
    fileName: 'new-member-spring-2024.pdf',
    uploadedAt: '2024-02-15T09:00:00.000Z'
  },
  {
    id: 2,
    title: '중보기도 세미나 강의안',
    category: '훈련',
    description: '기도 사역팀을 위한 세미나 강의 슬라이드와 워크북 자료입니다.',
    fileName: 'intercessory-prayer-workshop.pptx',
    uploadedAt: '2023-11-03T09:00:00.000Z'
  },
  {
    id: 3,
    title: '초등부 겨울 성경학교 활동지 모음',
    category: '양육',
    description: '초등부 겨울 성경학교에 활용할 수 있는 활동지와 만들기 자료가 포함된 묶음 파일입니다.',
    fileName: 'kids-winter-vbs-activity.zip',
    uploadedAt: '2023-12-10T09:00:00.000Z'
  }
]

const sortResourcesByDateDesc = (items: Resource[]) =>
  [...items].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

const infoHighlights = [
  {
    key: 'centralized',
    icon: FolderOpen,
    title: '중앙 관리',
    description: '관리자 시스템에서 등록된 자료가 이곳에 자동으로 반영됩니다.'
  },
  {
    key: 'formats',
    icon: FileText,
    title: '다양한 형식',
    description: '예배 순서지부터 제자훈련 교재까지 다양한 형식의 자료를 제공합니다.'
  },
  {
    key: 'verified',
    icon: CheckCircle,
    title: '검수 완료',
    description: '담당 목회자의 검토를 거친 자료만 공개되어 신뢰할 수 있습니다.'
  }
]

type SyncState = 'idle' | 'error'

const formatDate = (isoString: string) => {
  const date = new Date(isoString)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const EducationTraining: NextPage = () => {
  const [resources, setResources] = useState<Resource[]>(sortResourcesByDateDesc(fallbackResources))
  const [syncState, setSyncState] = useState<SyncState>('idle')

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/admin/education-resources')

        if (!response.ok) {
          throw new Error('Failed to sync with admin system')
        }

        const data = await response.json()

        if (Array.isArray(data?.resources)) {
          setResources(sortResourcesByDateDesc(data.resources as Resource[]))
        }
      } catch {
        setSyncState('error')
      }
    }

    fetchResources()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="교육/훈련"
        subtitle="필요한 교육자료를 한 번에 확인하고, 사역 현장에서 바로 활용하세요"
        label="교육부서"
      />

      {/* Quick Info */}
      <section style={{ background: 'oklch(0.985 0.003 75)', borderBottom: '1px solid oklch(0.92 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
            <div className="flex items-center" style={{ color: 'oklch(0.45 0.03 265)' }}>
              <FolderOpen className="w-5 h-5 mr-2" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <span>관리자 시스템 연동</span>
            </div>
            <div className="flex items-center" style={{ color: 'oklch(0.45 0.03 265)' }}>
              <FileText className="w-5 h-5 mr-2" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <span>최신 교육자료 제공</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
            ※ 자료 업로드는 관리자 시스템에서 처리되며, 검토가 완료되면 자동으로 반영됩니다.
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              교육/훈련 자료
            </h2>
            <p style={{ color: 'oklch(0.55 0.01 75)' }}>
              최신 순으로 정리된 문서를 내려받아 곧바로 활용해 보세요.
            </p>
            {syncState === 'error' && (
              <div
                className="mt-6 inline-block rounded-sm px-4 py-3 text-sm"
                style={{
                  background: 'oklch(0.92 0.05 85)',
                  border: '1px solid oklch(0.85 0.08 85)',
                  color: 'oklch(0.40 0.08 85)'
                }}
              >
                관리자 시스템과의 연동이 일시적으로 원활하지 않아 기본 자료를 표시하고 있습니다.
              </div>
            )}
          </div>

          {resources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex flex-col justify-between rounded-sm p-6"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-xs font-medium tracking-[0.1em] uppercase"
                        style={{ color: 'oklch(0.72 0.10 75)' }}
                      >
                        {resource.category}
                      </span>
                      <span className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {formatDate(resource.uploadedAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-3" style={{ fontSize: '1.125rem', color: 'oklch(0.25 0.05 265)' }}>
                      {resource.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {resource.description || '설명 없이 업로드된 자료입니다.'}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>파일: {resource.fileName}</div>
                    <div className="flex items-center gap-2">
                      {resource.link ? (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 rounded-sm text-sm font-medium transition-all duration-300 hover:translate-y-[-2px]"
                          style={{
                            background: 'oklch(0.45 0.12 265)',
                            color: 'oklch(0.98 0.003 75)',
                            boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.15)'
                          }}
                        >
                          자료 보기
                          <Download className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <span className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>관리자 검토 후 공개됩니다.</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 rounded-sm"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px dashed oklch(0.85 0.01 75)'
              }}
            >
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'oklch(0.75 0.02 75)' }} />
              <h3 className="font-medium mb-2" style={{ color: 'oklch(0.25 0.05 265)' }}>등록된 자료가 없습니다</h3>
              <p style={{ color: 'oklch(0.55 0.01 75)' }}>관리자 시스템에서 자료를 등록하면 이곳에서 확인할 수 있습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Highlights */}
      <section style={{ background: 'oklch(0.985 0.003 75)', borderTop: '1px solid oklch(0.92 0.005 75)', borderBottom: '1px solid oklch(0.92 0.005 75)' }}>
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoHighlights.map(({ key, icon: Icon, title, description }) => (
              <div
                key={key}
                className="flex flex-col rounded-sm p-6"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 mr-3" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <h3 className="font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>{title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ background: 'oklch(0.20 0.07 265)' }}>
        <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Info className="w-6 h-6 mr-3" style={{ color: 'oklch(0.72 0.10 75)' }} />
                <h2 className="font-headline font-bold" style={{ fontSize: '1.5rem', color: 'oklch(0.98 0.003 75)' }}>
                  자료 운영 안내
                </h2>
              </div>
              <ul className="space-y-2 text-sm" style={{ color: 'oklch(0.80 0.02 75)' }}>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                  <span>목회자용 관리자 시스템에서 자료가 등록되면 자동으로 반영됩니다.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                  <span>수정/삭제는 관리자 시스템에서 처리되며 즉시 업데이트됩니다.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                  <span>자료 이용 중 문제가 발생하면 아래 연락처로 문의해주세요.</span>
                </li>
              </ul>
            </div>
            <div
              className="rounded-sm p-6 w-full md:w-80"
              style={{
                background: 'oklch(0.98 0.003 75)',
                boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.15)'
              }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'oklch(0.25 0.05 265)' }}>자료 문의</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'oklch(0.55 0.01 75)' }}>
                자료 업로드와 관련한 문의 사항은 교육부 행정 담당자에게 연락해주세요.
              </p>
              <div className="space-y-2 text-sm" style={{ color: 'oklch(0.45 0.03 265)' }}>
                <div>이메일: KyuHongYeon@gmail.com</div>
                <div>전화: (814) 380-9393</div>
              </div>
            </div>
          </div>
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

export default EducationTraining
