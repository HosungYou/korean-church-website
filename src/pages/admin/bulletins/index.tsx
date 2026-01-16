import { useEffect, useState, useRef } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Trash2,
  FileText,
  Calendar,
  Download,
  Upload,
  Eye,
  X,
  Save,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getBulletins,
  createBulletin,
  deleteBulletin,
  uploadBulletinPDF,
} from '../../../utils/bulletinService'
import type { Bulletin, BulletinInsert } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Bulletin Management
// Editorial Grid + OKLCH Color System
// ===========================================

const formatKoreanDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const AdminBulletinsPage = () => {
  const { admin } = useAdminAuth()
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    bulletin_date: new Date().toISOString().split('T')[0],
    file_url: '',
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
        file_url: '',
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

  const stats = {
    total: bulletins.length,
    thisMonth: bulletins.filter((b) => {
      const date = new Date(b.bulletin_date)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length,
    thisYear: bulletins.filter((b) => {
      const date = new Date(b.bulletin_date)
      return date.getFullYear() === new Date().getFullYear()
    }).length,
  }

  const statsCards = [
    { name: '총 주보', value: stats.total, icon: FileText },
    { name: '이번 달', value: stats.thisMonth, icon: Calendar },
    { name: '올해', value: stats.thisYear, icon: FileText },
  ]

  return (
    <AdminLayout title="주보 관리" subtitle="주간 주보를 업로드하고 관리하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="h-0.5 w-8 mr-4"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
            }}
          />
          <span className="text-sm font-medium" style={{ color: 'oklch(0.55 0.01 75)' }}>
            {bulletins.length}개의 주보
          </span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          주보 업로드
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`p-5 rounded-sm stagger-${index + 1}`}
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                {stat.name}
              </p>
              <span
                className="font-headline font-bold text-2xl"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                {listLoading ? '—' : stat.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Upload Form */}
      {showForm && (
        <div
          className="rounded-sm p-6 mb-6"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-headline font-bold text-lg"
              style={{ color: 'oklch(0.22 0.07 265)' }}
            >
              새 주보 업로드
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setFormData({
                  title: '',
                  bulletin_date: new Date().toISOString().split('T')[0],
                  file_url: '',
                })
              }}
              className="p-2 rounded-sm transition-colors"
              style={{ color: 'oklch(0.50 0.01 75)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 75)' }}
                >
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 2024년 1월 첫째주 주보"
                  className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 75)' }}
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  주보 날짜 *
                </label>
                <input
                  type="date"
                  value={formData.bulletin_date}
                  onChange={(e) => setFormData({ ...formData, bulletin_date: e.target.value })}
                  className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.35 0.02 75)' }}
              >
                PDF 파일 *
              </label>
              {formData.file_url ? (
                <div
                  className="flex items-center gap-3 p-4 rounded-sm"
                  style={{
                    background: 'oklch(0.55 0.15 145 / 0.1)',
                    border: '1px solid oklch(0.55 0.15 145 / 0.3)',
                  }}
                >
                  <FileText className="w-8 h-8" style={{ color: 'oklch(0.45 0.15 145)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'oklch(0.35 0.15 145)' }}>
                      파일이 업로드되었습니다
                    </p>
                    <a
                      href={formData.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline"
                      style={{ color: 'oklch(0.45 0.15 145)' }}
                    >
                      미리보기
                    </a>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, file_url: '' })}
                    className="p-1.5 rounded-sm transition-colors"
                    style={{ color: 'oklch(0.50 0.18 25)' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center w-full h-32 rounded-sm cursor-pointer transition-colors border-2 border-dashed"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    borderColor: 'oklch(0.85 0.01 265)',
                  }}
                >
                  {uploading ? (
                    <div
                      className="w-8 h-8 rounded-sm animate-pulse"
                      style={{ background: 'oklch(0.45 0.12 265)' }}
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2" style={{ color: 'oklch(0.55 0.01 75)' }} />
                      <span className="text-sm" style={{ color: 'oklch(0.50 0.01 75)' }}>
                        PDF 파일 선택
                      </span>
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
                    file_url: '',
                  })
                }}
                className="px-4 py-2.5 rounded-sm font-medium transition-all duration-200"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.45 0.01 75)',
                }}
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2.5 rounded-sm font-medium transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
                style={{
                  background: 'oklch(0.72 0.10 75)',
                  color: 'oklch(0.15 0.05 265)',
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulletins List */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid oklch(0.92 0.005 75)' }}>
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" style={{ color: 'oklch(0.45 0.12 265)' }} />
            <h2
              className="font-headline font-bold text-lg"
              style={{ color: 'oklch(0.22 0.07 265)' }}
            >
              주보 목록
            </h2>
          </div>
        </div>

        {listLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div
              className="w-10 h-10 rounded-sm mb-4 animate-pulse"
              style={{ background: 'oklch(0.45 0.12 265)' }}
            />
            <p className="text-sm font-medium" style={{ color: 'oklch(0.55 0.01 75)' }}>
              주보 로딩 중...
            </p>
          </div>
        ) : bulletins.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <FileText className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
              등록된 주보가 없습니다
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
              새 주보를 업로드해보세요
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'oklch(0.92 0.005 75)' }}>
            {bulletins.map((bulletin, index) => (
              <div
                key={bulletin.id}
                className={`p-4 flex items-center justify-between transition-colors hover:bg-[oklch(0.97_0.005_265)] stagger-${(index % 6) + 1}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-sm"
                    style={{ background: 'oklch(0.55 0.18 25 / 0.1)' }}
                  >
                    <FileText className="w-6 h-6" style={{ color: 'oklch(0.50 0.18 25)' }} />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-medium"
                      style={{ color: 'oklch(0.25 0.02 75)' }}
                    >
                      {bulletin.title}
                    </h3>
                    <p className="flex items-center text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatKoreanDate(bulletin.bulletin_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={bulletin.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'oklch(0.45 0.12 265 / 0.1)',
                      color: 'oklch(0.45 0.12 265)',
                    }}
                    title="보기"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <a
                    href={bulletin.file_url}
                    download
                    className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'oklch(0.55 0.01 75 / 0.1)',
                      color: 'oklch(0.45 0.01 75)',
                    }}
                    title="다운로드"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(bulletin.id)}
                    className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'oklch(0.55 0.18 25 / 0.1)',
                      color: 'oklch(0.50 0.18 25)',
                    }}
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
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminBulletinsPage
