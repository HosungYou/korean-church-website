import { db } from '../../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

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
    const newFamilyData: NewFamilyData = {
      ...formData,
      submittedAt: new Date()
    }

    await addDoc(collection(db, 'newFamilyRegistrations'), newFamilyData)

    console.log('새가족 등록 데이터가 Firebase에 저장되었습니다.')
    return true
  } catch (error) {
    console.error('새가족 등록 저장 오류:', error)
    throw error
  }
}

// 관리자 대시보드용 - 최근 등록 목록 가져오기
export const getRecentNewFamilyRegistrations = async (limit: number = 10) => {
  try {
    // 실제 구현 시 Firebase에서 데이터 조회
    // const q = query(
    //   collection(db, 'newFamilyRegistrations'),
    //   orderBy('submittedAt', 'desc'),
    //   limit(limit)
    // )
    // const querySnapshot = await getDocs(q)
    // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    console.log('새가족 등록 목록 조회')
    return []
  } catch (error) {
    console.error('새가족 등록 목록 조회 오류:', error)
    return []
  }
}