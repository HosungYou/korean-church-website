# Architecture.md

한국교회 웹사이트 프로젝트의 전체 아키텍처를 문서화합니다.

---

## 1. 프로젝트 개요

- **프로젝트명**: SCKC (Southern California Korean Church) Website
- **기술 스택**: Next.js 14 + TypeScript + Tailwind CSS + Supabase
- **배포**: Vercel
- **디자인 시스템**: VS Design Diverge (OKLCH 색상 시스템)

---

## 2. 디렉토리 구조

```
korean-church-website/
├── lib/                          # Supabase 클라이언트
│   ├── supabase.ts               # Server-side Supabase
│   └── supabaseClient.ts         # Client-side Supabase
├── public/
│   ├── images/                   # 정적 이미지
│   └── locales/                  # 다국어 번역 파일
│       ├── ko/                   # 한국어
│       │   ├── common.json
│       │   ├── home.json
│       │   ├── about.json
│       │   ├── worship.json
│       │   ├── training.json
│       │   └── ...
│       └── en/                   # 영어
│           └── ...
├── src/
│   ├── components/               # 공통 컴포넌트
│   │   ├── Layout.tsx            # 사용자 페이지 레이아웃
│   │   ├── AdminLayout.tsx       # 관리자 레이아웃
│   │   ├── PageHeader.tsx        # 페이지 헤더
│   │   ├── HeroSlider.tsx        # 메인 슬라이더
│   │   ├── FileUpload.tsx        # 파일 업로드
│   │   └── AdminLoginForm.tsx    # 관리자 로그인 폼
│   ├── hooks/
│   │   └── useAdminAuth.ts       # 관리자 인증 훅
│   ├── pages/                    # Next.js 페이지
│   │   ├── _app.tsx              # App 엔트리포인트
│   │   ├── _document.tsx         # HTML Document
│   │   ├── _error.tsx            # 에러 페이지
│   │   ├── index.tsx             # 홈페이지
│   │   ├── about/                # 교회 소개
│   │   ├── admin/                # 관리자 페이지
│   │   ├── community/            # 커뮤니티
│   │   ├── education/            # 교육부서
│   │   ├── missions/             # 선교
│   │   ├── news/                 # 소식
│   │   ├── sermons/              # 설교
│   │   ├── training/             # 훈련 프로그램
│   │   └── auth/                 # 인증
│   ├── styles/
│   │   └── globals.css           # 전역 스타일
│   └── utils/                    # 서비스 레이어
│       ├── adminService.ts       # 관리자 서비스
│       ├── bibleReadingService.ts
│       ├── bulletinService.ts    # 주보 서비스
│       ├── emailService.ts       # 이메일 서비스
│       ├── fileUploadService.ts  # 파일 업로드
│       ├── galleryService.ts     # 갤러리 서비스
│       ├── heroSlideService.ts   # 슬라이더 서비스
│       ├── memberService.ts      # 교인 서비스
│       ├── newFamilyService.ts   # 새가족 서비스
│       ├── postService.ts        # 게시글 서비스
│       ├── sermonService.ts      # 설교 서비스
│       ├── subscriberService.ts  # 구독자 서비스
│       └── trainingService.ts    # 훈련 프로그램 서비스
├── CLAUDE.md                     # Claude Code 지침서
├── Architecture.md               # 아키텍처 문서 (이 파일)
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 3. 페이지 라우팅 구조

### 3.1 공개 페이지

```
/                           # 홈페이지
│
├── /about                  # 교회 소개
│   ├── /greeting           # 인사말
│   ├── /philosophy         # 교회 철학
│   ├── /history            # 교회 연혁
│   ├── /ministers          # 교역자 소개
│   ├── /service-info       # 예배 안내 (#giving 섹션 포함)
│   └── /directions         # 오시는 길
│
├── /sermons                # 설교
│   ├── /sunday             # 주일예배
│   ├── /wednesday          # 수요예배
│   ├── /friday             # 금요기도회
│   └── /special-praise     # 특별찬양
│
├── /education              # 교육부서
│   ├── /infants            # 영아부
│   ├── /kindergarten       # 유치부
│   ├── /elementary         # 초등부
│   ├── /youth              # 청소년부
│   ├── /young-adults       # 청년부
│   ├── /korean-school      # 한글학교
│   └── /training           # 훈련 프로그램
│
├── /missions               # 선교
│   ├── /new-family         # 새가족 안내
│   ├── /discipleship       # 제자훈련
│   ├── /domestic           # 국내선교
│   ├── /international      # 해외선교
│   ├── /missionary-support # 선교사 후원
│   ├── /short-term         # 단기선교
│   └── /relief             # 구제사역
│
├── /news                   # 소식
│   ├── /announcements      # 공지사항
│   ├── /bulletin           # 주보
│   ├── /gallery            # 사진첩
│   └── /posts/[id]         # 게시글 상세
│
├── /training               # 훈련 프로그램 (퍼블릭)
│   ├── /                   # 목록
│   └── /[id]               # 상세
│
├── /community
│   └── /settlement-info    # 정착 정보
│
├── /worship                # 예배 안내
├── /bible-reading          # 성경읽기표
├── /prayer-requests        # 중보기도
├── /giving                 # 헌금 안내 → /about/service-info#giving 리다이렉트
├── /korean-school          # 한글학교
├── /announcements          # 공지사항
├── /gallery                # 갤러리
└── /bulletin               # 주보
```

### 3.2 관리자 페이지 (`/admin`)

```
/admin
├── /login                  # 로그인
├── /dashboard              # 대시보드
│
├── /slides                 # 슬라이더 관리
│   └── /index
│
├── /sermons                # 설교 관리
│   ├── /index
│   ├── /new
│   └── /[id]
│
├── /gallery                # 갤러리 관리
│   ├── /index
│   ├── /new
│   └── /[id]
│
├── /bible-reading          # 성경읽기표 관리
│   └── /index
│
├── /bulletins              # 주보 관리
│   └── /index
│
├── /posts                  # 게시글 관리
│   ├── /index
│   ├── /new
│   └── /[id]
│
├── /training               # 훈련 관리 (새가족 양육, 제자훈련)
│   ├── /index
│   ├── /new
│   └── /[id]
│
├── /new-families           # 새가족 관리
│   └── /index
│
├── /subscribers            # 구독자 관리
│   └── /index
│
├── /members                # 교인 관리
│   ├── /index
│   └── /new
│
├── /newsletter             # 뉴스레터
│
└── /admins                 # 관리자 관리
    └── /index
