import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Heart, Users, BookOpen, Clock, MapPin, Phone, Mail, CheckCircle } from 'lucide-react'

const NewFamilyGuide: NextPage = () => {
  const [formData, setFormData] = useState({
    koreanName: '',
    englishName: '',
    birthDate: '',
    baptismDate: '',
    gender: '',
    country: 'United States',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    churchPosition: '',
    previousChurch: '',
    introduction: '',
    familyInfo: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 실제 폼 제출 로직 추가
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    
    // 3초 후 폼 리셋
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        koreanName: '',
        englishName: '',
        birthDate: '',
        baptismDate: '',
        gender: '',
        country: 'United States',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        phone: '',
        churchPosition: '',
        previousChurch: '',
        introduction: '',
        familyInfo: ''
      })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-black mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              등록이 완료되었습니다!
            </h1>
            <p className="text-gray-600 font-korean">
              곧 연락드리겠습니다. 감사합니다.
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-korean">
              새가족 등록
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-korean">
              스테이트 칼리지 한인교회에 오신 것을 환영합니다
            </p>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-korean">
                따뜻한 환영을 받으실 수 있습니다
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Heart className="w-6 h-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 font-korean">따뜻한 환대</h3>
                    <p className="text-gray-600 font-korean">
                      처음 오시는 분들을 위한 특별한 환영과 안내를 받으실 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 font-korean">교제의 기회</h3>
                    <p className="text-gray-600 font-korean">
                      새가족 모임과 소그룹을 통해 교회 가족들과 깊은 교제를 나누실 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 font-korean">신앙 성장</h3>
                    <p className="text-gray-600 font-korean">
                      체계적인 양육 프로그램을 통해 건강한 신앙생활을 시작하실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
              <p className="text-gray-500 font-korean">새가족 환영 이미지</p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Cards */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 font-korean">
            교회 안내
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Clock className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean">예배 시간</h3>
              <div className="space-y-2 text-gray-600 font-korean">
                <p><strong>주일 예배:</strong> 오전 11:00</p>
                <p><strong>수요 예배:</strong> 저녁 7:30</p>
                <p><strong>새벽 기도:</strong> 화-토 오전 6:00</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <MapPin className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean">위치</h3>
              <div className="text-gray-600 font-korean">
                <p>758 Glenn Rd</p>
                <p>State College, PA 16803</p>
                <p className="mt-2 text-blue-600">
                  <Link href="/about/directions">오시는 길 보기 →</Link>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <Phone className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean">연락처</h3>
              <div className="text-gray-600 font-korean">
                <p><strong>전화:</strong> (814) 380-9393</p>
                <p><strong>이메일:</strong> KyuHongYeon@gmail.com</p>
                <p className="mt-2"><strong>담임목사:</strong> 연규홍 목사</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              새가족 등록
            </h2>
            <p className="text-gray-600 font-korean">
              아래 정보를 입력해주시면 더 나은 섬김을 제공해드릴 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 한국 이름 */}
            <div>
              <label htmlFor="koreanName" className="block text-sm font-medium text-gray-700 font-korean">
                한국 이름 (Korean Name)
              </label>
              <input
                type="text"
                id="koreanName"
                name="koreanName"
                value={formData.koreanName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 영어 이름 */}
            <div>
              <label htmlFor="englishName" className="block text-sm font-medium text-gray-700 font-korean">
                영어이름 (English Name)
              </label>
              <input
                type="text"
                id="englishName"
                name="englishName"
                value={formData.englishName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 font-korean">
                생년월일 (Date of Birth) (required)
              </label>
              <p className="text-sm text-gray-500">mm/dd/yyyy</p>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 세례일 */}
            <div>
              <label htmlFor="baptismDate" className="block text-sm font-medium text-gray-700 font-korean">
                세례일
              </label>
              <p className="text-sm text-gray-500">mm/dd/yyyy</p>
              <input
                type="date"
                id="baptismDate"
                name="baptismDate"
                value={formData.baptismDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 성별 */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 font-korean">
                성별
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an option</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            {/* 주소 */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 font-korean">
                주소
              </label>
              <p className="text-sm text-gray-500">Country</p>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="United States">United States</option>
                <option value="Korea">Korea</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                Address Line 1 (required)
              </label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.address1}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City (required)
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State (required)
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code (required)
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 font-korean">
                전화 (Phone) (required)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 이전 교회 직분 */}
            <div>
              <label htmlFor="churchPosition" className="block text-sm font-medium text-gray-700 font-korean">
                이전 교회 직분 (Officers of Church)
              </label>
              <select
                id="churchPosition"
                name="churchPosition"
                value={formData.churchPosition}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an option</option>
                <option value="장로">장로</option>
                <option value="안수집사">안수집사</option>
                <option value="권사">권사</option>
                <option value="서리집사">서리집사</option>
                <option value="성도">성도</option>
              </select>
            </div>

            {/* 이전 교회 본사 부서 */}
            <div>
              <label htmlFor="previousChurch" className="block text-sm font-medium text-gray-700 font-korean">
                이전 교회 본사 부서
              </label>
              <input
                type="text"
                id="previousChurch"
                name="previousChurch"
                value={formData.previousChurch}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 이전 교회 인도자 */}
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 font-korean">
                이전 교회 인도자
              </label>
              <input
                type="text"
                id="introduction"
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 가족 상황 */}
            <div>
              <label htmlFor="familyInfo" className="block text-sm font-medium text-gray-700 font-korean">
                가족 상황 (Family Information)
              </label>
              <p className="text-sm text-gray-500 font-korean">
                이름 // 관계 // 생년월일<br />
                ex. 홍길동 // 아들 // 12.12.12
              </p>
              <textarea
                id="familyInfo"
                name="familyInfo"
                rows={4}
                value={formData.familyInfo}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 제출 버튼 */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors font-korean text-lg font-semibold"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-korean">
              궁금한 점이 있으시면 언제든 연락주세요
            </h2>
            <p className="mb-8 font-korean opacity-90">
              담임목사님과 교회 가족들이 따뜻하게 맞이하겠습니다.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span className="font-korean">(814) 380-9393</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>KyuHongYeon@gmail.com</span>
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

export default NewFamilyGuide