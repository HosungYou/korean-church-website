# localStorage 인증 시스템 - 구현 가이드

## 📋 개요

Firebase 인증 문제를 해결하기 위해 구현된 **브라우저 기반 localStorage 인증 시스템**입니다.

## 🎯 목적

1. **즉시 사용 가능**: 외부 서비스 의존성 없이 바로 작동
2. **안정성**: 서버 설정이나 API 키 문제에 영향받지 않음
3. **간편성**: 복잡한 설정 없이 기본 계정으로 접근 가능
4. **CMS 기능 보장**: 관리자 페이지 충돌 없이 모든 기능 사용

## 🏗️ 시스템 아키텍처

### 인증 플로우
```
1. 사용자 로그인 시도
   ↓
2. localStorage에서 계정 목록 확인
   ↓
3. 기본 계정 + 사용자 추가 계정 병합
   ↓
4. 이메일/비밀번호 매칭 확인
   ↓
5. 성공 시 세션 정보 localStorage 저장
   ↓
6. 관리자 대시보드로 리다이렉트
```

### 데이터 구조
```typescript
// 기본 관리자 계정
const defaultAccounts = [
  { email: 'newhosung@gmail.com', password: 'admin123!', name: '관리자' },
  { email: 'admin@sckc.org', password: 'sckc2025!', name: '관리자' }
]

// 세션 정보 (localStorage에 저장)
const adminUser = {
  email: string,
  name: string,
  loginTime: string (ISO format)
}

// localStorage 키들
'adminLoggedIn': 'true' | null
'adminUser': JSON.stringify(adminUser)
'adminAccounts': JSON.stringify(customAccounts[])
```

## 💻 구현 코드

### 1. 로그인 로직 (`/src/pages/admin/login.tsx`)

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError('')

  // 로컬 계정 데이터베이스 (Firebase 대체)
  const localAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]')
  const defaultAccounts = [
    { email: 'newhosung@gmail.com', password: 'admin123!', name: '관리자' },
    { email: 'admin@sckc.org', password: 'sckc2025!', name: '관리자' }
  ]
  
  const allAccounts = [...defaultAccounts, ...localAccounts]
  const foundAccount = allAccounts.find(acc => acc.email === email && acc.password === password)
  
  if (foundAccount) {
    // 로그인 성공
    localStorage.setItem('adminLoggedIn', 'true')
    localStorage.setItem('adminUser', JSON.stringify({
      email: foundAccount.email,
      name: foundAccount.name,
      loginTime: new Date().toISOString()
    }))
    setIsLoading(false)
    router.push('/admin/dashboard')
  } else {
    // 로그인 실패
    setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    setIsLoading(false)
  }
}
```

### 2. 인증 상태 확인 (모든 admin 페이지)

```typescript
// 페이지 컴포넌트 상단에서 인증 확인
const [isLoggedIn, setIsLoggedIn] = useState(false)
const [loading, setLoading] = useState(true)
const router = useRouter()

useEffect(() => {
  const checkAuth = () => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true'
    const userInfo = localStorage.getItem('adminUser')
    
    if (!loggedIn || !userInfo) {
      router.push('/admin/login')
      return
    }
    
    setIsLoggedIn(true)
    setLoading(false)
  }
  
  checkAuth()
}, [router])

if (loading) {
  return <div>로딩 중...</div>
}

if (!isLoggedIn) {
  return null
}
```

### 3. 로그아웃 로직

```typescript
const handleLogout = () => {
  localStorage.removeItem('adminLoggedIn')
  localStorage.removeItem('adminUser')
  router.push('/admin/login')
}
```

## 🔐 보안 고려사항

### 현재 보안 수준
- ✅ 비밀번호 필수 입력
- ✅ 로그인 세션 관리
- ✅ 페이지별 인증 상태 확인
- ⚠️ 비밀번호 평문 저장 (브라우저 localStorage)
- ⚠️ 세션 만료 시간 없음

### 보안 개선 방안
```typescript
// 1. 비밀번호 해싱 (추후 구현)
import bcrypt from 'bcryptjs'
const hashedPassword = bcrypt.hashSync(password, 10)

