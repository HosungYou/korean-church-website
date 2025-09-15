# CMS 및 데이터 관리 안내

## Firebase 기반 콘텐츠 관리 시스템

### 데이터베이스 구조

#### 1. newFamilyRegistrations (새가족 등록)
**용도**: 새가족 등록 폼에서 제출된 데이터 저장

**필드 구조**:
```javascript
{
  koreanName: string,      // 한국 이름
  englishName: string,     // 영어 이름
  birthDate: string,       // 생년월일 (YYYY-MM-DD)
  baptismDate?: string,    // 세례일 (선택사항)
  gender: string,          // 성별 (male/female)
  country: string,         // 국가
  address1: string,        // 주소 1
  address2?: string,       // 주소 2 (선택사항)
  city: string,            // 도시
  state: string,           // 주/도
  zipCode: string,         // 우편번호
  email?: string,          // 이메일 (선택사항)
  phone: string,           // 전화번호
  churchPosition?: string, // 이전 교회 직분 (선택사항)
  previousChurch?: string, // 이전 교회 (선택사항)
  introduction?: string,   // 이전 교회 인도자 (선택사항)
  familyInfo?: string,     // 가족 정보 (선택사항)
  submittedAt: Timestamp   // 등록일시 (자동 생성)
}
```

**접근 방법**:
- Firebase Console: https://console.firebase.google.com
- 프로젝트: `sckc-54d97`
- 경로: Firestore Database → newFamilyRegistrations

#### 2. emailSubscribers (이메일 구독자)
**용도**: 뉴스레터 구독자 정보 관리

**필드 구조**:
```javascript
{
  email: string,           // 구독자 이메일
  subscribedAt: Timestamp, // 구독 시작일
  isActive: boolean,       // 활성 상태 (true/false)
  unsubscribedAt?: Timestamp // 구독 취소일 (해당시에만)
}
```

#### 3. newsletterSent (뉴스레터 발송 기록)
**용도**: 발송된 뉴스레터 기록 보관

**필드 구조**:
```javascript
{
  title: string,           // 뉴스레터 제목
  content: string,         // 내용
  publishedAt: Timestamp,  // 발행일
  sentAt: Timestamp,       // 발송일
  recipientCount: number,  // 수신자 수
  recipients: string[],    // 수신자 이메일 목록
  type: string            // 타입 (announcement/event/general)
}
```

### 폼 제출 프로세스

#### 새가족 등록 폼 제출 시
1. **사용자 액션**: `/new-family-guide` 페이지에서 폼 작성 및 제출
2. **데이터 처리**: `addNewFamilyRegistration()` 함수 호출
3. **Firebase 저장**: `newFamilyRegistrations` 컬렉션에 데이터 추가
4. **사용자 피드백**: "등록이 완료되었습니다" 메시지 표시
5. **후속 처리**: 폼 자동 리셋 (3초 후)

#### 데이터 흐름
```
새가족 등록 폼
    ↓
newFamilyService.ts
    ↓
Firebase Firestore
    ↓
관리자 대시보드에서 확인 가능
```

### 관리자 기능

#### 1. 새가족 등록 관리
- **위치**: `/admin/dashboard`
- **기능**:
  - 최근 등록 목록 확인
  - 등록자 상세 정보 조회
  - 연락처 정보 확인

#### 2. 이메일 구독자 관리
- **위치**: `/admin/newsletter`
- **기능**:
  - 전체 구독자 목록
  - 구독/구독취소 관리
  - 뉴스레터 발송

#### 3. 교회 소식 관리
- **위치**: `/admin/posts`
- **기능**:
  - 공지사항 작성/수정/삭제
  - 카테고리별 분류
  - 발행일 예약

### 보안 및 접근 제어

#### Firebase 보안 규칙
```javascript
// Firestore 보안 규칙 예시
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 새가족 등록은 누구나 쓰기 가능, 읽기는 인증된 관리자만
    match /newFamilyRegistrations/{document} {
      allow write: if true;
      allow read: if request.auth != null && request.auth.token.admin == true;
    }

    // 이메일 구독자는 관리자만 접근
    match /emailSubscribers/{document} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

#### 관리자 권한
- Google 계정 기반 인증
- 승인된 이메일 주소만 관리자 접근 가능
- Firebase Authentication을 통한 권한 관리

### 데이터 백업 및 복구

#### 자동 백업
- Firebase는 일정 기간 자동 백업 제공
- Point-in-time recovery 지원

#### 수동 백업
```bash
# Firebase CLI를 통한 데이터 내보내기
firebase firestore:export gs://backup-bucket/backup-folder

# 데이터 가져오기
firebase firestore:import gs://backup-bucket/backup-folder
```

### 모니터링 및 분석

#### 사용 통계
- Firebase Analytics를 통한 사용자 행동 분석
- 새가족 등록 통계
- 페이지 방문 통계

#### 에러 모니터링
- Firebase Crashlytics
- 실시간 오류 추적
- 성능 모니터링

### API 엔드포인트 (향후 확장)

#### 새가족 등록 API
```
POST /api/new-family
Content-Type: application/json

{
  "koreanName": "홍길동",
  "englishName": "John Doe",
  "birthDate": "1990-01-01",
  // ... 기타 필드
}
```

#### 뉴스레터 구독 API
```
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "example@email.com"
}
```

### 문제 해결

#### 일반적인 문제들
1. **폼 제출 실패**
   - Firebase 연결 상태 확인
   - 브라우저 네트워크 탭에서 오류 확인
   - Firebase 규칙 검토

2. **데이터 조회 안됨**
   - 인증 상태 확인
   - 권한 설정 검토
   - Firebase Console에서 직접 확인

3. **이메일 발송 실패**
   - SendGrid/NodeMailer 설정 확인
   - API 키 유효성 검증
   - 스팸 필터 확인

### 개발자 도구

#### Firebase CLI 설정
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 초기화
firebase init

# 로컬 에뮬레이터 실행
firebase emulators:start
```

#### 환경 변수 설정
```javascript
// .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sckc-54d97
```

---

**참고사항**:
- 모든 민감한 데이터는 암호화되어 저장됩니다
- GDPR 및 개인정보보호법 준수
- 정기적인 보안 점검 필요
- 데이터 보존 정책에 따른 관리 필요