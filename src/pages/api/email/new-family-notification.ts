import type { NextApiRequest, NextApiResponse } from 'next'

// Resend API 사용 (또는 다른 이메일 서비스)
// npm install resend

interface NewFamilyRegistration {
  id: string
  korean_name: string
  english_name?: string
  birth_date?: string
  gender?: string
  phone: string
  email?: string
  city: string
  state: string
  submitted_at: string
}

interface RequestBody {
  registration: NewFamilyRegistration
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { registration } = req.body as RequestBody

    if (!registration) {
      return res.status(400).json({ error: 'Registration data is required' })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error('ADMIN_EMAIL environment variable is not set')
      return res.status(500).json({ error: 'Admin email not configured' })
    }
    const resendApiKey = process.env.RESEND_API_KEY

    // 이메일 내용 생성
    const emailHtml = generateNewFamilyEmailTemplate(registration)

    // Resend API를 사용한 이메일 발송
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'State College Korean Church <noreply@statecollegekoreanchurch.org>',
          to: adminEmail,
          subject: `[새가족 등록] ${registration.korean_name}님이 등록하셨습니다`,
          html: emailHtml,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Resend API 오류:', error)
        // 이메일 발송 실패해도 등록은 완료된 것으로 처리
        return res.status(200).json({
          success: true,
          emailSent: false,
          message: '등록은 완료되었으나 이메일 발송에 실패했습니다.'
        })
      }

      return res.status(200).json({ success: true, emailSent: true })
    } else {
      // API 키가 없으면 로그만 출력 (PII 제외)
      console.log('=== 새가족 등록 알림 ===')
      console.log(`등록 ID: ${registration.id}`)
      console.log('RESEND_API_KEY가 설정되지 않아 이메일이 발송되지 않았습니다.')
      console.log('========================')

      return res.status(200).json({
        success: true,
        emailSent: false,
        message: 'RESEND_API_KEY가 설정되지 않아 이메일이 발송되지 않았습니다.'
      })
    }
  } catch (error) {
    console.error('이메일 발송 오류:', error)
    return res.status(500).json({ error: '이메일 발송 중 오류가 발생했습니다.' })
  }
}

function generateNewFamilyEmailTemplate(registration: NewFamilyRegistration): string {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>새가족 등록 알림</title>
      <style>
        body {
          font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', Arial, sans-serif;
          line-height: 1.6;
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
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 8px 0 0 0;
          opacity: 0.8;
          font-size: 14px;
        }
        .content {
          padding: 24px;
        }
        .info-section {
          margin-bottom: 24px;
        }
        .info-section h2 {
          font-size: 16px;
          color: #000;
          margin: 0 0 12px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #000;
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
        .info-row {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .info-label {
          width: 120px;
          font-weight: 600;
          color: #666;
        }
        .info-value {
          flex: 1;
          color: #333;
        }
        .highlight {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }
        .highlight p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        .cta-button {
          display: inline-block;
          background: #000;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 16px;
        }
        .footer {
          background: #f8f9fa;
          padding: 16px 24px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>새가족 등록 알림</h1>
          <p>스테이트 칼리지 한인교회</p>
        </div>
        <div class="content">
          <div class="info-section">
            <h2><span class="dot"></span>새가족 정보</h2>
            <div class="info-row">
              <span class="info-label">한국 이름</span>
              <span class="info-value">${registration.korean_name}</span>
            </div>
            ${registration.english_name ? `
            <div class="info-row">
              <span class="info-label">영어 이름</span>
              <span class="info-value">${registration.english_name}</span>
            </div>
            ` : ''}
            ${registration.birth_date ? `
            <div class="info-row">
              <span class="info-label">생년월일</span>
              <span class="info-value">${registration.birth_date}</span>
            </div>
            ` : ''}
            ${registration.gender ? `
            <div class="info-row">
              <span class="info-label">성별</span>
              <span class="info-value">${registration.gender === 'male' ? '남성' : '여성'}</span>
            </div>
            ` : ''}
          </div>

          <div class="info-section">
            <h2><span class="dot"></span>연락처</h2>
            <div class="info-row">
              <span class="info-label">전화번호</span>
              <span class="info-value">${registration.phone}</span>
            </div>
            ${registration.email ? `
            <div class="info-row">
              <span class="info-label">이메일</span>
              <span class="info-value">${registration.email}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">지역</span>
              <span class="info-value">${registration.city}, ${registration.state}</span>
            </div>
          </div>

          <div class="highlight">
            <p><strong>등록 일시:</strong> ${formatDate(registration.submitted_at)}</p>
            <p style="margin-top: 8px;">관리자 페이지에서 상세 정보를 확인하고 연락해주세요.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://korean-church-website.vercel.app'}/admin/new-families" class="cta-button">
              관리자 페이지에서 확인하기
            </a>
          </div>
        </div>
        <div class="footer">
          <p>이 메일은 새가족 등록 시 자동으로 발송됩니다.</p>
          <p>© 2025 State College Korean Church. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