```

---

## 4. 컴포넌트 아키텍처

### 4.1 레이아웃 컴포넌트

```
┌─────────────────────────────────────────────────────────────────┐
│                          Layout.tsx                              │
│  (공개 페이지용)                                                  │
│  ├── Navigation                                                  │
│  ├── {children}                                                  │
│  └── Footer                                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       AdminLayout.tsx                            │
│  (관리자 페이지용)                                                │
│  ├── Sidebar (Deep Indigo)                                       │
│  │   ├── Logo                                                    │
│  │   ├── menuItems[]                                             │
│  │   │   ├── 대시보드                                            │
│  │   │   ├── 슬라이더/배너                                       │
│  │   │   ├── 설교 관리                                           │
│  │   │   ├── 갤러리 관리                                         │
│  │   │   ├── 성경읽기표                                          │
│  │   │   ├── 주보 관리                                           │
│  │   │   ├── 게시글 관리                                         │
│  │   │   ├── 훈련 관리 ← NEW (새가족 양육, 제자훈련)              │
│  │   │   ├── 새가족 관리                                         │
│  │   │   ├── 구독자 관리                                         │
│  │   │   ├── 교인 관리                                           │
│  │   │   ├── 뉴스레터                                            │
│  │   │   └── 관리자 관리                                         │
│  │   └── User Section                                            │
│  └── Main Content                                                │
│      ├── Header (title, subtitle)                                │
│      └── {children}                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 공통 컴포넌트

| 컴포넌트 | 용도 | 위치 |
|----------|------|------|
| `Layout` | 공개 페이지 레이아웃 | `src/components/Layout.tsx` |
| `AdminLayout` | 관리자 페이지 레이아웃 | `src/components/AdminLayout.tsx` |
| `PageHeader` | 페이지 헤더 (Editorial 스타일) | `src/components/PageHeader.tsx` |
| `HeroSlider` | 메인 슬라이더 | `src/components/HeroSlider.tsx` |
| `FileUpload` | 파일 업로드 | `src/components/FileUpload.tsx` |
| `AdminLoginForm` | 관리자 로그인 폼 | `src/components/AdminLoginForm.tsx` |

---

## 5. 서비스 레이어

### 5.1 서비스 패턴

모든 서비스는 다음 패턴을 따릅니다:

```typescript
// src/utils/[domain]Service.ts

import { supabase } from '../../lib/supabase'

// 1. Supabase Row 인터페이스 (snake_case)
interface Supabase[Domain]Row {
  id: string
  field_name: string  // snake_case
  created_at: string
}

// 2. 앱 인터페이스 (camelCase)
export interface [Domain]Record {
  id: string
  fieldName: string   // camelCase
  createdAt: string
}

// 3. 매핑 함수
const map[Domain]Row = (row: Supabase[Domain]Row): [Domain]Record => ({
  id: row.id,
  fieldName: row.field_name,
  createdAt: row.created_at,
})

// 4. CRUD 함수
export const create[Domain] = async (input: Create[Domain]Input): Promise<string> => { ... }
export const get[Domain]ById = async (id: string): Promise<[Domain]Record | null> => { ... }
export const getAll[Domain]s = async (): Promise<[Domain]Record[]> => { ... }
export const update[Domain] = async (id: string, input: Update[Domain]Input): Promise<void> => { ... }
export const delete[Domain] = async (id: string): Promise<void> => { ... }
```

