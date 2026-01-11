import { useEffect, useState, useRef } from 'react'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Trash2,
  ArrowLeft,
  FileText,
  Loader2,
  Calendar,
  Download,
  Upload,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getBulletins,
  createBulletin,
  deleteBulletin,
  uploadBulletinPDF
} from '../../../utils/bulletinService'
import type { Bulletin, BulletinInsert } from '../../../../types/supabase'

const formatKoreanDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const AdminBulletinsPage = () => {
  const { admin, loading } = useAdminAuth()
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    bulletin_date: new Date().toISOString().split('T')[0],
    file_url: ''
  })

  useEffect(() => {
    if (!admin) return
    fetchBulletins()
  }, [admin])

  const fetchBulletins = async () => {
    try {
      setListLoading(true)
      const data = await getBulletins({ limit: 50 })
      setBulletins(data)
    } catch (error) {
      console.error('주보 조회 오류:', error)
    } finally {
      setListLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf')) {
      alert('PDF 파일만 업로드 가능합니다.')
      return
    }

    try {
      setUploading(true)
      const url = await uploadBulletinPDF(file, formData.bulletin_date)
      setFormData({ ...formData, file_url: url })
    } catch (error) {
      console.error('파일 업로드 오류:', error)
      alert('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    if (!formData.file_url) {
      alert('PDF 파일을 업로드해주세요.')
      return
    }

    try {
      setUploading(true)
      const newBulletin = await createBulletin(formData as BulletinInsert)
      setBulletins((prev) => [newBulletin, ...prev])
      setShowForm(false)
      setFormData({
        title: '',
        bulletin_date: new Date().toISOString().split('T')[0],
        file_url: ''
      })
      alert('주보가 등록되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 주보를 삭제하시겠습니까?')) return

    try {
      await deleteBulletin(id)
      setBulletins((prev) => prev.filter((b) => b.id !== id))
      alert('주보가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
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
                <Link href="/admin/dashboard" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">주보 관리</h1>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-korean">주보 업로드</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 업로드 폼 */}
            {showForm && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 font-korean mb-4">새 주보 업로드</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                        제목 *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="예: 2024년 1월 첫째주 주보"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        주보 날짜 *
                      </label>
                      <input
                        type="date"
                        value={formData.bulletin_date}
                        onChange={(e) => setFormData({ ...formData, bulletin_date: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      PDF 파일 *
                    </label>
                    {formData.file_url ? (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-8 h-8 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm text-green-800 font-korean">파일이 업로드되었습니다</p>
                          <a
                            href={formData.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:underline"
                          >
                            미리보기
                          </a>
                        </div>
                        <button
                          onClick={() => setFormData({ ...formData, file_url: '' })}
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 font-korean">PDF 파일 선택</span>
                          </>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowForm(false)
                        setFormData({
                          title: '',
                          bulletin_date: new Date().toISOString().split('T')[0],
                          file_url: ''
                        })
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 font-korean"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={uploading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:opacity-50 font-korean"
                    >
                      등록하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 주보 목록 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 font-korean">
                  <FileText className="w-5 h-5 inline mr-2" />
                  주보 목록 ({bulletins.length}개)
                </h2>
              </div>

              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : bulletins.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>등록된 주보가 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {bulletins.map((bulletin) => (
                    <div key={bulletin.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 font-korean">{bulletin.title}</h3>
                          <p className="text-sm text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {formatKoreanDate(bulletin.bulletin_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={bulletin.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                          title="보기"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={bulletin.file_url}
                          download
                          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                          title="다운로드"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(bulletin.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default AdminBulletinsPage
