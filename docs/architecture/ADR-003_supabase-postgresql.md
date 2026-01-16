# ADR-003: Supabase PostgreSQL 데이터베이스

## Status
✅ Accepted (Firebase Firestore에서 마이그레이션)

## Date
2025-01-16

## Context

교회 웹사이트의 동적 콘텐츠 관리를 위한 데이터베이스가 필요합니다:

1. **콘텐츠 유형**: 공지사항, 설교, 이벤트, 기도요청, 새가족 등록
2. **실시간 업데이트**: 관리자 변경사항 즉시 반영
3. **인증 통합**: Supabase Auth와 원활한 연동
4. **확장성**: 향후 기능 추가 고려
5. **비용**: 소규모 사용에 적합한 무료 티어

## Decision

**Supabase PostgreSQL**을 데이터베이스로 채택합니다.

기존 Firebase Firestore에서 Supabase PostgreSQL로 마이그레이션하여 인증(Supabase Auth)과 데이터베이스를 단일 플랫폼으로 통합합니다.

### 테이블 스키마

```sql
-- posts 테이블 (공지사항, 이벤트, 일반 게시글)
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

-- prayer_requests 테이블 (기도요청)
CREATE TABLE prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- prayer_replies 테이블 (기도요청 답글)
CREATE TABLE prayer_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- email_subscribers 테이블 (이메일 구독)
CREATE TABLE email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- admin_users 테이블 (관리자 목록)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 서비스 레이어 패턴

```typescript
// src/utils/postService.ts
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
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapPostRow(data)
}
```

## Consequences

### Positive
- ✅ **단일 플랫폼**: Auth와 DB가 동일 서비스에서 관리
- ✅ **SQL 지원**: 복잡한 쿼리, JOIN, 집계 함수 사용 가능
- ✅ **RLS (Row Level Security)**: 세밀한 접근 제어
- ✅ **Realtime**: 실시간 데이터 구독 지원
- ✅ **무료 티어**: 500MB 저장, 무제한 API 요청
- ✅ **TypeScript 지원**: 자동 타입 생성 가능

### Negative
- ⚠️ snake_case ↔ camelCase 매핑 필요
- ⚠️ Firebase 대비 커뮤니티 규모 작음

### Neutral
- 📝 PostgreSQL 표준 SQL 문법 사용
- 📝 Supabase Dashboard에서 데이터 직접 관리 가능

## Row Level Security (RLS)

```sql
-- posts 테이블 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

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

-- prayer_requests 테이블 RLS
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기/쓰기 가능
CREATE POLICY "Anyone can read prayer requests"
ON prayer_requests FOR SELECT TO public
USING (true);

CREATE POLICY "Authenticated users can create prayer requests"
ON prayer_requests FOR INSERT TO authenticated
WITH CHECK (true);
```

## Realtime 구독 예시

```typescript
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'

const RealtimeComponent = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    // Realtime 구독 설정
    const channel = supabase
      .channel('table_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          // 변경 시 데이터 새로고침
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <div>{/* UI */}</div>
}
```

## Migration from Firebase

Firebase Firestore에서 Supabase PostgreSQL로 마이그레이션 시 주요 변경사항:

| Firebase | Supabase |
|----------|----------|
| Collection/Document | Table/Row |
| NoSQL (유연한 스키마) | SQL (고정 스키마) |
| Security Rules | Row Level Security |
| `serverTimestamp()` | `NOW()` |
| camelCase 필드 | snake_case 컬럼 |

## Alternatives Considered

### Firebase Firestore (이전 사용)
- **장점**: 유연한 스키마, 간편한 실시간
- **단점**: Supabase Auth와 별도 서비스, 복잡한 쿼리 제한
- **결론**: 단일 플랫폼 통합을 위해 Supabase로 마이그레이션

### PlanetScale (MySQL)
- **장점**: 브랜칭, 스케일링
- **단점**: Supabase Auth와 별도, 실시간 미지원
- **결론**: Supabase의 통합 솔루션 선호

### Prisma + PostgreSQL
- **장점**: 타입 안전성, ORM
- **단점**: 별도 호스팅 필요
- **결론**: Supabase의 관리형 서비스 선호

## References

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- `lib/supabase.ts` - 클라이언트 설정
- `lib/supabaseAdmin.ts` - Admin 설정 (service_role)
- `src/utils/postService.ts` - 서비스 구현
