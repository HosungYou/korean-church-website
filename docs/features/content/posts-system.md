# Posts 시스템 문서

게시글 관리 시스템 (공지사항, 이벤트, 일반 게시글) 가이드입니다.

---

## 개요

- **데이터베이스**: Firebase Firestore
- **컬렉션**: `posts`
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

## 데이터 모델

### PostRecord

```typescript
interface PostRecord {
  id: string
  title: string
  content: string
  type: PostType                    // 'announcement' | 'event' | 'general'
  status: PostStatus                // 'draft' | 'published' | 'scheduled'
  authorEmail: string | null
  authorName: string | null
  coverImageUrl?: string | null
  excerpt?: string | null           // 자동 생성 (140자)
  createdAt?: Date | null
  updatedAt?: Date | null
  publishedAt?: Date | null
  scheduledFor?: Date | null
}
```

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
const post = await getPostById('post-id')

// 전체 게시글 (최신순, 제한 가능)
const posts = await getPosts({ limit: 10 })

// 발행된 공지사항만
const announcements = await getPublishedAnnouncements(20)
```

### 게시글 수정

```typescript
import { updatePost, UpdatePostInput } from '@/utils/postService'

const input: UpdatePostInput = {
  id: 'post-id',
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

await deletePost('post-id')
```

---

## 관리자 페이지 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                    게시글 관리 플로우                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /admin/posts                                               │
│  ├── 게시글 목록 조회                                       │
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
3. **권한 분리**: 읽기는 공개, 쓰기는 관리자만
4. **삭제 확인**: 삭제 전 사용자 확인 필수

---

## 문제 해결

### "Firebase가 초기화되지 않았습니다" 오류

1. `.env.local` 파일의 Firebase 환경 변수 확인
2. `lib/firebase.ts`에서 초기화 코드 확인
3. 서버 재시작

### 게시글이 표시되지 않음

1. `status`가 `published`인지 확인
2. Firestore 콘솔에서 데이터 확인
3. `getPublishedAnnouncements` 필터 확인

### 날짜가 이상하게 표시됨

1. Firestore Timestamp → Date 변환 확인
2. `toDate()` 함수 사용 확인
3. 타임존 처리 확인
