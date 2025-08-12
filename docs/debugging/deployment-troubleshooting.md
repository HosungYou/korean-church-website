# Vercel 배포 문제 해결 - 트러블슈팅 가이드

## 📅 배포 세션 로그
**2025년 8월 12일** - localStorage 인증 시스템 배포

## 🚀 배포 정보

### 프로젝트 설정
- **플랫폼**: Vercel
- **프레임워크**: Next.js 14.2.30
- **언어**: TypeScript
- **빌드 도구**: npm

### 배포 URL들
```
Production: https://korean-church-kvu82nvbj-hosung-yous-projects.vercel.app
Previous: https://korean-church-q8pgf80az-hosung-yous-projects.vercel.app
...
```

## ✅ 성공적인 배포 프로세스

### 1. 빌드 성공 로그
```bash
Vercel CLI 44.7.3
Installing dependencies...
up to date in 1s
46 packages are looking for funding

Detected Next.js version: 14.2.30
Running "npm run build"

▲ Next.js 14.2.30
Linting and checking validity of types ...
Creating an optimized production build ...
✓ Compiled successfully
Collecting page data ...
```

### 2. Firebase 설정 확인
```
🔧 Firebase Config: {
  apiKey: 'AIzaSyDTqL...',
  projectId: 'sckc-54d97',
  authDomain: 'sckc-54d97.firebaseapp.com'
}
```

### 3. 정적 페이지 생성 성공
```
Generating static pages (0/80) ...
Generating static pages (20/80) 
Generating static pages (40/80) 
Generating static pages (60/80) 
✓ Generating static pages (80/80)
```

### 4. 빌드 통계
```
Route (pages)                              Size     First Load JS
┌ ● /                                      4.65 kB         264 kB
├ ● /admin/dashboard                       3.13 kB         143 kB
├ ● /admin/login                           2.54 kB         143 kB
├ ● /admin/posts/new                       3.95 kB         260 kB
└ ● /admin/setup                           2.91 kB         259 kB

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses getStaticProps)
```

## 🚨 배포 중 발견된 문제들

### 1. 401 Unauthorized 오류
```bash
curl -I "https://korean-church-kvu82nvbj-hosung-yous-projects.vercel.app/"
HTTP/2 401 
cache-control: no-store, max-age=0
content-type: text/html; charset=utf-8
set-cookie: _vercel_sso_nonce=...
x-robots-tag: noindex
```

**원인 분석**:
- Vercel의 비밀번호 보호 기능이 활성화되었을 가능성
- 프로젝트 설정에서 액세스 제한이 걸려있을 수 있음
- 도메인 인증 문제

**해결 방법**:
1. Vercel 대시보드에서 프로젝트 설정 확인
2. Security 탭에서 Password Protection 비활성화
3. 도메인 설정 재확인

### 2. 이전 배포들에서의 오류
```
https://korean-church-r8gr4zviv-hosung-yous-projects.vercel.app     ● Error
https://korean-church-ng3qutjt8-hosung-yous-projects.vercel.app     ● Error
```

**오류 원인**: Firebase 인증 코드에서 빌드 에러 발생
**해결**: localStorage 인증으로 변경 후 빌드 성공

## 🔧 환경 변수 설정

### Vercel 환경 변수 목록
```bash
# Firebase 설정 (현재 사용 안 함, 향후 대비)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDTqL_pHTHrHBi09DLGVv7oMqgKsailIB
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sckc-54d97.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sckc-54d97
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sckc-54d97.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=534897383655
NEXT_PUBLIC_FIREBASE_APP_ID=1:534897383655:web:c4b7bbad3d5c8bebb49f72
```

### 환경 변수 관리 명령어
```bash
# 환경 변수 확인
vercel env

# 환경 변수 추가
vercel env add VARIABLE_NAME

# 환경 변수 제거  
vercel env rm VARIABLE_NAME
```

## 📊 배포 성능 분석

### 빌드 시간 분석
- **Total Build Time**: 30초
- **Dependencies Installation**: 1초
- **TypeScript Compilation**: 8초
- **Static Generation**: 15초
- **Deployment**: 6초

