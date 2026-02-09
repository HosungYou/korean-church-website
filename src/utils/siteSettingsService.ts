import { supabase } from '../../lib/supabase'

export interface EmailSettings {
  senderName: string
  senderAddress: string
  replyTo: string
}

// 단일 설정 값 조회
export const getSetting = async (key: string): Promise<string | null> => {
  try {
    if (!supabase) {
      console.error('Supabase가 초기화되지 않았습니다.')
      return null
    }

    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) {
      console.error(`Setting fetch error for key "${key}":`, error)
      return null
    }

    return data?.value || null
  } catch (error) {
    console.error('설정 조회 오류:', error)
    return null
  }
}

// 이메일 설정 3개 한번에 조회
export const getEmailSettings = async (): Promise<EmailSettings> => {
  try {
    if (!supabase) {
      console.error('Supabase가 초기화되지 않았습니다.')
      return {
        senderName: '',
        senderAddress: '',
        replyTo: ''
      }
    }

    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('key, value')
      .in('key', ['email_sender_name', 'email_sender_address', 'email_reply_to'])

    if (error) {
      console.error('Email settings fetch error:', error)
      return {
        senderName: '',
        senderAddress: '',
        replyTo: ''
      }
    }

    // 배열을 객체로 변환
    const settings = (data || []).reduce((acc: any, row: any) => {
      acc[row.key] = row.value
      return acc
    }, {})

    return {
      senderName: settings.email_sender_name || '',
      senderAddress: settings.email_sender_address || '',
      replyTo: settings.email_reply_to || ''
    }
  } catch (error) {
    console.error('이메일 설정 조회 오류:', error)
    return {
      senderName: '',
      senderAddress: '',
      replyTo: ''
    }
  }
}

// 단일 설정 업데이트
export const updateSetting = async (key: string, value: string): Promise<boolean> => {
  try {
    if (!supabase) {
      console.error('Supabase가 초기화되지 않았습니다.')
      return false
    }

    const { error } = await (supabase as any)
      .from('site_settings')
      .update({
        value,
        updated_at: new Date().toISOString()
      })
      .eq('key', key)

    if (error) {
      console.error(`Setting update error for key "${key}":`, error)
      return false
    }

    return true
  } catch (error) {
    console.error('설정 업데이트 오류:', error)
    return false
  }
}

// 이메일 설정 3개 한번에 업데이트
export const updateEmailSettings = async (settings: EmailSettings): Promise<boolean> => {
  try {
    if (!supabase) {
      console.error('Supabase가 초기화되지 않았습니다.')
      return false
    }

    const updates = [
      { key: 'email_sender_name', value: settings.senderName },
      { key: 'email_sender_address', value: settings.senderAddress },
      { key: 'email_reply_to', value: settings.replyTo }
    ]

    // 3개 업데이트를 병렬로 실행
    const results = await Promise.all(
      updates.map(({ key, value }) =>
        (supabase as any).from('site_settings')
          .update({
            value,
            updated_at: new Date().toISOString()
          })
          .eq('key', key)
      )
    )

    // 하나라도 실패하면 false 반환
    const hasError = results.some(result => result.error)
    if (hasError) {
      console.error('Email settings update error:', results)
      return false
    }

    return true
  } catch (error) {
    console.error('이메일 설정 업데이트 오류:', error)
    return false
  }
}
