# Posts 시스템 문서

게시글 관리 시스템 (공지사항, 이벤트, 일반 게시글) 가이드입니다.

---

## 개요

- **데이터베이스**: Supabase PostgreSQL
- **테이블**: `posts`
- **게시글 유형**: 공지사항, 이벤트, 일반
- **상태 관리**: 임시저장, 발행, 예약발행

---

## 주요 파일

| 파일 | 용도 |
|------|------|
| `src/utils/postService.ts` | 게시글 CRUD 서비스 |
| `src/pages/admin/posts/index.tsx` | 게시글 목록 (관리자) |
| `src/pages/admin/posts/new.tsx` | 새 게시글 작성 |
| `src/pages/admin/posts/[id].tsx` | 게시글 수정 |
| `src/pages/news/announcements.tsx` | 공지사항 목록 (공개) |
| `src/pages/news/posts/[id].tsx` | 게시글 상세 (공개) |

---

## 데이터베이스 스키마

### posts 테이블

```sql
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
    attachment_url TEXT,
    attachment_name VARCHAR(255),
    excerpt VARCHAR(300),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ
);
```

---

## 데이터 모델

### PostRecord (TypeScript)

```typescript
interface PostRecord {
  id: string
  title: string
  content: string
  type: PostType                    // 'announcement' | 'event' | 'general'
  category?: PostCategory           // 'general' | 'wednesday' | 'sunday' | 'bible'
  status: PostStatus                // 'draft' | 'published' | 'scheduled'
  authorEmail: string | null
  authorName: string | null
  coverImageUrl?: string | null
  attachmentUrl?: string | null
  attachmentName?: string | null
  excerpt?: string | null           // 자동 생성 (140자)
  createdAt?: Date | null
  updatedAt?: Date | null
  publishedAt?: Date | null
  scheduledFor?: Date | null
}
```

### snake_case ↔ camelCase 매핑

| DB (snake_case) | JS (camelCase) |
|-----------------|----------------|
| `author_email` | `authorEmail` |
| `author_name` | `authorName` |
| `cover_image_url` | `coverImageUrl` |
| `attachment_url` | `attachmentUrl` |
| `created_at` | `createdAt` |
| `published_at` | `publishedAt` |

### PostType

| 값 | 설명 |
|----|------|
| `announcement` | 공지사항 |
| `event` | 이벤트/행사 |
| `general` | 일반 게시글 |

### PostStatus

| 값 | 설명 |
|----|------|
| `draft` | 임시저장 (비공개) |
| `published` | 발행됨 (공개) |
| `scheduled` | 예약발행 |

---

## 서비스 함수

### 게시글 생성

```typescript
import { createPost, CreatePostInput } from '@/utils/postService'

const input: CreatePostInput = {
  title: '새 공지사항',
  content: '공지사항 내용입니다.',
  type: 'announcement',
  category: 'general',
  status: 'published',
  authorEmail: user.email,
  authorName: user.name,
  coverImageUrl: 'https://...'
}

const postId = await createPost(input)
```

### 게시글 조회

```typescript
import { getPostById, getPosts, getPublishedAnnouncements } from '@/utils/postService'

// 단일 게시글
const post = await getPostById('post-uuid')

// 전체 게시글 (최신순, 제한 가능)
const posts = await getPosts({ limit: 10 })

// 발행된 공지사항만
const announcements = await getPublishedAnnouncements(20)
```

### 게시글 수정

```typescript
import { updatePost, UpdatePostInput } from '@/utils/postService'

const input: UpdatePostInput = {
  id: 'post-uuid',
  title: '수정된 제목',
  content: '수정된 내용',
  type: 'announcement',
  status: 'published',
}

await updatePost(input)
```

### 게시글 삭제

```typescript
import { deletePost } from '@/utils/postService'

await deletePost('post-uuid')
```

---

## Supabase 쿼리 패턴

### 기본 CRUD