### 번들 크기 최적화
```
First Load JS shared by all: 107 kB
├ chunks/framework-64ad27b21261a9ce.js   44.8 kB
├ chunks/main-f0dc130db8d55269.js        34.7 kB
├ chunks/pages/_app-02215125e2cce3aa.js  19.9 kB
└ other shared chunks (total)            7.22 kB
```

**개선 포인트**:
- Framework chunk가 큰 편 (44.8 kB)
- 불필요한 라이브러리 제거 검토 필요
- Code splitting 추가 고려

## 🛠️ 배포 명령어 모음

### 기본 배포 명령어
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# Vercel 배포 (프리뷰)
vercel

# Vercel 프로덕션 배포
vercel --prod

# 배포 목록 확인
vercel ls

# 도메인 관리
vercel domains

# 로그 확인
vercel logs [deployment-url]
```

### Git 기반 배포 워크플로우
```bash
# 변경사항 커밋
git add .
git commit -m "commit message"

# Vercel 자동 배포 (main 브랜치)
git push origin main

# 수동 배포
vercel --prod
```

## 🔍 디버깅 도구들

### 1. Vercel CLI 디버깅
```bash
# 상세 로그와 함께 배포
vercel --debug

# 특정 배포 검사
vercel inspect [deployment-id]

# 실시간 로그 확인
vercel logs --follow
```

### 2. 브라우저 디버깅
```javascript
// 콘솔에서 localStorage 확인
localStorage.getItem('adminLoggedIn')
localStorage.getItem('adminUser')

// 네트워크 탭에서 API 호출 확인
// 콘솔에서 오류 메시지 확인
```

### 3. Next.js 빌드 디버깅
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build
npm start

# 번들 분석
npm install --save-dev @next/bundle-analyzer
```

## 🚦 배포 상태 모니터링

### 체크리스트
- [ ] 빌드 성공 확인
- [ ] 정적 페이지 생성 성공
- [ ] 환경 변수 올바르게 설정
- [ ] 도메인 접근 가능
- [ ] 관리자 로그인 기능 정상 작동
- [ ] 모든 admin 페이지 접근 가능

### 배포 후 테스트 시나리오
1. **메인 페이지 접근**: `/`
2. **관리자 로그인**: `/admin/login`
3. **대시보드 접근**: `/admin/dashboard`
4. **게시물 작성**: `/admin/posts/new`
5. **게시물 목록**: `/admin/posts`

## ⚠️ 알려진 제한사항

### Vercel 무료 플랜 제한
- **Function Duration**: 10초
- **Function Memory**: 1024 MB
- **Bandwidth**: 100 GB/월
- **Build Minutes**: 6000분/월

### localStorage 인증의 제한
- 브라우저별 저장 (다른 기기 접근 불가)
- 서버 사이드 검증 없음
- 세션 만료 기능 없음

## 🔄 향후 배포 개선 계획

### 1. CI/CD 파이프라인 구축
```yaml
# .github/workflows/deploy.yml (예시)
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

### 2. 도메인 설정
- 커스텀 도메인 연결
- SSL 인증서 자동 갱신
- CDN 최적화 설정

### 3. 모니터링 설정
- Vercel Analytics 활성화
- 에러 추적 (Sentry 연동)
- 성능 모니터링

## 📞 문제 해결 연락처

### Vercel 관련 문제
- Vercel 공식 문서: https://vercel.com/docs
- Discord 커뮤니티: https://vercel.com/discord
- GitHub Issues: https://github.com/vercel/vercel

### 프로젝트 관련 문제
- localStorage 인증: `docs/debugging/localstorage-auth-system.md` 참조
- Firebase 설정: `docs/debugging/firebase-authentication-issues.md` 참조

## 📝 배포 체크리스트

배포 전 확인사항:
- [ ] `npm run build` 로컬에서 성공
- [ ] TypeScript 오류 없음
- [ ] Lint 오류 없음
- [ ] 환경 변수 설정 완료
- [ ] Git 커밋 완료

배포 후 확인사항:
- [ ] 메인 페이지 정상 로드
- [ ] 관리자 로그인 기능 테스트
- [ ] 모든 admin 페이지 접근 확인
- [ ] 콘솔 오류 없음
- [ ] 모바일 반응형 확인