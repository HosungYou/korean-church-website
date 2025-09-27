# 🔥 Firebase 완전 설정 가이드 (OAuth + Storage)

## 🚀 Firebase Storage 새 프로젝트 설정 (권장)

### 1. 새 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `korean-church-website` 입력
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

### 2. Firebase Storage 활성화
1. 왼쪽 메뉴에서 "Storage" 클릭
2. "시작하기" 클릭
3. 보안 규칙: **테스트 모드** 선택 (개발용)
4. 위치: `us-central1` (기본값)
5. "완료" 클릭

### 3. Web 앱 추가
1. 프로젝트 설정 (톱니바퀴 아이콘) 클릭
2. "일반" 탭 → "내 앱" 섹션
3. 웹 아이콘 `</>` 클릭
4. 앱 닉네임: `korean-church-web`
5. "앱 등록" 클릭
6. **새 설정 코드를 .env.local에 복사**

## 📁 기존 프로젝트 설정 (현재)

### 1. Firebase Console 설정 (https://console.firebase.google.com)

1. **프로젝트 선택**: `sckc-54d97` 프로젝트로 이동

2. **Authentication > Sign-in method**:
   - Google 로그인 활성화 ✅
   - 프로젝트 지원 이메일 설정 (newhosung@gmail.com)
   - OAuth 클라이언트 ID 확인

3. **Authentication > Settings > Authorized domains**:
   아래 도메인들을 모두 추가해야 합니다:
   - `localhost`
   - `localhost:3000`
   - `localhost:3001`
   - `korean-church-website.vercel.app`
   - `korean-church-kvu82nvbj-hosung-yous-projects.vercel.app`
   - `*.vercel.app` (모든 Vercel 도메인 허용)

### 2. Google Cloud Console 설정 (https://console.cloud.google.com)

1. **프로젝트 선택**: Firebase 프로젝트와 동일한 프로젝트 선택

2. **APIs & Services > Credentials**:
   - OAuth 2.0 Client IDs 확인
   - Web application 타입 확인

3. **OAuth 2.0 Client ID 설정**:
   - Authorized JavaScript origins:
     - `http://localhost`
     - `http://localhost:3000`
     - `http://localhost:3001`
     - `https://korean-church-website.vercel.app`
     - `https://sckc-54d97.firebaseapp.com`
   
   - Authorized redirect URIs:
     - `http://localhost:3000/__/auth/handler`
     - `http://localhost:3001/__/auth/handler`
     - `https://korean-church-website.vercel.app/__/auth/handler`
     - `https://sckc-54d97.firebaseapp.com/__/auth/handler`

### 3. 환경 변수 확인

`.env.local` 파일에 다음 값들이 정확히 설정되어 있는지 확인:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDTqL_pHTHrHBi09DLGVv7oMqgKsailIBc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sckc-54d97.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sckc-54d97
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sckc-54d97.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=818533869703
NEXT_PUBLIC_FIREBASE_APP_ID=1:818533869703:web:1db7efabdc6ef68723022
```

### 4. 사용자 권한 설정

Firebase Console > Authentication > Users에서:
- `newhosung@gmail.com` 계정이 등록되어 있는지 확인
- 필요시 수동으로 사용자 추가

### 5. 테스트 방법

1. 로컬 테스트:
   ```bash
   npm run dev
   # http://localhost:3001/admin/login 접속
   ```

2. 프로덕션 테스트:
   ```bash
   npm run build
   vercel --prod
   # https://korean-church-website.vercel.app/admin/login 접속
   ```

### 6. 일반적인 오류 해결

- **"auth/unauthorized-domain"**: Authorized domains에 현재 도메인 추가
- **"auth/popup-blocked"**: 브라우저 팝업 차단 해제
- **"auth/invalid-api-key"**: API 키 확인 및 수정
- **"auth/operation-not-allowed"**: Google 로그인 활성화 확인

### 7. 추가 보안 설정

Firebase Console > Authentication > Settings:
- User account deletion: Disabled
- Email enumeration protection: Enabled
- Blocking functions: 관리자 이메일만 허용하도록 설정

## 🌐 Vercel 환경 변수 설정

### 새 Firebase 프로젝트 사용시
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `korean-church-website` 프로젝트 선택
3. "Settings" → "Environment Variables"
4. 다음 변수들을 추가:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=새로운-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=새프로젝트.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=새프로젝트-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=새프로젝트.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=새로운-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=새로운-app-id
```

5. 모든 환경(Production, Preview, Development)에 적용
6. "Save" 후 자동 재배포 대기

### Storage 보안 규칙 (운영용)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /covers/{fileName} {
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024;
    }

    match /posts/{fileName} {
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

## 💰 Firebase Storage 비용

### 무료 한도
- 저장소: 5GB
- 다운로드: 1GB/일
- 업로드: 무제한

### 유료 요금 (한도 초과시)
- 저장소: $0.026/GB/월
- 다운로드: $0.12/GB
- 업로드: $0.05/GB

**교회 웹사이트는 대부분 무료 한도 내에서 운영 가능합니다.**

## 📞 긴급 연락처

문제가 지속될 경우:
- Firebase Support: https://firebase.google.com/support
- 담당자: newhosung@gmail.com