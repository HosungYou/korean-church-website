# Supabase Auth 기능 문서

관리자 인증 시스템 구현 가이드입니다.

---

## 개요

- **인증 제공자**: Supabase Auth
- **로그인 방식**: Google OAuth
- **대상 사용자**: 교회 관리자
- **보호 페이지**: `/admin/*`

---

## 주요 파일

| 파일 | 용도 |
|------|------|
| `lib/supabase.ts` | Supabase 클라이언트 |
| `lib/supabaseAdmin.ts` | Supabase Admin SDK |
| `src/hooks/useAdminAuth.ts` | 인증 상태 관리 훅 |
| `src/pages/admin/login.tsx` | 로그인 페이지 |
| `src/pages/admin/google-login.tsx` | Google OAuth 처리 |

---

## useAdminAuth 훅 사용법

### 기본 사용

```typescript
import { useAdminAuth } from '@/hooks/useAdminAuth'

const AdminPage = () => {
  const { user, loading, isAuthenticated, logout } = useAdminAuth()

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return null // 자동으로 /admin/login으로 리다이렉트

  return (
    <div>
      <h1>안녕하세요, {user?.name}님</h1>
      <button onClick={logout}>로그아웃</button>
    </div>
  )
}
```

### 반환 값

```typescript
interface UseAdminAuthReturn {
  user: AdminUser | null           // 현재 로그인한 관리자
  supabaseUser: User | null        // Supabase User 객체
  session: Session | null          // Supabase Session 객체
  loading: boolean                 // 로딩 상태
  isAuthenticated: boolean         // 인증 여부
  logout: () => Promise<void>      // 로그아웃 함수
  refreshAuth: () => void          // 인증 상태 새로고침
}

interface AdminUser {
  email: string
  name: string
  photoURL?: string | null
  uid?: string
  loginTime: string
}
```

### 옵션

```typescript
// 미인증 시 리다이렉트 비활성화
const { user, loading } = useAdminAuth(false)

// 커스텀 리다이렉트 경로
const { user, loading } = useAdminAuth(true, '/custom-login')
```

---

## 인증 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                      인증 플로우                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 사용자가 /admin/* 페이지 접근                           │
│                    ↓                                        │
│  2. useAdminAuth 훅이 세션 확인                             │
│                    ↓                                        │
│  3. 미인증 → /admin/login으로 리다이렉트                    │
│                    ↓                                        │
│  4. "Google로 로그인" 버튼 클릭                             │
│                    ↓                                        │
│  5. Supabase → Google OAuth                                │
│                    ↓                                        │
│  6. 인증 성공 → localStorage 저장 + 세션 설정              │
│                    ↓                                        │
│  7. /admin/dashboard로 리다이렉트                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## localStorage 구조

```javascript
// 인증 상태 저장
localStorage.setItem('adminLoggedIn', 'true')
localStorage.setItem('adminUser', JSON.stringify({
  email: 'admin@example.com',
  name: '관리자',
  photoURL: 'https://...',
  uid: 'supabase-uid',
  loginTime: '2025-01-16T12:00:00Z'
}))

// 이벤트 디스패치 (다른 탭/컴포넌트 동기화)
window.dispatchEvent(new Event('admin-auth-changed'))
```

---

## 관리자 페이지 보호 패턴

### 페이지 컴포넌트

```typescript
// src/pages/admin/dashboard.tsx
import { NextPage } from 'next'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const AdminDashboard: NextPage = () => {
  const { user, loading, isAuthenticated, logout } = useAdminAuth()

  // 로딩 중
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  }

  // 미인증 (자동 리다이렉트됨)
  if (!isAuthenticated) return null

  // 인증됨
  return (
    <div>
      <header>
        <span>{user?.name}</span>
        <button onClick={logout}>로그아웃</button>
      </header>
      {/* 페이지 내용 */}
    </div>
  )
}

export default AdminDashboard
```

---

## 환경 변수

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 문제 해결

### 로그인 후 리다이렉트 안 됨

1. Supabase 대시보드에서 Redirect URL 확인
2. `http://localhost:3000/admin/dashboard` 추가 필요

### 세션이 유지되지 않음

1. localStorage 확인 (`adminLoggedIn`, `adminUser`)
2. Supabase 세션 만료 시간 확인
3. `refreshAuth()` 호출 시도

### Google OAuth 오류

1. Supabase 프로젝트의 Google Provider 설정 확인
2. Google Cloud Console의 OAuth 설정 확인
3. Redirect URI 일치 여부 확인
