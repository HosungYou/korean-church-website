import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ArrowLeft,
  Save,
  Loader2,
  Video,
  Calendar,
  User,
  Book,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  createSermon,
  extractYouTubeVideoId,
  getYouTubeThumbnailUrl,
  type SermonType
} from '../../../utils/sermonService'
import type { SermonInsert } from '../../../../types/supabase'

const NewSermonPage = () => {
  const router = useRouter()
  const { admin, loading } = useAdminAuth()
  const [saving, setSaving] = useState(false)
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<SermonInsert>>({
    title: '',
    speaker: '',
    scripture: '',
    sermon_date: new Date().toISOString().split('T')[0],
    sermon_type: 'sunday',
    youtube_url: '',
    description: '',
    series_name: '',
    status: 'draft',
    is_featured: false
  })

  const handleYoutubeUrlChange = (url: string) => {
    setFormData({ ...formData, youtube_url: url })
    const videoId = extractYouTubeVideoId(url)
    if (videoId) {
      setYoutubePreview(getYouTubeThumbnailUrl(videoId, 'hq'))
    } else {
      setYoutubePreview(null)
    }
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title?.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    if (!formData.sermon_date) {
      alert('설교 날짜를 선택해주세요.')
      return
    }

    try {
      setSaving(true)
      await createSermon({
        ...formData,
        status,
        title: formData.title!.trim(),
        sermon_date: formData.sermon_date!,
        sermon_type: formData.sermon_type as SermonType
      } as SermonInsert)

      alert(status === 'published' ? '설교가 게시되었습니다.' : '설교가 저장되었습니다.')
      router.push('/admin/sermons')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
        </div>
      </Layout>
    )
  }

  if (!admin) return null

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin/sermons" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">새 설교 등록</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmit('draft')}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="font-korean">임시저장</span>
                </button>
                <button
                  onClick={() => handleSubmit('published')}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="font-korean">게시하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 font-korean mb-4">기본 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      <FileText className="w-4 h-4 inline mr-1" />
                      제목 *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="설교 제목을 입력하세요"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      설교자
                    </label>
                    <input
                      type="text"
                      value={formData.speaker || ''}
                      onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                      placeholder="설교자 이름"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      <Book className="w-4 h-4 inline mr-1" />
                      성경 본문
                    </label>
                    <input
                      type="text"
                      value={formData.scripture || ''}
                      onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                      placeholder="예: 요한복음 3:16"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      설교 날짜 *
                    </label>
                    <input
                      type="date"
                      value={formData.sermon_date || ''}
                      onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      설교 유형 *
                    </label>
                    <select
                      value={formData.sermon_type || 'sunday'}
                      onChange={(e) => setFormData({ ...formData, sermon_type: e.target.value as SermonType })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    >
                      <option value="sunday">주일설교</option>
                      <option value="wednesday">수요설교</option>
                      <option value="friday">금요기도회</option>
                      <option value="special">특별집회</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      시리즈명
                    </label>
                    <input
                      type="text"
                      value={formData.series_name || ''}
                      onChange={(e) => setFormData({ ...formData, series_name: e.target.value })}
                      placeholder="예: 요한복음 강해"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured || false}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700 font-korean">
                      추천 설교로 지정
                    </label>
                  </div>
                </div>
              </div>

              {/* YouTube URL */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 font-korean mb-4">
                  <Video className="w-5 h-5 inline mr-2" />
                  YouTube 영상
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={formData.youtube_url || ''}
                    onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    YouTube URL을 입력하면 자동으로 Video ID가 추출됩니다.
                  </p>
                </div>

                {/* 미리보기 */}
                {youtubePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 font-korean mb-2">미리보기</p>
                    <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={youtubePreview}
                        alt="YouTube 썸네일"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                  설교 설명
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="설교에 대한 간략한 설명을 입력하세요"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                />
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

export default NewSermonPage