### 5.2 서비스 목록

| 서비스 | 테이블 | 용도 |
|--------|--------|------|
| `adminService.ts` | `admins` | 관리자 관리 |
| `bibleReadingService.ts` | `bible_reading_plans` | 성경읽기표 |
| `bulletinService.ts` | `bulletins` | 주보 관리 |
| `emailService.ts` | - | 이메일 발송 |
| `fileUploadService.ts` | Supabase Storage | 파일 업로드 |
| `galleryService.ts` | `gallery_albums`, `gallery_photos` | 갤러리 |
| `heroSlideService.ts` | `hero_slides` | 메인 슬라이더 |
| `memberService.ts` | `members` | 교인 관리 |
| `newFamilyService.ts` | `new_families` | 새가족 등록 |
| `postService.ts` | `posts` | 게시글 관리 |
| `sermonService.ts` | `sermons` | 설교 관리 |
| `subscriberService.ts` | `email_subscribers` | 이메일 구독 |
| `trainingService.ts` | `training_programs` | 훈련 프로그램 |

---

## 6. 데이터베이스 스키마

### 6.1 주요 테이블

```sql
-- posts (게시글)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'announcement',   -- announcement, event, general
    category VARCHAR(50) DEFAULT 'general',    -- general, wednesday, sunday, bible
    status VARCHAR(50) DEFAULT 'draft',        -- draft, published
    author_email VARCHAR(255),
    author_name VARCHAR(255),
    cover_image_url TEXT,
    excerpt VARCHAR(300),
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- training_programs (훈련 프로그램)
CREATE TABLE training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,             -- new_family, discipleship, bible_study, leadership, baptism, general
    type VARCHAR(50) DEFAULT 'lesson',         -- lesson, resource, announcement
    status VARCHAR(50) DEFAULT 'draft',
    author_email VARCHAR(255),
    author_name VARCHAR(255),
    cover_image_url TEXT,
    excerpt VARCHAR(300),
    sort_order INTEGER DEFAULT 0,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- sermons (설교)
CREATE TABLE sermons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    preacher VARCHAR(255),
    date DATE,
    video_url TEXT,
    audio_url TEXT,
    scripture VARCHAR(500),
    category VARCHAR(50),                      -- sunday, wednesday, friday, special
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- hero_slides (메인 슬라이더)
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500),
    subtitle VARCHAR(500),
    image_url TEXT NOT NULL,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- email_subscribers (이메일 구독자)
CREATE TABLE email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- admins (관리자)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.2 카테고리 타입

```typescript
// 게시글 카테고리
type PostCategory = 'general' | 'wednesday' | 'sunday' | 'bible'

// 게시글 타입
type PostType = 'announcement' | 'event' | 'general'

// 훈련 프로그램 카테고리
type ProgramCategory =
  | 'new_family'      // 새가족 양육
  | 'discipleship'    // 제자훈련
  | 'bible_study'     // 성경공부
  | 'leadership'      // 리더십
  | 'baptism'         // 세례교육
  | 'general'         // 일반

// 훈련 프로그램 타입
type ProgramType = 'lesson' | 'resource' | 'announcement'
```

---

## 7. 디자인 시스템: VS Design Diverge

### 7.1 OKLCH 색상 시스템

```css
/* Primary - Deep Indigo (한복 청색) */
--church-primary-500: oklch(0.45 0.12 265);
--church-primary-700: oklch(0.30 0.09 265);
--church-primary-900: oklch(0.15 0.05 265);

/* Accent - Liturgical Gold (절제된 금색) */
--church-accent: oklch(0.72 0.10 75);

/* Neutral - Warm Grays (한지 느낌) */
--church-neutral-50: oklch(0.985 0.003 75);
--church-neutral-200: oklch(0.92 0.005 75);
--church-neutral-500: oklch(0.55 0.01 75);
--church-neutral-900: oklch(0.15 0.004 75);
```

### 7.2 카테고리별 색상

```typescript
const CATEGORY_COLORS: Record<ProgramCategory, string> = {
  new_family: 'oklch(0.55 0.15 340)',    // 로즈핑크
  discipleship: 'oklch(0.45 0.12 265)',  // 진한 인디고
  bible_study: 'oklch(0.55 0.15 145)',   // 녹색
  leadership: 'oklch(0.60 0.18 25)',     // 주황색
  baptism: 'oklch(0.55 0.18 200)',       // 파란색
  general: 'oklch(0.72 0.10 75)',        // 골드
}
```

### 7.3 디자인 원칙

1. **Editorial Minimalism**: Kinfolk 매거진 스타일의 절제된 디자인
2. **한국적 미학**: 한복 청색, 한지 텍스처, 한글 타이포그래피
3. **OKLCH 색공간**: 더 풍부한 그라디언트와 색상 표현
4. **Sharp corners**: `rounded-sm` 사용 (둥근 모서리 지양)
5. **Grain texture**: 한지 느낌의 grain overlay

---

## 8. 인증 시스템

### 8.1 Supabase Auth 플로우

```
┌──────────────────────────────────────────────────────────────────┐
│                        인증 플로우                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [관리자 로그인]                                                   │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────┐     ┌─────────────────┐                     │
│  │ AdminLoginForm  │────>│  Supabase Auth  │                     │
│  │ (Email/Google)  │     │  signInWithOAuth│                     │
│  └─────────────────┘     └────────┬────────┘                     │
│                                   │                               │
│       ┌───────────────────────────┘                               │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────┐     ┌─────────────────┐                     │
│  │ /auth/callback  │────>│  admins 테이블   │                     │
│  │                 │     │  권한 확인       │                     │
│  └─────────────────┘     └────────┬────────┘                     │
│                                   │                               │
│       ┌───────────────────────────┘                               │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────┐                                              │
│  │ useAdminAuth()  │  ← 모든 관리자 페이지에서 사용                 │
│  │ - user          │                                              │
│  │ - loading       │                                              │
│  │ - isAuthenticated│                                             │
│  │ - signOut       │                                              │
│  └─────────────────┘                                              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 8.2 useAdminAuth 훅

```typescript
// src/hooks/useAdminAuth.ts
const { admin, loading, signOut } = useAdminAuth()

// admin 객체
interface Admin {
  id: string
  email: string
  name: string
  role: string
}
```

---

## 9. 다국어 지원 (i18n)

### 9.1 번역 파일 구조

```
public/locales/
├── ko/                    # 한국어
│   ├── common.json        # 공통 텍스트
│   ├── home.json          # 홈페이지
│   ├── about.json         # 교회 소개
│   ├── worship.json       # 예배
│   ├── training.json      # 훈련
│   └── ...
└── en/                    # 영어
    └── ...
```

### 9.2 사용 패턴

```typescript
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Page = () => {
  const { t, i18n } = useTranslation('common')
  return <h1>{t('greeting')}</h1>
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'navigation'])),
  },
})
```

---

## 10. 파일 변경 시 업데이트 체크리스트

### 10.1 새 페이지 추가 시

- [ ] `src/pages/` 에 페이지 파일 생성
- [ ] `Layout` 또는 `AdminLayout` 래핑
- [ ] `serverSideTranslations` 설정
- [ ] `public/locales/ko/`, `public/locales/en/` 번역 추가
- [ ] 네비게이션에 링크 추가 (필요 시)
- [ ] VS Design Diverge 스타일 적용

### 10.2 새 관리자 기능 추가 시

- [ ] `src/pages/admin/` 에 페이지 생성
- [ ] `src/utils/[domain]Service.ts` 서비스 파일 생성
- [ ] `src/components/AdminLayout.tsx` menuItems에 추가
- [ ] Supabase 테이블 생성 (필요 시)
- [ ] VS Design Diverge OKLCH 색상 적용

### 10.3 새 서비스 추가 시

- [ ] `src/utils/[domain]Service.ts` 파일 생성
- [ ] Supabase Row ↔ Record 매핑 함수
- [ ] CRUD 함수 구현
- [ ] TypeScript 인터페이스 정의

---

## 11. 버전 히스토리

| 버전 | 날짜 | 주요 변경 |
|------|------|----------|
| v2.5.0 | 2025-01-19 | 네비게이션 재구조화, 새가족 양육 카테고리 분리, 관리자 테마 적용 |
| v2.4.0 | 2025-01-18 | 훈련 프로그램 시스템 구축 |
| v2.3.0 | 2025-01-17 | 예배 안내 페이지 통합, 헌금 안내 리다이렉트 |
| v2.2.0 | 2025-01-16 | VS Design Diverge 디자인 시스템 적용 |

---

## 12. 관련 문서

- **CLAUDE.md**: Claude Code 상세 지침서
- **DOCS/architecture/**: ADR (Architecture Decision Records)
- **DOCS/project-management/action-items.md**: 작업 항목
