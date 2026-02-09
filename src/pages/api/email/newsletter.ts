import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Supabase 서버 클라이언트 (service role key 사용)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getEmailSettingsFromDB() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', ['email_sender_name', 'email_sender_address', 'email_reply_to'])

  const settings: Record<string, string> = {}
  if (data) {
    data.forEach((row: { key: string; value: string }) => {
      settings[row.key] = row.value
    })
  }

  return {
    senderName: settings.email_sender_name || '스테이트 칼리지 한인교회',
    senderAddress: settings.email_sender_address || 'newsletter@sckc.org',
    replyTo: settings.email_reply_to || 'KyuHongYeon@gmail.com',
  }
}

interface NewsletterData {
  title: string
  content: string
  type: 'announcement' | 'event' | 'general'
}

interface RequestBody {
  newsletter: NewsletterData
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 인증 확인 (관리자만 뉴스레터 발송 가능)
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // 실제 토큰 검증
  const token = authHeader.substring(7)
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // 관리자 권한 확인
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || !adminData || (adminData.role !== 'admin' && adminData.role !== 'super_admin')) {
      return res.status(403).json({ error: 'Admin access required' })
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(401).json({ error: 'Token verification failed' })
  }

  try {
    const { newsletter } = req.body as RequestBody

    if (!newsletter || !newsletter.title || !newsletter.content) {
      return res.status(400).json({ error: 'Newsletter title and content are required' })
    }

    // 활성 구독자 목록 가져오기
    const { data: subscribers, error: subscriberError } = await supabaseAdmin
      .from('email_subscribers')
      .select('email, name')
      .eq('is_active', true)

    if (subscriberError) {
      console.error('구독자 조회 오류:', subscriberError)
      return res.status(500).json({ error: '구독자 목록을 가져오는데 실패했습니다.' })
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: '활성 구독자가 없습니다.',
        sentCount: 0
      })
    }

    const emailSettings = await getEmailSettingsFromDB()
    const resendApiKey = process.env.RESEND_API_KEY
    const emailHtml = generateNewsletterTemplate(newsletter)
    let sentCount = 0
    let failedCount = 0

    if (resendApiKey) {
      // Resend의 batch API를 사용하거나 개별 발송
      // 여기서는 단순화를 위해 개별 발송
      for (const subscriber of subscribers) {
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: `${emailSettings.senderName} <${emailSettings.senderAddress}>`,
              to: subscriber.email,
              reply_to: emailSettings.replyTo,
              subject: `[교회소식] ${newsletter.title}`,
              html: emailHtml,
            }),
          })

          if (response.ok) {
            sentCount++
          } else {
            failedCount++
            console.error(`이메일 발송 실패 (${subscriber.email}):`, await response.text())
          }
        } catch (error) {
          failedCount++
          console.error(`이메일 발송 오류 (${subscriber.email}):`, error)
        }

        // Rate limit 방지를 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } else {
      // API 키 없으면 로그만 출력
      console.log('=== 뉴스레터 발송 (테스트 모드) ===')
      console.log(`제목: ${newsletter.title}`)
      console.log(`유형: ${newsletter.type}`)
      console.log(`수신자 수: ${subscribers.length}`)
      console.log('수신자 목록:')
      subscribers.forEach(s => console.log(`  - ${s.email}`))
      console.log('====================================')
      sentCount = subscribers.length
    }

    // 발송 기록 저장
    await supabaseAdmin
      .from('newsletter_logs')
      .insert({
        title: newsletter.title,
        content: newsletter.content,
        type: newsletter.type,
        recipient_count: sentCount,
        failed_count: failedCount,
        sent_at: new Date().toISOString(),
      })

    return res.status(200).json({
      success: true,
      message: `${sentCount}명에게 뉴스레터를 발송했습니다.`,
      sentCount,
      failedCount,
      totalSubscribers: subscribers.length
    })
  } catch (error) {
    console.error('뉴스레터 발송 오류:', error)
    return res.status(500).json({ error: '뉴스레터 발송 중 오류가 발생했습니다.' })
  }
}

function generateNewsletterTemplate(newsletter: NewsletterData): string {
  const typeLabels = {
    announcement: '공지사항',
    event: '행사 안내',
    general: '소식'
  }

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${newsletter.title}</title>
      <style>
        body {
          font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', Arial, sans-serif;
          line-height: 1.8;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: #000;
          color: white;
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header .date {
          margin-top: 8px;
          font-size: 14px;
          opacity: 0.8;
        }
        .type-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          margin-bottom: 16px;
        }
        .content {
          padding: 32px 24px;
        }
        .content h2 {
          font-size: 20px;
          margin: 0 0 16px 0;
          color: #000;
          display: flex;
          align-items: center;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #000;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }
        .content-body {
          font-size: 16px;
          color: #333;
          white-space: pre-wrap;
        }
        .divider {
          height: 1px;
          background: #eee;
          margin: 24px 0;
        }
        .cta-section {
          text-align: center;
          padding: 24px;
          background: #f8f9fa;
        }
        .cta-button {
          display: inline-block;
          background: #000;
          color: white;
          padding: 14px 28px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
        }
        .footer {
          background: #f8f9fa;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .footer a {
          color: #000;
        }
        .church-info {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="type-badge">${typeLabels[newsletter.type]}</span>
          <h1>${newsletter.title}</h1>
          <p class="date">${currentDate}</p>
        </div>
        <div class="content">
          <h2><span class="dot"></span>교회 소식</h2>
          <div class="content-body">
${newsletter.content}
          </div>
        </div>
        <div class="cta-section">
          <p style="margin: 0 0 16px 0; color: #666;">더 많은 소식은 교회 웹사이트에서 확인하세요</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://korean-church-website.vercel.app'}" class="cta-button">
            웹사이트 방문하기
          </a>
        </div>
        <div class="footer">
          <p><strong>스테이트 칼리지 한인교회</strong></p>
          <div class="church-info">
            <p>758 Glenn Rd, State College, PA 16803</p>
            <p>전화: (814) 380-9393 | 이메일: KyuHongYeon@gmail.com</p>
          </div>
          <p style="margin-top: 16px;">
            이 메일은 교회 소식 구독자에게 발송되었습니다.<br>
            구독을 취소하시려면 <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://korean-church-website.vercel.app'}/unsubscribe">여기</a>를 클릭하세요.
          </p>
          <p style="margin-top: 8px;">© 2025 State College Korean Church. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
