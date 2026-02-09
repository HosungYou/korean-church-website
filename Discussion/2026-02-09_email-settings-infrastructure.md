# Discussion: 이메일 발송 설정 및 인프라 구조 정리

## 날짜: 2026-02-09

## 참여자
- 관리자 (교회 담당자)
- Claude Code (개발 지원)

---

## 1. 뉴스레터 이메일 발송 시스템

### 현재 상태
- 구독자 관리: 완료 (emailService.ts)
- 뉴스레터 작성 UI: 완료 (admin/newsletter.tsx)
- 이메일 발송 API: 반만 완료 (Resend API 코드 존재하나 프론트엔드와 미연결)
- 이메일 템플릿: 완료 (한국어 HTML 템플릿)

### 핵심 문제점
1. **프론트엔드 ↔ API 미연결**: newsletter.tsx는 sendNewsletterToSubscribers()를 호출하지만, 이 함수는 console.log만 찍고 실제 이메일을 발송하지 않음
2. **Resend API 키 미설정**: 환경변수 RESEND_API_KEY가 Vercel에 설정되지 않음
3. **발신자 주소 하드코딩**: noreply@statecollegekoreanchurch.org가 API에 하드코딩됨

### 결정 사항
- **이메일 서비스**: Resend 사용 (무료 100통/일, 이미 코드 존재)
- **발신자 주소**: newsletter@sckc.org (sckc.org 도메인 활용)
- **답장 수신 주소**: 관리자 Gmail (KyuHongYeon@gmail.com) → Reply-To 헤더로 설정
- **관리 방식**: 대시보드에서 발신자 이름/주소/답장 주소 설정 가능하도록 site_settings 테이블 생성

### 구현 완료 항목
- site_settings 테이블 생성 (Supabase)
- siteSettingsService.ts 생성 (CRUD 서비스)
- newsletter.tsx에 이메일 설정 UI 추가
- newsletter API에서 DB 설정 읽도록 수정

### 다음 단계 (P0 - 필수)
1. **Resend 계정 생성**: https://resend.com 에서 무료 계정 생성
2. **API 키 발급**: Resend 대시보드 → API Keys → 새 키 생성
3. **Vercel 환경변수 설정**: RESEND_API_KEY=re_xxxxxxxxxx
4. **DNS 레코드 추가** (Network Solutions → sckc.org):
   - SPF 레코드 (TXT): Resend 이메일 인증
   - DKIM 레코드 (TXT): Resend 이메일 서명
   - DMARC 레코드 (TXT): 이메일 정책

---

## 2. 인프라 구조 및 AWS 구독

### 현재 인프라
| 서비스 | 용도 | 비용 |
|--------|------|------|
| Vercel | 웹사이트 호스팅 (프론트엔드) | 무료 |
| Supabase | PostgreSQL DB + Auth + Storage | 무료 |
| Network Solutions | sckc.org 도메인 등록 + DNS 관리 | 도메인 갱신비 |
| Resend (예정) | 이메일 발송 | 무료 (100통/일) |

### AWS 구독 관련
- **결론**: Vercel + Supabase + Resend 이전 완료 시 AWS 취소 가능
- AWS에서 EC2, SES, S3, Route53, RDS 모두 대체됨
- **주의**: AWS 콘솔에서 활성 서비스 확인 후 취소 권장

### 도메인 관리 (sckc.org)
- **등록 기관**: Network Solutions (https://www.networksolutions.com)
- **갱신 알림**: Gmail로 수신 → 직접 갱신 필요
- **DNS 역할**: Vercel 연결 (A/CNAME) + 향후 Resend 이메일 인증 (SPF/DKIM/DMARC)

---

## 3. 이번 세션 수정 내역

### CSP (Content Security Policy) 수정
- `style-src`에 `https://cdn.jsdelivr.net` 추가 (Pretendard 폰트)
- `font-src`에 `https://cdn.jsdelivr.net` 추가
- `frame-src`에 `https://*.supabase.co` 추가 (주보 PDF 미리보기)

### Supabase Storage
- `training` 버킷 생성 (public, 50MB 제한)
- 허용 MIME: PDF, MP4, WebM, MPEG, JPEG, PNG, WebP
- RLS 정책 4개 적용 (읽기: 전체, 쓰기/수정/삭제: 인증 사용자)

### 새가족 등록 링크
- 홈페이지 빠른 접근: `/missions/new-family` → `/about/new-family-registration` 수정

### site_settings 테이블
- 이메일 발신자 이름, 주소, 답장 주소 저장
- 관리자 대시보드에서 설정 변경 가능

---

## 4. Gmail로 발송 가능 여부

**Gmail 주소로 직접 발송은 불가.** Gmail은 외부 서비스(Resend)를 통한 From 발송을 차단함.

**최적의 방법:**
| 항목 | 설정 | 설명 |
|------|------|------|
| 발신자 (From) | newsletter@sckc.org | sckc.org 도메인으로 발송 (전문적) |
| 답장 수신 (Reply-To) | KyuHongYeon@gmail.com | 답장은 목사님 Gmail로 도착 |

---

## 5. 향후 작업 우선순위

| 우선순위 | 작업 | 설명 |
|----------|------|------|
| P0 | Resend 계정 + API 키 | 이메일 발송 기능 활성화 |
| P0 | DNS 레코드 추가 | sckc.org 이메일 인증 |
| P1 | newsletter_logs 테이블 | 발송 기록 저장 |
| P1 | 발송 내역 UI | 언제, 몇 명에게, 성공/실패 조회 |
| P2 | 이메일 미리보기 | 발송 전 HTML 미리보기 |
| P2 | AWS 서비스 정리 | 사용 중인 서비스 확인 후 취소 |
