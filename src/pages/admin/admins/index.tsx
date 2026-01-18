// ===========================================
// VS Design Diverge: Admin Management Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  UserPlus,
  Shield,
  ShieldCheck,
  Trash2,
  Loader2,
  AlertTriangle,
  X,
  Check,
  Users,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  type AdminUserWithAuth,
  type AdminRole,
} from '@/utils/adminService'

const AdminManagementPage = () => {
  const { admin, loading: authLoading } = useAdminAuth()
  const [admins, setAdmins] = useState<AdminUserWithAuth[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ email: '', name: '', role: 'admin' as AdminRole })
  const [error, setError] = useState<string | null>(null)

  // Check if current user is super_admin
  const isSuperAdmin = admin?.role === 'super_admin'

  useEffect(() => {
    if (!admin) return
    fetchAdmins()
  }, [admin])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const data = await getAllAdmins()
      setAdmins(data)
    } catch (err) {
      console.error('Error fetching admins:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdmin.email.trim() || !newAdmin.name.trim()) {
      setError('이메일과 이름을 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      setError(null)
      await addAdmin(newAdmin.email, newAdmin.name, newAdmin.role)
      setNewAdmin({ email: '', name: '', role: 'admin' })
      setShowAddModal(false)
      await fetchAdmins()
    } catch (err: any) {
      setError(err.message || '관리자 추가 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateRole = async (id: string, role: AdminRole) => {
    if (id === admin?.id) {
      alert('자신의 권한은 변경할 수 없습니다.')
      return
    }

    try {
      await updateAdmin(id, { role })
      await fetchAdmins()
    } catch (err) {
      console.error('Error updating admin:', err)
      alert('권한 변경 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (id === admin?.id) {
      alert('자신을 삭제할 수 없습니다.')
      return
    }

    if (!confirm(`정말 ${email} 관리자를 삭제하시겠습니까?`)) return

    try {
      await deleteAdmin(id)
      await fetchAdmins()
    } catch (err) {
      console.error('Error deleting admin:', err)
      alert('관리자 삭제 중 오류가 발생했습니다.')
    }
  }

  if (authLoading || loading) {
    return (
      <AdminLayout title="관리자 관리" subtitle="관리자 권한 설정">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-12 h-12 rounded-sm animate-pulse"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          />
        </div>
      </AdminLayout>
    )
  }

  if (!admin) return null

  return (
    <AdminLayout title="관리자 관리" subtitle="관리자 권한 설정">
      {/* Permission Warning */}
      {!isSuperAdmin && (
        <div
          className="mb-8 p-4 rounded-sm flex items-start gap-3"
          style={{
            background: 'oklch(0.72 0.10 75 / 0.15)',
            border: '1px solid oklch(0.72 0.10 75 / 0.3)',
          }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.58 0.11 75)' }} />
          <div>
            <p className="font-medium" style={{ color: 'oklch(0.45 0.08 75)' }}>
              관리자 권한 필요
            </p>
            <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.05 75)' }}>
              관리자를 추가하거나 권한을 변경하려면 슈퍼 관리자 권한이 필요합니다.
            </p>
          </div>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <div
            className="h-0.5 w-12 mb-4"
            style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
          />
          <h2
            className="font-headline font-bold text-2xl flex items-center gap-3"
            style={{ color: 'oklch(0.22 0.07 265)' }}
          >
            <Users className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} />
            관리자 목록
          </h2>
          <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
            총 {admins.length}명의 관리자
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            관리자 추가
          </button>
        )}
      </div>

      {/* Admin List */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        {admins.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Users className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p className="font-medium" style={{ color: 'oklch(0.45 0.05 265)' }}>
              등록된 관리자가 없습니다.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'oklch(0.97 0.005 265)' }}>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'oklch(0.45 0.05 265)' }}
                  >
                    관리자
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'oklch(0.45 0.05 265)' }}
                  >
                    이메일
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'oklch(0.45 0.05 265)' }}
                  >
                    권한
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'oklch(0.45 0.05 265)' }}
                  >
                    등록일
                  </th>
                  {isSuperAdmin && (
                    <th
                      className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'oklch(0.45 0.05 265)' }}
                    >
                      관리
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {admins.map((adminUser, index) => (
                  <tr
                    key={adminUser.id}
                    className={`stagger-${(index % 6) + 1} transition-colors`}
                    style={{
                      borderTop: '1px solid oklch(0.92 0.005 75)',
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 rounded-sm flex items-center justify-center mr-3"
                          style={{
                            background: adminUser.role === 'super_admin'
                              ? 'oklch(0.72 0.10 75 / 0.2)'
                              : 'oklch(0.45 0.12 265 / 0.1)',
                          }}
                        >
                          {adminUser.role === 'super_admin' ? (
                            <ShieldCheck className="w-5 h-5" style={{ color: 'oklch(0.58 0.11 75)' }} />
                          ) : (
                            <Shield className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'oklch(0.25 0.02 75)' }}>
                            {adminUser.name}
                          </p>
                          {adminUser.id === admin?.id && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-sm"
                              style={{
                                background: 'oklch(0.55 0.15 145 / 0.15)',
                                color: 'oklch(0.45 0.15 145)',
                              }}
                            >
                              현재 로그인
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: 'oklch(0.45 0.02 75)' }}>
                        {adminUser.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isSuperAdmin && adminUser.id !== admin?.id ? (
                        <select
                          value={adminUser.role}
                          onChange={(e) => handleUpdateRole(adminUser.id, e.target.value as AdminRole)}
                          className="px-3 py-1.5 rounded-sm text-sm font-medium transition-all focus:outline-none focus:ring-2"
                          style={{
                            background: adminUser.role === 'super_admin'
                              ? 'oklch(0.72 0.10 75 / 0.2)'
                              : 'oklch(0.45 0.12 265 / 0.1)',
                            color: adminUser.role === 'super_admin'
                              ? 'oklch(0.45 0.08 75)'
                              : 'oklch(0.35 0.08 265)',
                            border: '1px solid transparent',
                          }}
                        >
                          <option value="admin">관리자</option>
                          <option value="super_admin">슈퍼 관리자</option>
                        </select>
                      ) : (
                        <span
                          className="inline-flex items-center px-3 py-1.5 rounded-sm text-sm font-medium"
                          style={{
                            background: adminUser.role === 'super_admin'
                              ? 'oklch(0.72 0.10 75 / 0.2)'
                              : 'oklch(0.45 0.12 265 / 0.1)',
                            color: adminUser.role === 'super_admin'
                              ? 'oklch(0.45 0.08 75)'
                              : 'oklch(0.35 0.08 265)',
                          }}
                        >
                          {adminUser.role === 'super_admin' ? '슈퍼 관리자' : '관리자'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {adminUser.created_at
                          ? new Date(adminUser.created_at).toLocaleDateString('ko-KR')
                          : '-'}
                      </span>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 text-right">
                        {adminUser.id !== admin?.id && (
                          <button
                            onClick={() => handleDeleteAdmin(adminUser.id, adminUser.email)}
                            className="p-2 rounded-sm transition-all duration-200 hover:scale-110"
                            style={{
                              color: 'oklch(0.55 0.18 25)',
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Description */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-sm"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Shield className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <h3 className="font-bold" style={{ color: 'oklch(0.25 0.02 75)' }}>
              관리자 (Admin)
            </h3>
          </div>
          <ul className="space-y-2 text-sm" style={{ color: 'oklch(0.45 0.02 75)' }}>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 145)' }} />
              콘텐츠 관리 (게시글, 설교, 갤러리 등)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 145)' }} />
              교인 정보 관리
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 145)' }} />
              뉴스레터 발송
            </li>
            <li className="flex items-center gap-2">
              <X className="w-4 h-4" style={{ color: 'oklch(0.55 0.18 25)' }} />
              관리자 추가/삭제 불가
            </li>
          </ul>
        </div>

        <div
          className="p-6 rounded-sm"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.72 0.10 75 / 0.3)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center"
              style={{ background: 'oklch(0.72 0.10 75 / 0.2)' }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: 'oklch(0.58 0.11 75)' }} />
            </div>
            <h3 className="font-bold" style={{ color: 'oklch(0.25 0.02 75)' }}>
              슈퍼 관리자 (Super Admin)
            </h3>
          </div>
          <ul className="space-y-2 text-sm" style={{ color: 'oklch(0.45 0.02 75)' }}>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 145)' }} />
              모든 관리자 권한 포함
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 145)' }} />
              관리자 추가/삭제
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 145)' }} />
              관리자 권한 변경
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 145)' }} />
              시스템 설정 접근
            </li>
          </ul>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ background: 'oklch(0.15 0.05 265 / 0.7)' }}
            onClick={() => setShowAddModal(false)}
          />
          <div
            className="relative w-full max-w-md p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-sm transition-colors"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div
                className="h-0.5 w-8 mb-4"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <h3
                className="font-headline font-bold text-xl"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                관리자 추가
              </h3>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                새로운 관리자를 등록합니다.
              </p>
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded-sm text-sm"
                style={{
                  background: 'oklch(0.55 0.18 25 / 0.1)',
                  color: 'oklch(0.50 0.15 25)',
                  border: '1px solid oklch(0.55 0.18 25 / 0.3)',
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  이메일 <span style={{ color: 'oklch(0.60 0.18 25)' }}>*</span>
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  Google 로그인에 사용하는 이메일을 입력해주세요.
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  이름 <span style={{ color: 'oklch(0.60 0.18 25)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="홍길동"
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
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
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  권한
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as AdminRole })}
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                >
                  <option value="admin">관리자</option>
                  <option value="super_admin">슈퍼 관리자</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 rounded-sm font-medium text-sm transition-all duration-200"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  color: 'oklch(0.45 0.02 75)',
                  border: '1px solid oklch(0.90 0.01 265)',
                }}
              >
                취소
              </button>
              <button
                onClick={handleAddAdmin}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
                style={{
                  background: 'oklch(0.45 0.12 265)',
                  color: 'oklch(0.98 0.003 75)',
                }}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminManagementPage
