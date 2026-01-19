# CLAUDE.md

Korean Church Website 프로젝트를 위한 Claude Code 지침서입니다.

---

## 1. 프로젝트 개요

### 기술 스택
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Authentication**: Supabase Auth (Google OAuth, Email/Password)
- **Database**: Supabase PostgreSQL
- **i18n**: next-i18next (한영 이중언어)
- **Deployment**: Vercel

### 프로젝트 구조
```
korean-church-website/
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트 (Client-side)
│   └── supabaseClient.ts    # Supabase Client
├── public/
│   └── locales/
│       ├── ko/              # 한국어 번역
│       └── en/              # 영어 번역
├── src/
│   ├── components/          # React 컴포넌트
│   ├── hooks/
│   │   └── useAdminAuth.ts  # 관리자 인증 훅 (Supabase Auth)
│   ├── pages/
│   │   ├── admin/           # 관리자 페이지
│   │   ├── about/           # 교회 소개
│   │   ├── education/       # 교육부서
│   │   ├── missions/        # 선교
│   │   ├── news/            # 소식
│   │   ├── sermons/         # 설교
│   │   └── training/        # 훈련 프로그램
│   └── utils/
│       ├── postService.ts   # 게시글 서비스 (Supabase)
│       ├── trainingService.ts # 훈련 프로그램 서비스
│       └── ...              # 기타 서비스 파일
├── Architecture.md          # 전체 아키텍처 문서 (상세)
├── CLAUDE.md               # Claude Code 지침서 (이 파일)
└── DOCS/                    # 프로젝트 문서화
```

### 아키텍처 문서 참조

> **중요**: 프로젝트의 전체 아키텍처, 페이지 라우팅 구조, 데이터베이스 스키마, 컴포넌트 구조는 **`Architecture.md`** 파일을 참조하세요.
>
> **구조 변경 시 필수 사항**:
> 1. `Architecture.md` 파일을 먼저 읽고 현재 구조를 파악
> 2. 변경 후 `Architecture.md` 업데이트
> 3. 변경 체크리스트 (Architecture.md 섹션 10) 확인

---

## 2. Sub-Agent 시스템

### 2.1 도메인 에이전트 정의

| Agent | Tier | 범위 | 트리거 파일 패턴 |
|-------|------|------|------------------|
| **F1-FrontendAgent** | 2 (Sonnet) | UI/UX, React 컴포넌트 | `src/components/**`, `src/pages/**/*.tsx` |
| **F2-AuthAgent** | 2 (Sonnet) | Supabase Auth, 관리자 인증 | `lib/supabase*.ts`, `src/hooks/useAdminAuth.ts` |
| **F3-SupabaseAgent** | 2 (Sonnet) | Supabase PostgreSQL | `lib/supabase*.ts`, `src/utils/*Service.ts` |
| **F4-i18nAgent** | 2 (Sonnet) | 한영 번역, 다국어 | `public/locales/**/*.json` |
| **F5-ContentAgent** | 3 (Haiku) | 설교, 공지, 교육 | `src/pages/news/**`, `src/pages/sermons/**` |
| **F6-AdminAgent** | 2 (Sonnet) | 관리자 대시보드 | `src/pages/admin/**` |
| **F7-SEOAgent** | 3 (Haiku) | SEO, 성능 최적화 | `next.config.js`, `src/pages/_document.tsx` |

### 2.2 트리거 키워드

```yaml
F1-FrontendAgent:
  - "component", "UI", "styling", "Tailwind", "responsive"
  - "레이아웃", "컴포넌트", "스타일", "디자인"

F2-AuthAgent:
  - "auth", "Supabase", "login", "logout", "Google OAuth"
  - "인증", "로그인", "로그아웃", "관리자 권한"

F3-SupabaseAgent:
  - "Supabase", "PostgreSQL", "database", "table", "query"
  - "데이터베이스", "게시글", "테이블", "쿼리"

F4-i18nAgent:
  - "translation", "i18n", "language", "locale"
  - "번역", "다국어", "한국어", "영어"

F5-ContentAgent:
  - "post", "sermon", "announcement", "event"
  - "설교", "공지", "공지사항", "교육부서"

F6-AdminAgent:
  - "admin", "dashboard", "관리자"
  - "대시보드", "관리 페이지"

F7-SEOAgent:
  - "SEO", "performance", "lighthouse", "meta"
  - "검색최적화", "성능", "메타태그"
```

