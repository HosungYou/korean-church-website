import React, { useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { UserPlus, Check, AlertCircle, Mail, Phone, MapPin, Calendar, Church } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

// ===========================================
// VS Design Diverge: New Family Registration Page
// Editorial Form Layout + OKLCH Color System
// ===========================================

interface FormData {
  korean_name: string
  english_name: string
  email: string
  phone: string
  address: string
  birth_date: string
  gender: 'male' | 'female' | ''
  previous_church: string
  baptized: boolean | null
  notes: string
}

const initialFormData: FormData = {
  korean_name: '',
  english_name: '',
  email: '',
  phone: '',
  address: '',
  birth_date: '',
  gender: '',
  previous_church: '',
  baptized: null,
  notes: '',
}

const NewFamilyRegistrationPage: NextPage = () => {
  const { t } = useTranslation('common')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleRadioChange = (name: string, value: boolean | string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('new_families')
        .insert({
          name: formData.korean_name,
          email: formData.email || null,
          phone: formData.phone,
          address: formData.address || null,
          birth_date: formData.birth_date || null,
          gender: formData.gender || null,
          previous_church: formData.previous_church || null,
          baptized: formData.baptized ?? false,
          notes: formData.notes
            ? `영문이름: ${formData.english_name}\n\n${formData.notes}`
            : formData.english_name
              ? `영문이름: ${formData.english_name}`
              : null,
          status: 'pending',
        })

      if (error) throw error

      setSubmitStatus('success')
      setFormData(initialFormData)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle = {
    background: 'oklch(0.985 0.003 75)',
    border: '1px solid oklch(0.88 0.005 75)',
    color: 'oklch(0.25 0.05 265)',
  }

  const labelStyle = {
    color: 'oklch(0.35 0.02 265)',
  }

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        label={(t('new_family.label') as string) || '새가족'}
        title={t('new_family.title') as string}
        subtitle={t('new_family.description') as string}
      />

      <div
        className="min-h-screen relative"
        style={{ background: 'oklch(0.97 0.005 75)' }}
      >
        {/* Grain overlay */}
        <div className="bg-grain absolute inset-0 pointer-events-none" />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Success Message */}
          {submitStatus === 'success' && (
            <div
              className="mb-8 p-6 rounded-sm flex items-start gap-4"
              style={{
                background: 'oklch(0.55 0.15 145 / 0.1)',
                border: '1px solid oklch(0.55 0.15 145 / 0.3)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'oklch(0.55 0.15 145)' }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  className="font-medium mb-1"
                  style={{ color: 'oklch(0.40 0.15 145)' }}
                >
                  등록이 완료되었습니다!
                </h3>
                <p
                  className="text-sm"
                  style={{ color: 'oklch(0.45 0.10 145)' }}
                >
                  {t('new_family.form.success')}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div
              className="mb-8 p-6 rounded-sm flex items-start gap-4"
              style={{
                background: 'oklch(0.55 0.15 25 / 0.1)',
                border: '1px solid oklch(0.55 0.15 25 / 0.3)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'oklch(0.55 0.15 25)' }}
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  className="font-medium mb-1"
                  style={{ color: 'oklch(0.50 0.15 25)' }}
                >
                  오류가 발생했습니다
                </h3>
                <p
                  className="text-sm"
                  style={{ color: 'oklch(0.50 0.10 25)' }}
                >
                  {t('new_family.form.error')}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div
              className="rounded-sm overflow-hidden"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)',
              }}
            >
              {/* Gold accent line */}
              <div
                className="h-1"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />

              <div className="p-8">
                {/* Basic Info Section */}
                <div className="mb-10">
                  <h2
                    className="font-headline font-bold text-lg mb-6"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    기본 정보
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Korean Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        {t('new_family.form.korean_name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="korean_name"
                        value={formData.korean_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          ...inputStyle,
                          outlineColor: 'oklch(0.45 0.12 265)',
                        }}
                        placeholder="홍길동"
                      />
                    </div>

                    {/* English Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        {t('new_family.form.english_name')}
                      </label>
                      <input
                        type="text"
                        name="english_name"
                        value={formData.english_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          ...inputStyle,
                          outlineColor: 'oklch(0.45 0.12 265)',
                        }}
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        <Mail className="w-4 h-4 inline mr-1" />
                        {t('new_family.form.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          ...inputStyle,
                          outlineColor: 'oklch(0.45 0.12 265)',
                        }}
                        placeholder="example@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        <Phone className="w-4 h-4 inline mr-1" />
                        {t('new_family.form.phone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          ...inputStyle,
                          outlineColor: 'oklch(0.45 0.12 265)',
                        }}
                        placeholder="123-456-7890"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {t('new_family.form.address')}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          ...inputStyle,
                          outlineColor: 'oklch(0.45 0.12 265)',
                        }}
                        placeholder="State College, PA"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="mb-10">
                  <h2
                    className="font-headline font-bold text-lg mb-6"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    추가 정보
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Birth Date */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {t('new_family.form.birth_date')}
                      </label>
                      <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          ...inputStyle,
                          outlineColor: 'oklch(0.45 0.12 265)',
                        }}
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        {t('new_family.form.gender')}
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => handleRadioChange('gender', 'male')}
                          className={`flex-1 px-4 py-3 rounded-sm text-sm font-medium transition-all ${
                            formData.gender === 'male' ? 'scale-[1.02]' : ''
                          }`}
                          style={{
                            background: formData.gender === 'male'
                              ? 'oklch(0.45 0.12 265)'
                              : 'oklch(0.985 0.003 75)',
                            color: formData.gender === 'male'
                              ? 'oklch(0.98 0.003 75)'
                              : 'oklch(0.35 0.02 265)',
                            border: `1px solid ${
                              formData.gender === 'male'
                                ? 'oklch(0.45 0.12 265)'
                                : 'oklch(0.88 0.005 75)'
                            }`,
                          }}
                        >
                          {t('new_family.form.gender_male')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRadioChange('gender', 'female')}
                          className={`flex-1 px-4 py-3 rounded-sm text-sm font-medium transition-all ${
                            formData.gender === 'female' ? 'scale-[1.02]' : ''
                          }`}
                          style={{
                            background: formData.gender === 'female'
                              ? 'oklch(0.45 0.12 265)'
                              : 'oklch(0.985 0.003 75)',
                            color: formData.gender === 'female'
                              ? 'oklch(0.98 0.003 75)'
                              : 'oklch(0.35 0.02 265)',
                            border: `1px solid ${
                              formData.gender === 'female'
                                ? 'oklch(0.45 0.12 265)'
                                : 'oklch(0.88 0.005 75)'
                            }`,
                          }}
                        >
                          {t('new_family.form.gender_female')}
                        </button>
                      </div>
                    </div>

                    {/* Previous Church */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        <Church className="w-4 h-4 inline mr-1" />
                        {t('new_family.form.previous_church')}
                      </label>
                      <input
                        type="text"
                        name="previous_church"
                        value={formData.previous_church}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          ...inputStyle,
                          outlineColor: 'oklch(0.45 0.12 265)',
                        }}
                        placeholder="이전 출석 교회"
                      />
                    </div>

                    {/* Baptized */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        {t('new_family.form.baptized')}
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => handleRadioChange('baptized', true)}
                          className={`flex-1 px-4 py-3 rounded-sm text-sm font-medium transition-all ${
                            formData.baptized === true ? 'scale-[1.02]' : ''
                          }`}
                          style={{
                            background: formData.baptized === true
                              ? 'oklch(0.45 0.12 265)'
                              : 'oklch(0.985 0.003 75)',
                            color: formData.baptized === true
                              ? 'oklch(0.98 0.003 75)'
                              : 'oklch(0.35 0.02 265)',
                            border: `1px solid ${
                              formData.baptized === true
                                ? 'oklch(0.45 0.12 265)'
                                : 'oklch(0.88 0.005 75)'
                            }`,
                          }}
                        >
                          {t('new_family.form.baptized_yes')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRadioChange('baptized', false)}
                          className={`flex-1 px-4 py-3 rounded-sm text-sm font-medium transition-all ${
                            formData.baptized === false ? 'scale-[1.02]' : ''
                          }`}
                          style={{
                            background: formData.baptized === false
                              ? 'oklch(0.45 0.12 265)'
                              : 'oklch(0.985 0.003 75)',
                            color: formData.baptized === false
                              ? 'oklch(0.98 0.003 75)'
                              : 'oklch(0.35 0.02 265)',
                            border: `1px solid ${
                              formData.baptized === false
                                ? 'oklch(0.45 0.12 265)'
                                : 'oklch(0.88 0.005 75)'
                            }`,
                          }}
                        >
                          {t('new_family.form.baptized_no')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-10">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={labelStyle}
                  >
                    {t('new_family.form.notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      ...inputStyle,
                      outlineColor: 'oklch(0.45 0.12 265)',
                    }}
                    placeholder="교회에 알리고 싶은 내용이 있으면 작성해 주세요."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 rounded-sm text-base font-medium transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'oklch(0.45 0.12 265)',
                    color: 'oklch(0.98 0.003 75)',
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div
                        className="w-5 h-5 border-2 rounded-full animate-spin"
                        style={{ borderColor: 'oklch(0.98 0.003 75)', borderTopColor: 'transparent' }}
                      />
                      처리 중...
                    </span>
                  ) : (
                    t('new_family.form.submit')
                  )}
                </button>
              </div>
            </div>
          </form>
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

export default NewFamilyRegistrationPage
