import { supabase } from '../../lib/supabase'

export interface EmailSubscriber {
  id?: string
  email: string
  subscribedAt: Date
  isActive: boolean
}

export interface NewsletterData {
  title: string
  content: string
  publishedAt: Date
  type: 'announcement' | 'event' | 'general'
}

// 이메일 구독자 추가
export const addEmailSubscriber = async (email: string): Promise<boolean> => {
  try {
    // 중복 확인
    const { data: existing } = await (supabase
      .from('email_subscribers') as any)
      .select('id')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (existing) {
      throw new Error('이미 구독 중인 이메일입니다.')
    }

    // 새 구독자 추가
    const { error } = await (supabase
      .from('email_subscribers') as any)
      .insert({
        email,
        is_active: true
      })

    if (error) {
      console.error('Insert subscriber error:', error)
      throw new Error('구독 등록에 실패했습니다.')
    }

    return true
  } catch (error) {
    console.error('이메일 구독 오류:', error)
    throw error
  }
}

// 모든 활성 구독자 가져오기
export const getActiveSubscribers = async (): Promise<EmailSubscriber[]> => {
  try {
    const { data, error } = await (supabase
      .from('email_subscribers') as any)
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false })

    if (error) {
      console.error('Get subscribers error:', error)
      return []
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      email: row.email,
      subscribedAt: new Date(row.subscribed_at),
      isActive: row.is_active
    }))
  } catch (error) {
    console.error('구독자 목록 조회 오류:', error)
    return []
  }
}

// 뉴스레터/공지사항 발송
export const sendNewsletterToSubscribers = async (newsletterData: NewsletterData): Promise<boolean> => {
  try {
    const subscribers = await getActiveSubscribers()

    if (subscribers.length === 0) {
      console.log('활성 구독자가 없습니다.')
      return true
    }

    // 실제 이메일 발송 로직 (여기서는 로깅만)
    // 실제 구현 시에는 SendGrid, Resend, 또는 다른 이메일 서비스 사용
    console.log(`${subscribers.length}명의 구독자에게 뉴스레터 발송:`, {
      title: newsletterData.title,
      content: newsletterData.content,
      subscribers: subscribers.map(s => s.email)
    })

    // TODO: 실제 이메일 발송 구현
    // Supabase Edge Functions 또는 외부 이메일 서비스 연동
    /*
    const emailPromises = subscribers.map(subscriber =>
      sendEmail({
        to: subscriber.email,
        subject: `[교회소식] ${newsletterData.title}`,
        html: generateEmailTemplate(newsletterData),
        from: 'noreply@yourchurch.com'
      })
    )

    await Promise.all(emailPromises)
    */

    // 발송 기록 저장
    const { error } = await (supabase
      .from('newsletter_sent') as any)
      .insert({
        title: newsletterData.title,
        content: newsletterData.content,
        type: newsletterData.type,
        published_at: newsletterData.publishedAt.toISOString(),
        recipient_count: subscribers.length,
        recipients: subscribers.map(s => s.email)
      })

    if (error) {
      console.error('Newsletter record error:', error)
    }

    return true
  } catch (error) {
    console.error('뉴스레터 발송 오류:', error)
    throw error
  }
}

// 이메일 템플릿 생성
export const generateEmailTemplate = (data: NewsletterData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.title}</title>
      <style>
        body {
          font-family: 'Noto Sans KR', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #000;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 0 0 8px 8px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #000;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.title}</h1>
        <p>교회소식 • ${data.publishedAt.toLocaleDateString('ko-KR')}</p>
      </div>
      <div class="content">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <span class="dot"></span>
          <strong>교회 공지사항</strong>
        </div>
        <div>
          ${data.content}
        </div>
      </div>
      <div class="footer">
        <p>이 메일은 교회 소식 구독자에게 발송되었습니다.</p>
        <p>구독을 취소하시려면 교회로 연락해주세요.</p>
        <p>© 2025 State College Korean Church. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

// 구독 취소
export const unsubscribeEmail = async (email: string): Promise<boolean> => {
  try {
    const { data: subscriber, error: fetchError } = await (supabase
      .from('email_subscribers') as any)
      .select('id')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (fetchError || !subscriber) {
      throw new Error('구독 정보를 찾을 수 없습니다.')
    }

    // 구독 비활성화
    const { error } = await (supabase
      .from('email_subscribers') as any)
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)

    if (error) {
      console.error('Unsubscribe error:', error)
      throw new Error('구독 취소에 실패했습니다.')
    }

    return true
  } catch (error) {
    console.error('구독 취소 오류:', error)
    throw error
  }
}

// 구독자 수 가져오기
export const getSubscriberCount = async (): Promise<number> => {
  const { count, error } = await (supabase
    .from('email_subscribers') as any)
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (error) {
    console.error('Get subscriber count error:', error)
    return 0
  }

  return count || 0
}
