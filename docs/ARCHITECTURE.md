# 프로젝트 아키텍처

## 기술 스택

- **프레임워크**: Next.js 14 (Pages Router)
- **언어**: TypeScript
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (Google OAuth, Email/Password)
- **스타일링**: Tailwind CSS
- **배포**: Vercel

## 디렉토리 구조

```
korean-church/
├── lib/                    # 외부 서비스 클라이언트
│   └── supabase.ts         # Supabase 클라이언트 (싱글톤)
├── src/
│   ├── components/         # 재사용 가능한 React 컴포넌트
│   │   ├── AdminLoginForm.tsx
│   │   ├── FileUpload.tsx
│   │   ├── HeroSlider.tsx
│   │   ├── Layout.tsx
│   │   └── PageHeader.tsx
│   ├── hooks/              # 커스텀 React 훅
│   │   └── useAdminAuth.ts # 관리자 인증 상태 관리
│   ├── pages/              # Next.js 페이지 라우터
│   │   ├── _app.tsx        # 앱 레이아웃
│   │   ├── _document.tsx   # HTML 문서 구조
│   │   ├── admin/          # 관리자 페이지
│   │   ├── api/            # API 라우트
│   │   ├── auth/           # 인증 관련 페이지
│   │   ├── about/          # 교회 소개
│   │   ├── education/      # 교육부서
│   │   ├── missions/       # 선교
│   │   ├── news/           # 소식
│   │   └── sermons/        # 예배/설교
│   ├── styles/             # 글로벌 스타일
│   └── utils/              # 비즈니스 로직 서비스
│       ├── emailService.ts     # 이메일 구독 관리
│       ├── fileUploadService.ts # 파일 업로드
│       ├── newFamilyService.ts  # 새가족 등록
│       └── postService.ts       # 게시글 CRUD
├── types/                  # TypeScript 타입 정의
│   └── supabase.ts         # Supabase 데이터베이스 타입
├── public/                 # 정적 파일
└── docs/                   # 문서
```

## 데이터 흐름

```
[사용자] → [Next.js 페이지] → [서비스 레이어 (utils/)] → [Supabase]
                ↓
         [React 컴포넌트]
                ↓
         [커스텀 훅 (hooks/)]
```

## Supabase 데이터베이스 테이블

| 테이블 | 설명 |
|--------|------|
| `profiles` | 사용자 프로필 (관리자 권한 관리) |
| `posts` | 게시글 (공지사항, 이벤트, 일반) |
| `prayer_requests` | 기도 요청 |
| `email_subscribers` | 이메일 구독자 |
| `newsletter_sent` | 발송된 뉴스레터 기록 |
| `new_families` | 새가족 등록 정보 |

## 인증 흐름

1. **Google OAuth 로그인**
   ```
   [로그인 버튼] → [Supabase OAuth] → [/auth/callback] → [profiles 테이블 확인] → [대시보드]
   ```

2. **이메일/비밀번호 로그인**
   ```
   [로그인 폼] → [Supabase signInWithPassword] → [profiles 테이블 확인] → [대시보드]
   ```

3. **관리자 권한 확인**
   - `profiles` 테이블의 `role` 필드가 `'admin'`인 경우에만 접근 허용

## 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 코드 스타일 가이드

### Import 경로
- 상대 경로 사용 권장: `../../lib/supabase`
- Path alias는 필요한 경우에만 사용

### Supabase 쿼리
- 싱글톤 클라이언트 사용: `import { supabase } from '../../lib/supabase'`
- TypeScript 타입 에러 시 `as any` 캐스팅 사용 가능

### 컴포넌트 구조
- 함수형 컴포넌트 사용
- Props 인터페이스 명시적 정의
- 한국어 텍스트에는 `font-korean` 클래스 적용
