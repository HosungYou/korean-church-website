import { useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  UserCheck,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { createMember, type MemberType, type MemberStatus } from '../../../utils/memberService'
import type { ChurchMemberInsert } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: New Member Registration
// Editorial Form + OKLCH Color System
// ===========================================

const memberTypeOptions: { value: MemberType; label: string }[] = [
  { value: 'member', label: '성도' },
  { value: 'deacon', label: '집사' },
  { value: 'elder', label: '장로' },
  { value: 'pastor', label: '목사' },
  { value: 'staff', label: '교역자' },
]

const statusOptions: { value: MemberStatus; label: string }[] = [
  { value: 'active', label: '활동' },
  { value: 'inactive', label: '비활동' },
  { value: 'transferred', label: '이적' },
  { value: 'deceased', label: '사망' },
]

const genderOptions = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
]

const departmentOptions = [
  { value: '', label: '부서 선택' },
  { value: 'children', label: '유년부' },
  { value: 'youth', label: '중고등부' },
  { value: 'young_adults', label: '청년대학부' },
  { value: 'district_1', label: '1구역' },
  { value: 'district_2', label: '2구역' },
  { value: 'district_3', label: '3구역' },
  { value: 'district_4', label: '4구역' },
  { value: 'choir', label: '성가대' },
  { value: 'worship', label: '예배부' },
  { value: 'education', label: '교육부' },
]

interface FormData {
  koreanName: string
  englishName: string
  email: string
  phone: string
  address: string
  birthDate: string
  gender: 'male' | 'female' | ''
  memberType: MemberType
  department: string
  status: MemberStatus
  baptized: boolean
  baptismDate: string
  notes: string
}

const NewMemberPage = () => {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    koreanName: '',
    englishName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    gender: '',
    memberType: 'member',
    department: '',
    status: 'active',
    baptized: false,
    baptismDate: '',
    notes: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.koreanName.trim()) {
      setError('이름(한글)을 입력해주세요.')
      return
    }

    setSaving(true)

    try {
      const memberData: ChurchMemberInsert = {
        korean_name: formData.koreanName.trim(),
        english_name: formData.englishName.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        birth_date: formData.birthDate || null,
        gender: formData.gender || null,
        member_type: formData.memberType,
        department: formData.department || null,
        status: formData.status,
        baptized: formData.baptized,
        baptism_date: formData.baptismDate || null,
        notes: formData.notes.trim() || null,
        registered_date: new Date().toISOString().split('T')[0],
      }

      await createMember(memberData)
      router.push('/admin/members')
    } catch (err) {
      console.error('Error creating member:', err)
      setError('교인 등록 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    background: 'oklch(0.97 0.005 265)',
    border: '1px solid oklch(0.90 0.01 265)',
    color: 'oklch(0.25 0.02 75)',
  }

  const labelStyle = {
    color: 'oklch(0.40 0.05 265)',
  }

  return (
    <AdminLayout title="새 교인 등록" subtitle="새로운 교인을 등록하세요">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/admin/members"
          className="inline-flex items-center text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'oklch(0.55 0.01 75)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          교인 목록으로 돌아가기
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="rounded-sm overflow-hidden mb-6"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          {/* Section Header */}
          <div
            className="px-6 py-4"
            style={{
              borderBottom: '1px solid oklch(0.92 0.005 75)',
              background: 'oklch(0.97 0.005 265)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <User className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <h2
                  className="font-headline font-bold text-lg"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  기본 정보
                </h2>
                <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  교인의 기본 정보를 입력하세요
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이름(한글) */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                이름(한글) <span style={{ color: 'oklch(0.55 0.18 25)' }}>*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                />
                <input
                  type="text"
                  name="koreanName"
                  value={formData.koreanName}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  className="w-full pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {/* 이름(영문) */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                이름(영문)
              </label>
              <input
                type="text"
                name="englishName"
                value={formData.englishName}
                onChange={handleInputChange}
                placeholder="Gildong Hong"
                className="w-full px-4 py-2.5 rounded-sm focus:outline-none focus:ring-2"
                style={inputStyle}
              />
            </div>

            {/* 이메일 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                이메일
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                전화번호
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="w-full pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 주소 */}
            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                주소
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 w-4 h-4"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="주소를 입력하세요"
                  className="w-full pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 생년월일 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                생년월일
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:ring-2"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* 성별 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                성별
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                style={inputStyle}
              >
                <option value="">성별 선택</option>
                {genderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Church Information Section */}
        <div
          className="rounded-sm overflow-hidden mb-6"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          {/* Section Header */}
          <div
            className="px-6 py-4"
            style={{
              borderBottom: '1px solid oklch(0.92 0.005 75)',
              background: 'oklch(0.97 0.005 265)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center"
                style={{ background: 'oklch(0.72 0.10 75 / 0.2)' }}
              >
                <Users className="w-5 h-5" style={{ color: 'oklch(0.60 0.10 75)' }} />
              </div>
              <div>
                <h2
                  className="font-headline font-bold text-lg"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  교회 정보
                </h2>
                <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  직분 및 부서 정보를 입력하세요
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 직분 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                직분
              </label>
              <select
                name="memberType"
                value={formData.memberType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                style={inputStyle}
              >
                {memberTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 부서 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                부서
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                style={inputStyle}
              >
                {departmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 상태 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                상태
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                style={inputStyle}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 세례 여부 */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                세례 여부
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="baptized"
                    checked={formData.baptized}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded-sm cursor-pointer"
                  />
                  <span style={{ color: 'oklch(0.40 0.05 265)' }}>세례 받음</span>
                </label>
              </div>
            </div>

            {/* 세례일 */}
            {formData.baptized && (
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={labelStyle}
                >
                  세례일
                </label>
                <div className="relative">
                  <UserCheck
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  />
                  <input
                    type="date"
                    name="baptismDate"
                    value={formData.baptismDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:ring-2"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* 비고 */}
            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={labelStyle}
              >
                비고
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="추가 정보를 입력하세요..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-sm focus:outline-none focus:ring-2 resize-none"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 rounded-sm mb-6"
            style={{
              background: 'oklch(0.55 0.18 25 / 0.1)',
              border: '1px solid oklch(0.55 0.18 25 / 0.3)',
              color: 'oklch(0.45 0.18 25)',
            }}
          >
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/members"
            className="px-6 py-2.5 rounded-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.40 0.05 265)',
            }}
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-2.5 rounded-sm font-medium transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                등록하기
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default NewMemberPage
