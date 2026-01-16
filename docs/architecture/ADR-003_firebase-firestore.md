# ADR-003: Firebase Firestore 데이터 모델

## Status
✅ Accepted

## Date
2025-01-16

## Context

교회 웹사이트의 동적 콘텐츠 관리를 위한 데이터베이스가 필요합니다:

1. **콘텐츠 유형**: 공지사항, 설교, 이벤트, 새가족 등록
2. **실시간 업데이트**: 관리자 변경사항 즉시 반영
3. **확장성**: 향후 기능 추가 고려
4. **비용**: 소규모 사용에 적합한 무료 티어

## Decision

**Firebase Firestore**를 데이터베이스로 채택합니다.

### 컬렉션 구조

```
firestore/
├── posts/                    # 게시글 (공지사항, 이벤트, 일반)
│   └── {postId}
│       ├── title: string
│       ├── content: string
│       ├── type: "announcement" | "event" | "general"
│       ├── status: "draft" | "published" | "scheduled"
│       ├── authorEmail: string
│       ├── authorName: string
│       ├── coverImageUrl: string?
│       ├── excerpt: string?
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       ├── publishedAt: timestamp?
│       └── scheduledFor: timestamp?
│
├── newFamilies/              # 새가족 등록
│   └── {familyId}
│       ├── name: string
│       ├── email: string
│       ├── phone: string
│       └── createdAt: timestamp
│
└── emails/                   # 이메일 구독
    └── {emailId}
        ├── email: string
        └── subscribedAt: timestamp
```

### 서비스 레이어

```typescript
// src/utils/postService.ts
export interface PostRecord {
  id: string
  title: string
  content: string
  type: PostType
  status: PostStatus
  // ...
}

export const createPost = async (input: CreatePostInput): Promise<string>
export const getPostById = async (id: string): Promise<PostRecord | null>
export const getPosts = async (options?: GetPostsOptions): Promise<PostRecord[]>
export const updatePost = async (input: UpdatePostInput): Promise<void>
export const deletePost = async (id: string): Promise<void>
```

## Consequences

### Positive
- ✅ 실시간 데이터 동기화
- ✅ 오프라인 지원
- ✅ 자동 스케일링
- ✅ 무료 티어로 충분한 사용량 (1GB 저장, 50K 읽기/일)
- ✅ TypeScript 완벽 지원

### Negative
- ⚠️ 복잡한 쿼리 제한적
- ⚠️ Supabase Auth와 별도 서비스
- ⚠️ NoSQL 구조로 관계형 데이터 처리 불편

### Neutral
- 📝 인증은 Supabase, 데이터는 Firebase 분리 운영
- 📝 Firebase Security Rules로 데이터 보호

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 공개 읽기, 인증된 사용자만 쓰기
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // 새가족 등록은 누구나 작성 가능
    match /newFamilies/{familyId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // 이메일 구독
    match /emails/{emailId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## Alternatives Considered

### Supabase Database (PostgreSQL)
- **장점**: Supabase Auth와 통합, SQL 쿼리
- **단점**: 실시간 기능 설정 복잡
- **결론**: Firebase의 간편한 실시간 기능 선호

### MongoDB Atlas
- **장점**: 유연한 스키마, 강력한 쿼리
- **단점**: 별도 인프라 관리
- **결론**: Firebase의 관리형 서비스 선호

### Prisma + PostgreSQL
- **장점**: 타입 안전성, ORM
- **단점**: 호스팅 필요, 설정 복잡
- **결론**: 오버엔지니어링으로 판단

## References

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- `lib/firebase.ts` - 클라이언트 설정
- `src/utils/postService.ts` - 서비스 구현