### 2.3 복잡도 기반 라우팅

| 복잡도 | Tier | 모델 | 예시 |
|--------|------|------|------|
| Low | 4 | Haiku | 오타 수정, 번역 키 추가 |
| Medium | 3 | Haiku | 새 페이지, 간단한 컴포넌트 |
| High | 2 | Sonnet | Auth 수정, 새 기능 구현 |
| Critical | 1 | Opus | 아키텍처 변경, 보안 수정 |

### 2.4 병렬 실행 그룹

```
┌─────────────────────────────────────────────────────────────────┐
│                    병렬 실행 가능 그룹                           │
├─────────────────────────────────────────────────────────────────┤
│ 그룹 1: UI 관련                                                 │
│   F1-FrontendAgent + F4-i18nAgent                              │
│                                                                 │
│ 그룹 2: 데이터 관련                                             │
│   F3-SupabaseAgent + F5-ContentAgent                           │
│                                                                 │
│ 그룹 3: 관리자 관련                                             │
│   F2-AuthAgent + F6-AdminAgent                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 코드 패턴

### 3.1 i18n 사용 패턴

```typescript
import { useTranslation } from 'next-i18next'

const MyComponent = () => {
  const { t, i18n } = useTranslation('common')

  // 언어별 폰트 클래스
  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  return <div className={fontClass}>{t('greeting')}</div>
}

// SSR/SSG에서 번역 로드
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'navigation'])),
  },
})
```

### 3.2 관리자 인증 패턴

```typescript
import { useAdminAuth } from '@/hooks/useAdminAuth'

const AdminPage = () => {
  const { user, loading, isAuthenticated, logout } = useAdminAuth()

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return null // 자동 리다이렉트됨

  return (
    <div>
      <p>안녕하세요, {user?.name}님</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  )
}
```

### 3.3 Supabase 서비스 패턴

```typescript
// src/utils/[domain]Service.ts
import { supabase } from '../../lib/supabase'

// snake_case (DB) ↔ camelCase (JS) 매핑
interface SupabasePostRow {
  id: string
  title: string
  content: string
  cover_image_url: string | null
  created_at: string
  published_at: string | null
}

export interface PostRecord {
  id: string
  title: string
  content: string
  coverImageUrl: string | null
  createdAt: string
  publishedAt: string | null
}

const mapPostRow = (row: SupabasePostRow): PostRecord => ({
  id: row.id,
  title: row.title,
  content: row.content,
  coverImageUrl: row.cover_image_url,
  createdAt: row.created_at,
  publishedAt: row.published_at
})

export const createPost = async (input: CreatePostInput): Promise<string> => {
  if (!supabase) throw new Error('Supabase가 초기화되지 않았습니다.')

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: input.title,
      content: input.content,
      cover_image_url: input.coverImageUrl,
      status: 'draft'
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export const getPostById = async (id: string): Promise<PostRecord | null> => {
  if (!supabase) throw new Error('Supabase가 초기화되지 않았습니다.')

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapPostRow(data)
}
```

### 3.4 페이지 컴포넌트 패턴

```typescript
import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'

interface PageProps {
  // props 정의
}

const MyPage: NextPage<PageProps> = () => {
  const { t } = useTranslation('common')

  return (
    <Layout>
      <PageHeader title={t('page.title')} subtitle={t('page.subtitle')} />
      {/* 페이지 내용 */}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'navigation'])),
  },
})

export default MyPage
```

### 3.5 Supabase Realtime 패턴

```typescript
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'

const RealtimeComponent = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (!supabase) return

    // Realtime 구독 설정
    const channel = supabase
      .channel('table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'my_table' },
        (payload) => {
          // 변경 시 데이터 새로고침
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase!.removeChannel(channel)
    }
  }, [])

  return <div>{/* UI */}</div>
}
```

---

## 4. 세션 문서화 프로토콜

### 4.1 자동 세션 로그 트리거

다음 상황에서 세션 로그를 자동 생성합니다:
- 코드 리뷰 수행 시
- 새 기능 구현 완료 시
- 아키텍처 결정(ADR) 시
- 버그 수정 시
- 보안 관련 변경 시

### 4.2 세션 로그 위치

```
DOCS/.meta/sessions/YYYY-MM-DD_[주제].md
```

### 4.3 세션 로그 템플릿

```markdown
# Session: YYYY-MM-DD - [주제]

## Context
- Session ID: [uuid]
- Agents Used: [F1-FrontendAgent, F4-i18nAgent, ...]
- Files Modified: [파일 목록]

## Summary
[변경 사항 요약]

## Decisions
- **Decision**: [설명]
- **Rationale**: [이유]
- **Alternatives Considered**: [검토한 대안]

## Action Items
- [ ] [PREFIX-###] 항목 설명

## Next Steps
[권장 다음 단계]
```

---

## 5. Action Item 관리

### 5.1 접두사 시스템

| Prefix | 카테고리 | 우선순위 | 설명 |
|--------|----------|----------|------|
| `SEC-` | 보안 | Critical | 보안 취약점, 인증 문제 |
| `BUG-` | 버그 | High | 기능 오류, 크래시 |
| `FUNC-` | 기능 | Medium | 새 기능 요청 |
| `PERF-` | 성능 | Medium | 성능 최적화 |
| `I18N-` | 번역 | Low | 번역 추가/수정 |
| `STYLE-` | 스타일 | Low | UI/UX 개선 |
| `DOC-` | 문서 | Low | 문서화 필요 |

### 5.2 상태 표시

- 🔴 **Open**: 미해결
- 🟡 **In Progress**: 진행 중
- 🟢 **Completed**: 완료

### 5.3 Action Item 위치

```
DOCS/project-management/action-items.md
```

---

## 6. 사용자 확인 프로토콜

### 반드시 사용자 확인이 필요한 작업

1. **파일 삭제** - 어떤 파일이든 삭제 전 확인
2. **보안 관련 변경**
   - Supabase Auth 설정 변경
   - Supabase RLS (Row Level Security) 수정
   - API 키 관련 작업
3. **프로덕션 배포** - Vercel 배포 전 확인
4. **DB 스키마 변경** - PostgreSQL 테이블 구조 변경
5. **500KB 이상 의존성 추가** - 번들 크기 영향
6. **환경 변수 변경** - `.env` 파일 수정

---

## 7. 개발 명령어

### 로컬 개발

```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm run start

# 린트
npm run lint
```

### 환경 변수 (필수)

```bash
# Supabase (Client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Supabase (Server-side - API Routes에서만 사용)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 8. Supabase 데이터베이스 스키마

### 주요 테이블

```sql
-- posts 테이블
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'announcement',
    category VARCHAR(50) DEFAULT 'general',
    status VARCHAR(50) DEFAULT 'draft',
    author_email VARCHAR(255),
    author_name VARCHAR(255),
    cover_image_url TEXT,
    excerpt VARCHAR(300),
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- prayer_requests 테이블
CREATE TABLE prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- prayer_replies 테이블
CREATE TABLE prayer_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- email_subscribers 테이블
CREATE TABLE email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

---

## 9. 문서화 구조

```
DOCS/
├── .meta/
│   ├── sessions/           # 세션 로그
│   └── context.json        # 프로젝트 컨텍스트
├── architecture/
│   ├── README.md           # ADR 인덱스
│   └── ADR-XXX_*.md        # 아키텍처 결정 기록
├── features/
│   ├── auth/               # 인증 기능 문서
│   ├── i18n/               # 다국어 기능 문서
│   └── content/            # 콘텐츠 시스템 문서
└── project-management/
    ├── action-items.md     # 작업 항목
    ├── roadmap.md          # 로드맵
    └── changelog.md        # 변경 이력
```

---

## 10. 에이전트 자동 감지 예시

### 예시 1: 번역 요청

**사용자**: "메인 페이지에 '환영합니다' 텍스트 추가해줘"

**Claude Code 동작**:
```
감지된 키워드: 번역 관련
활성화 에이전트: F4-i18nAgent + F1-FrontendAgent
병렬 실행: 그룹 1 (UI 관련)
```

### 예시 2: 관리자 기능

**사용자**: "관리자 대시보드에 게시글 통계 추가"

**Claude Code 동작**:
```
감지된 키워드: 관리자, 대시보드, 게시글
활성화 에이전트: F6-AdminAgent + F3-SupabaseAgent
순차 실행: 데이터 조회 후 UI 구현
```

### 예시 3: 인증 문제

**사용자**: "로그인이 안 돼요"

**Claude Code 동작**:
```
감지된 키워드: 로그인, 인증
활성화 에이전트: F2-AuthAgent (Critical)
Tier 상승: 보안 관련 → Sonnet/Opus
```

---

## 11. 주요 참고 파일

| 파일 | 용도 |
|------|------|
| `DOCS/.meta/context.json` | 현재 프로젝트 상태 |
| `DOCS/project-management/action-items.md` | 작업 항목 목록 |
| `DOCS/architecture/README.md` | ADR 인덱스 |
| `lib/supabase.ts` | Supabase 클라이언트 설정 |
| `lib/supabaseAdmin.ts` | Supabase Admin 설정 |
| `src/hooks/useAdminAuth.ts` | 인증 훅 |
| `src/utils/postService.ts` | 게시글 서비스 |

---

## 12. VS Design Diverge 디자인 시스템

### 12.1 디자인 철학

**Editorial Minimalism + 한국적 미학**을 기반으로 한 디자인 시스템입니다.

- **핵심 콘셉트**: Kinfolk 매거진 스타일의 절제된 Editorial 디자인
- **컬러 아이덴티티**: 한복 청색(Deep Indigo) + Liturgical Gold(절제된 금색)
- **텍스처**: 한지 느낌의 grain overlay로 촉각적 질감 표현
- **타이포그래피**: 극단적 대비 (micro labels vs hero headlines)

### 12.2 OKLCH 색상 시스템

모든 색상은 **OKLCH 색공간**을 사용합니다 (더 풍부한 그라디언트 표현).

```css
/* Primary - Deep Indigo (한복 청색) */
--church-primary-500: oklch(0.45 0.12 265);    /* 기본 */
--church-primary-700: oklch(0.30 0.09 265);    /* 진한 */
--church-primary-900: oklch(0.15 0.05 265);    /* 가장 진한 */

/* Secondary - Warm Stone (한국 건축) */
--church-secondary-400: oklch(0.65 0.03 75);
--church-secondary-600: oklch(0.45 0.03 75);

/* Accent - Liturgical Gold (절제된 금색) */
--church-accent: oklch(0.72 0.10 75);          /* 기본 */
--church-accent-light: oklch(0.82 0.08 75);    /* 밝은 */
--church-accent-dark: oklch(0.58 0.11 75);     /* 어두운 */

/* Neutral - Warm Grays (한지 느낌) */
--church-neutral-50: oklch(0.985 0.003 75);    /* 배경 */
--church-neutral-200: oklch(0.92 0.005 75);    /* 카드 배경 */
--church-neutral-500: oklch(0.55 0.01 75);     /* 본문 텍스트 */
--church-neutral-900: oklch(0.15 0.004 75);    /* 헤드라인 */
```

### 12.3 인라인 스타일 사용 패턴

OKLCH 색상은 Tailwind 클래스와 `style` prop을 조합하여 사용:

```tsx
// ✅ 권장 패턴
<div
  className="p-8 rounded-sm transition-all duration-300"
  style={{
    background: 'oklch(0.985 0.003 75)',
    color: 'oklch(0.30 0.09 265)',
  }}
>

// ✅ 그라디언트 사용
<div
  style={{
    background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
  }}
/>

// ✅ 반투명 오버레이
<div
  style={{
    background: 'oklch(0.45 0.12 265 / 0.5)',  // 50% 투명도
  }}
/>
```

### 12.4 컴포넌트 클래스 (globals.css 정의됨)

```css
/* 카드 스타일 */
.card-paper     /* 한지 느낌 카드 - 내부 페이지용 */
.card-accent    /* 골드 악센트 카드 - 강조용 */

/* 버튼 스타일 */
.btn-primary    /* 기본 버튼 (indigo) */
.btn-secondary  /* 보조 버튼 (투명) */
.btn-accent     /* 강조 버튼 (gold) */

/* 텍스처 */
.bg-grain       /* grain 노이즈 오버레이 */
.bg-paper       /* 한지 텍스처 배경 */

/* 애니메이션 */
.stagger-1 ~ .stagger-6  /* 순차 애니메이션 딜레이 */
```

### 12.5 타이포그래피 규칙

```tsx
// 헤드라인 (극단적 크기)
<h1
  className="font-headline font-black"
  style={{
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    letterSpacing: '-0.03em',
    color: 'oklch(0.22 0.07 265)',
  }}
>

// 섹션 라벨 (작은 크기, 넓은 tracking)
<span
  className="text-xs font-medium tracking-[0.2em] uppercase"
  style={{ color: 'oklch(0.72 0.10 75)' }}
>

// 본문 텍스트
<p
  className="leading-relaxed"
  style={{ color: 'oklch(0.55 0.01 75)' }}
>
```

### 12.6 섹션 헤더 패턴

모든 섹션은 Editorial 스타일 헤더를 사용:

```tsx
{/* Editorial Section Header */}
<div className="mb-16">
  {/* Gold accent line */}
  <div
    className="h-0.5 w-12 mb-6"
    style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
  />

  {/* Micro label */}
  <span
    className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
    style={{ color: 'oklch(0.72 0.10 75)' }}
  >
    Section Label
  </span>

  {/* Main heading */}
  <h2
    className="font-headline font-black"
    style={{
      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
      letterSpacing: '-0.02em',
      color: 'oklch(0.30 0.09 265)',
    }}
  >
    섹션 제목
  </h2>
</div>
```

### 12.7 관리자 페이지 디자인 가이드

관리자 페이지도 동일한 디자인 시스템을 따르되, 다음 특징을 가짐:

```tsx
// 관리자 배경색 (약간 더 차분한 톤)
style={{ background: 'oklch(0.97 0.005 265)' }}

// 관리자 사이드바
style={{ background: 'oklch(0.15 0.05 265)' }}

// 데이터 테이블
<table className="w-full">
  <thead style={{ background: 'oklch(0.93 0.02 265)' }}>
  <tbody>
    <tr className="hover:bg-[oklch(0.97_0.01_265)]">
```

### 12.8 금지 사항

다음 패턴은 사용하지 않습니다:

```tsx
// ❌ 일반 hex/rgb 색상 사용 금지
className="bg-blue-500"
className="text-gray-600"
style={{ color: '#2d3a6b' }}

// ❌ 둥근 모서리 과다 사용 금지
className="rounded-2xl"  // rounded-sm 또는 rounded-none 사용

// ❌ 기본 그림자 사용 금지
className="shadow-lg"  // shadow-church-* 사용

// ❌ 대칭 레이아웃 지양
className="text-center"  // 좌측 정렬 선호 (Editorial 스타일)
```

### 12.9 새 페이지 생성 시 체크리스트

1. [ ] OKLCH 색상 시스템 사용
2. [ ] Editorial 스타일 섹션 헤더 적용
3. [ ] grain 텍스처 오버레이 추가 (필요 시)
4. [ ] 좌측 정렬 레이아웃 (Editorial 스타일)
5. [ ] stagger 애니메이션 적용
6. [ ] font-headline 클래스 사용 (헤드라인)
7. [ ] rounded-sm 사용 (sharp corners)
8. [ ] shadow-church-* 사용

### 12.10 반응형 디자인 기준

```tsx
// 모바일: 세로 스택
// 태블릿(md): 2열 그리드
// 데스크톱(lg): 3-4열 그리드

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```