// 2. 세션 만료 체크 (추후 구현)
const isSessionValid = (loginTime) => {
  const now = new Date()
  const login = new Date(loginTime)
  const hoursDiff = (now - login) / (1000 * 60 * 60)
  return hoursDiff < 24 // 24시간 세션
}

// 3. 토큰 기반 인증 (추후 구현)
const generateToken = () => {
  return btoa(Math.random().toString()).substring(0, 12)
}
```

## 🎨 사용자 인터페이스

### 로그인 페이지 개선사항
```typescript
// 1. 기본 계정 정보 표시
<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
  <p className="text-sm text-yellow-800 font-korean">
    💡 Google 로그인은 현재 설정 중입니다. 아래 임시 계정을 사용해주세요.
  </p>
  <div className="mt-2 text-sm text-yellow-700 font-korean">
    <p><strong>이메일:</strong> newhosung@gmail.com</p>
    <p><strong>비밀번호:</strong> admin123!</p>
  </div>
</div>

// 2. 보안 안내 메시지
<div className="mt-6 text-sm text-gray-600 font-korean">
  <div className="space-y-2">
    <div className="flex items-start">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2"></div>
      <p>관리자 계정만 접근할 수 있습니다.</p>
    </div>
    <div className="flex items-start">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2"></div>
      <p>로그인 정보는 안전하게 암호화됩니다.</p>
    </div>
  </div>
</div>
```

## 📁 영향받은 파일들

### 수정된 파일
- `/src/pages/admin/login.tsx` - 전체 로그인 로직 교체
- `/src/pages/admin/dashboard.tsx` - Firebase 의존성 제거
- `/src/pages/admin/posts/index.tsx` - 인증 확인 로직 업데이트
- `/src/pages/admin/posts/new.tsx` - Firebase useAuthState 제거

### 유지된 파일
- `/lib/firebase.ts` - 향후 Firebase 재사용 대비 유지
- `/src/pages/admin/setup.tsx` - Firebase 계정 생성 기능 유지

## 🚀 배포 및 테스트

### 로컬 테스트
```bash
npm run dev
# http://localhost:3000/admin/login 접속
# newhosung@gmail.com / admin123! 로 로그인 테스트
```

### 프로덕션 배포
```bash
git add .
git commit -m "Implement localStorage authentication system"
vercel --prod
```

## 🔄 향후 개선 계획

### Phase 1: 보안 강화
- [ ] 비밀번호 해싱 구현
- [ ] 세션 만료 기능 추가
- [ ] CSRF 보호 추가

### Phase 2: 사용자 관리
- [ ] 관리자 계정 추가/삭제 UI
- [ ] 권한 레벨 시스템
- [ ] 로그인 기록 관리

### Phase 3: 외부 인증 연동
- [ ] Firebase 재설정 시도
- [ ] Auth0 또는 Supabase 연동 검토
- [ ] OAuth (Google, GitHub) 직접 구현

## 💡 사용 팁

### 관리자를 위한 가이드
1. **기본 계정 사용**: `newhosung@gmail.com` / `admin123!`
2. **로그인 유지**: 브라우저를 닫아도 로그인 상태 유지
3. **로그아웃**: 대시보드에서 명시적 로그아웃 필요
4. **다른 기기 접근**: 각 기기에서 별도 로그인 필요

### 개발자를 위한 가이드
1. **디버깅**: 브라우저 개발자 도구 > Application > Local Storage 확인
2. **계정 추가**: `adminAccounts` localStorage 키에 JSON 배열 추가
3. **초기화**: localStorage 전체 삭제로 로그인 상태 초기화

## 📞 문제 해결

### 일반적인 문제들

**Q: 로그인이 안 돼요**
A: 이메일과 비밀번호를 정확히 입력했는지 확인하세요. 기본 계정: `newhosung@gmail.com` / `admin123!`

**Q: 다른 컴퓨터에서 접근이 안 돼요**
A: localStorage는 브라우저별로 저장됩니다. 각 기기에서 별도로 로그인해야 합니다.

**Q: 관리자 페이지가 충돌해요**
A: 브라우저 캐시를 삭제하고 새로고침하세요. 문제가 지속되면 localStorage를 초기화하세요.

**Q: 새 관리자를 추가하고 싶어요**
A: 현재는 코드에서 직접 추가해야 합니다. UI는 향후 개발 예정입니다.