```typescript
import { supabase } from '../../lib/supabase'

// CREATE
const { data, error } = await supabase
  .from('posts')
  .insert({ title, content, status: 'draft' })
  .select('id')
  .single()

// READ
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('id', id)
  .single()

// UPDATE
const { error } = await supabase
  .from('posts')
  .update({ title, content })
  .eq('id', id)

// DELETE
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', id)
```

### 필터링 및 정렬

```typescript
// 발행된 공지사항 조회
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('type', 'announcement')
  .eq('status', 'published')
  .order('published_at', { ascending: false })
  .limit(20)
```

---

## 관리자 페이지 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    게시글 관리 플로우                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /admin/posts                                               │
│  ├── 게시글 목록 조회 (Supabase)                            │
│  ├── [새 글 작성] → /admin/posts/new                       │
│  └── [수정] → /admin/posts/[id]                            │
│                                                             │
│  /admin/posts/new                                           │
│  ├── 제목, 내용, 유형, 상태 입력                           │
│  ├── 커버 이미지 업로드 (선택)                             │
│  └── [저장] → createPost() → 목록으로 이동                 │
│                                                             │
│  /admin/posts/[id]                                          │
│  ├── 기존 게시글 로드                                       │
│  ├── 수정 → updatePost()                                   │
│  └── 삭제 → deletePost() (확인 후)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 공개 페이지

### 공지사항 목록

```typescript
// src/pages/news/announcements.tsx
import { getPublishedAnnouncements } from '@/utils/postService'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const announcements = await getPublishedAnnouncements(20)

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'navigation'])),
      announcements: JSON.parse(JSON.stringify(announcements)),
    },
    revalidate: 60, // 1분마다 재생성
  }
}
```

### 게시글 상세

```typescript
// src/pages/news/posts/[id].tsx
import { getPostById, getPosts } from '@/utils/postService'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts({ limit: 100 })
  const paths = posts.map(post => ({
    params: { id: post.id },
    locale: 'ko',
  }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const post = await getPostById(params?.id as string)

  if (!post || post.status !== 'published') {
    return { notFound: true }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'navigation'])),
      post: JSON.parse(JSON.stringify(post)),
    },
    revalidate: 60,
  }
}
```

---

## 이미지 업로드

```typescript
// src/pages/api/upload.ts
// 이미지 업로드 API 엔드포인트

const formData = new FormData()
formData.append('file', file)

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
})

const { url } = await response.json()
// url을 coverImageUrl로 사용
```

---

## 보안 고려사항

1. **인증 필수**: 모든 쓰기 작업은 `useAdminAuth` 확인 필요
2. **입력 검증**: 제목/내용 길이, XSS 방지
3. **권한 분리**: 읽기는 공개, 쓰기는 관리자만 (RLS 적용)
4. **삭제 확인**: 삭제 전 사용자 확인 필수

### Row Level Security (RLS)

```sql
-- 공개 읽기
CREATE POLICY "Anyone can read published posts"
ON posts FOR SELECT
USING (status = 'published');

-- 관리자만 쓰기
CREATE POLICY "Admins can manage posts"
ON posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt()->>'email'
  )
);
```

---

## 문제 해결

### "Supabase가 초기화되지 않았습니다" 오류

1. `.env.local` 파일의 Supabase 환경 변수 확인
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
2. `lib/supabase.ts`에서 초기화 코드 확인
3. 서버 재시작

### 게시글이 표시되지 않음

1. `status`가 `published`인지 확인
2. Supabase Dashboard → Table Editor → posts 테이블 확인
3. `getPublishedAnnouncements` 필터 확인

### 날짜가 이상하게 표시됨

1. PostgreSQL TIMESTAMPTZ → Date 변환 확인
2. `new Date(row.created_at)` 사용 확인
3. 타임존 처리 확인 (UTC → Local)

### UUID 형식 오류

1. Supabase는 UUID v4 형식 사용
2. `uuid_generate_v4()` 함수로 자동 생성
3. 클라이언트에서 UUID 생성 시 `crypto.randomUUID()` 사용
