import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useEffect, useRef, useState } from 'react'
import { Upload, FolderOpen, FileText, CheckCircle, Info, Download, Trash2 } from 'lucide-react'

type Resource = {
  id: number
  title: string
  category: string
  description: string
  fileName: string
  uploadedAt: string
  link?: string
  isLocal?: boolean
}

const categoryOptions = ['예배자료', '새가족', '양육', '훈련', '소그룹', '기타']

const initialResources: Resource[] = [
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

type MessageState = {
  type: 'success' | 'error' | null
  text: string
}

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
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [newResource, setNewResource] = useState({
    title: '',
    category: categoryOptions[0],
    description: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' })
  const objectUrlsRef = useRef<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const infoHighlights = [
    {
      key: 'upload',
      icon: Upload,
      title: '간편 업로드',
      description: '파일과 간단한 설명만 입력하면 자료가 임시로 추가됩니다.'
    },
    {
      key: 'archive',
      icon: FolderOpen,
      title: '한눈에 정리',
      description: '예배, 양육, 훈련 등 분야별로 자료를 정리하여 공유합니다.'
    },
    {
      key: 'review',
      icon: CheckCircle,
      title: '관리자 검토',
      description: '업로드된 자료는 담당자의 검토 후 전체 공개됩니다.'
    }
  ]

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!newResource.title.trim()) {
      setMessage({ type: 'error', text: '자료 제목을 입력해주세요.' })
      return
    }

    if (!selectedFile) {
      setMessage({ type: 'error', text: '업로드할 파일을 선택해주세요.' })
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    objectUrlsRef.current.push(objectUrl)

    const resource: Resource = {
      id: Date.now(),
      title: newResource.title.trim(),
      category: newResource.category,
      description: newResource.description.trim(),
      fileName: selectedFile.name,
      uploadedAt: new Date().toISOString(),
      link: objectUrl,
      isLocal: true
    }

    setResources((prev) => [resource, ...prev])
    setNewResource({ title: '', category: categoryOptions[0], description: '' })
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setMessage({ type: 'success', text: '자료가 임시로 추가되었습니다. 관리자 검토 후 게시됩니다.' })
  }

  const handleRemoveResource = (id: number) => {
    setResources((prev) => {
      const target = prev.find((item) => item.id === id)

      if (target?.isLocal && target.link) {
        objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== target.link)
        URL.revokeObjectURL(target.link)
      }

      return prev.filter((item) => item.id !== id)
    })
  }

  return (
    <Layout>
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-korean">교육자료 센터</h1>
            <p className="text-xl text-gray-600 mb-8 font-korean">
              교회 교육과 훈련에 필요한 자료를 한 곳에서 관리하고 공유하세요
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <FolderOpen className="w-5 h-5 mr-2" />
                <span className="font-korean">분야별 자료 보관</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                <span className="font-korean">교사용/학생용 템플릿</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-korean">검토 후 공유</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoHighlights.map(({ key, icon: Icon, title, description }) => (
              <div key={key} className="flex flex-col border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 text-gray-900 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 font-korean">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 font-korean leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <Upload className="w-6 h-6 text-gray-900 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 font-korean">교육자료 업로드</h2>
            </div>
            <p className="text-gray-600 mb-6 font-korean leading-relaxed">
              아래 양식을 작성하고 파일을 첨부하면 자료가 센터에 임시 등록됩니다. 담당자가 검토한 후 전체 공개 여부를 결정합니다.
            </p>

            {message.type && (
              <div
                className={`mb-6 rounded-md px-4 py-3 text-sm font-korean ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-korean" htmlFor="resource-title">
                  자료 제목
                </label>
                <input
                  id="resource-title"
                  type="text"
                  value={newResource.title}
                  onChange={(event) => setNewResource((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-korean"
                  placeholder="예: 제자훈련 1과 강의안"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-korean" htmlFor="resource-category">
                    분류
                  </label>
                  <select
                    id="resource-category"
                    value={newResource.category}
                    onChange={(event) => setNewResource((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-korean"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-korean" htmlFor="resource-file">
                    파일 첨부
                  </label>
                  <input
                    id="resource-file"
                    ref={fileInputRef}
                    type="file"
                    className="w-full border border-dashed border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-600"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  />
                  <p className="mt-2 text-xs text-gray-500 font-korean">
                    PDF, PPT, DOC, ZIP 등 최대 25MB까지 업로드할 수 있습니다.
                  </p>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600 font-korean">선택된 파일: {selectedFile.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-korean" htmlFor="resource-description">
                  자료 설명
                </label>
                <textarea
                  id="resource-description"
                  value={newResource.description}
                  onChange={(event) => setNewResource((prev) => ({ ...prev, description: event.target.value }))}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-korean"
                  placeholder="자료 활용 방법, 대상, 구성 등을 간단히 소개해주세요."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-500 font-korean">
                  ※ 업로드된 자료는 담당자 확인 후 게시되며 필요 시 내용 수정이 요청될 수 있습니다.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors font-korean"
                >
                  자료 업로드
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-korean">공유된 교육자료</h2>
            <p className="text-lg text-gray-600 font-korean">최근 업로드된 자료부터 확인하실 수 있습니다.</p>
          </div>

          {resources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {resources.map((resource) => (
                <div key={resource.id} className="flex flex-col justify-between bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600 font-korean">{resource.category}</span>
                      <span className="text-xs text-gray-400 font-korean">{formatDate(resource.uploadedAt)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 font-korean">{resource.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-korean">
                      {resource.description || '설명 없이 업로드된 자료입니다.'}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-500 font-korean">파일: {resource.fileName}</div>
                    <div className="flex items-center gap-2">
                      {resource.link ? (
                        <a
                          href={resource.link}
                          target={resource.isLocal ? '_self' : '_blank'}
                          rel={resource.isLocal ? undefined : 'noopener noreferrer'}
                          download={resource.isLocal ? resource.fileName : undefined}
                          className="inline-flex items-center bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors font-korean"
                        >
                          자료 보기
                          <Download className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400 font-korean">관리자 승인 후 열람 가능</span>
                      )}

                      {resource.isLocal && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResource(resource.id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-korean">등록된 자료가 없습니다</h3>
              <p className="text-gray-500 font-korean">첫 번째 교육자료를 업로드해보세요.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Info className="w-6 h-6 mr-3" />
                <h2 className="text-2xl font-bold font-korean">자료 운영 안내</h2>
              </div>
              <ul className="space-y-2 text-sm opacity-90 font-korean">
                <li>• 교육부/훈련부 담당자가 자료의 적합성을 확인한 뒤 게시됩니다.</li>
                <li>• 저작권이 있는 자료는 사전 사용 허락을 받은 경우에만 업로드해주세요.</li>
                <li>• 대용량 파일은 구글 드라이브 등 외부 링크를 첨부해주시면 도움이 됩니다.</li>
              </ul>
            </div>
            <div className="bg-white text-gray-900 rounded-lg p-6 shadow-sm w-full md:w-80">
              <h3 className="text-lg font-semibold mb-3 font-korean">자료 문의</h3>
              <p className="text-sm text-gray-600 mb-4 font-korean leading-relaxed">
                자료 업로드와 관련한 문의 사항은 교육부 행정 담당자에게 연락해주세요.
              </p>
              <div className="space-y-2 text-sm text-gray-700 font-korean">
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
