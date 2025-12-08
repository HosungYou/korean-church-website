import { supabase } from '../../lib/supabase'

export interface NewFamilyData {
  koreanName: string
  englishName: string
  birthDate: string
  baptismDate?: string
  gender: string
  country: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  email?: string
  phone: string
  churchPosition?: string
  previousChurch?: string
  introduction?: string
  familyInfo?: string
  submittedAt: Date
}

// 새가족 등록 데이터 저장
export const addNewFamilyRegistration = async (formData: Omit<NewFamilyData, 'submittedAt'>): Promise<boolean> => {
  try {
    const { error } = await (supabase
      .from('new_family_registrations') as any)
      .insert({
        korean_name: formData.koreanName,
        english_name: formData.englishName,
        birth_date: formData.birthDate,
        baptism_date: formData.baptismDate || null,
        gender: formData.gender,
        country: formData.country,
        address1: formData.address1,
        address2: formData.address2 || null,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        email: formData.email || null,
        phone: formData.phone,
        church_position: formData.churchPosition || null,
        previous_church: formData.previousChurch || null,
        introduction: formData.introduction || null,
        family_info: formData.familyInfo || null,
        submitted_at: new Date().toISOString()
      })

    if (error) {
      console.error('새가족 등록 저장 오류:', error)
      throw error
    }

    console.log('새가족 등록 데이터가 Supabase에 저장되었습니다.')
    return true
  } catch (error) {
    console.error('새가족 등록 저장 오류:', error)
    throw error
  }
}

// 관리자 대시보드용 - 최근 등록 목록 가져오기
export const getRecentNewFamilyRegistrations = async (limit: number = 10) => {
  try {
    const { data, error } = await (supabase
      .from('new_family_registrations') as any)
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('새가족 등록 목록 조회 오류:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('새가족 등록 목록 조회 오류:', error)
    return []
  }
}
