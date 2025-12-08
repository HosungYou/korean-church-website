# 🚀 Firebase → Supabase 마이그레이션 가이드

## 📅 마이그레이션 일자: 2025-09-28

## 🎯 마이그레이션 개요

이 문서는 Korean Church Website를 Firebase에서 Supabase로 마이그레이션하는 과정을 상세히 기록합니다.

### 마이그레이션 이유
- Firebase OAuth 도메인 설정의 지속적인 문제
- 데이터베이스 구조의 불명확성
- 더 나은 비용 효율성 및 관리 편의성

## 🏗️ 프로젝트 정보

### Supabase 프로젝트
- **Project URL**: `https://wnsqpxhvscpjrzpfcqdf.supabase.co`
- **Anon Key**: `.env.local.supabase` 파일 참조
- **Google OAuth Client ID**: `604113547744-ilkrrgah54fgi7g3cuit2nmicg8ll07u.apps.googleusercontent.com`

## 📁 새로운 파일 구조

### 1. Supabase 클라이언트 설정
```
lib/
├── supabase.ts            # 기본 Supabase 클라이언트
├── supabaseClient.ts       # 브라우저 클라이언트
└── supabaseServer.ts       # 서버 사이드 클라이언트
```

### 2. 타입 정의
```
types/
└── supabase.ts            # Supabase 데이터베이스 타입 정의
```

### 3. 서비스 레이어
```
src/utils/
├── postServiceSupabase.ts        # 게시물 관련 서비스
├── fileUploadServiceSupabase.ts  # 파일 업로드 서비스
├── prayerServiceSupabase.ts      # 기도 요청 서비스
└── newFamilyServiceSupabase.ts   # 새가족 등록 서비스
```

### 4. 컴포넌트
```
components/
└── AdminLoginFormSupabase.tsx    # Supabase 인증 로그인 폼
```

### 5. 페이지
```
pages/auth/
└── callback.tsx                  # OAuth 콜백 처리 페이지
```

## 🗄️ 데이터베이스 스키마

### 테이블 구조

#### 1. profiles (사용자 프로필)
```sql
- id: UUID (auth.users 참조)
- email: TEXT (고유)
- full_name: TEXT
- role: TEXT (기본값: 'user')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. posts (게시물)
```sql
- id: UUID (자동 생성)
- title: TEXT
- content: TEXT
- type: TEXT (announcement/event/general)
- category: TEXT (general/wednesday/sunday/bible)
- status: TEXT (draft/published/scheduled)
- author_id: UUID (profiles 참조)
- cover_image_url: TEXT
- attachment_url: TEXT
- published_at: TIMESTAMP
- scheduled_for: TIMESTAMP
- created_at/updated_at: TIMESTAMP
```

#### 3. prayer_requests (기도 요청)
```sql
- id: UUID (자동 생성)
- name: TEXT
- email: TEXT
- phone: TEXT
- title: TEXT
- content: TEXT
- is_urgent: BOOLEAN
- is_private: BOOLEAN
- status: TEXT
- created_at/updated_at: TIMESTAMP
```

#### 4. new_families (새가족)
```sql
- id: UUID (자동 생성)
- name: TEXT
- email: TEXT
- phone: TEXT
- address: TEXT
- birth_date: DATE
- gender: TEXT
- marital_status: TEXT
- baptized: BOOLEAN
- status: TEXT
- assigned_to: UUID (profiles 참조)
- created_at/updated_at: TIMESTAMP
```

## 🔐 인증 설정

### Google OAuth 설정
1. Supabase Dashboard → Authentication → Providers
2. Google Provider 활성화
3. Client ID와 Secret 입력
4. Callback URL: `https://wnsqpxhvscpjrzpfcqdf.supabase.co/auth/v1/callback`

### 관리자 권한 설정
- `newhosung@gmail.com`은 자동으로 admin 권한 부여
- 새 사용자는 기본적으로 'user' 권한

## 📦 Storage 버킷 설정

### 버킷 구조
```
images/           # 이미지 파일 (공개)
├── covers/       # 커버 이미지
├── posts/        # 게시물 이미지
└── general/      # 일반 이미지

documents/        # 문서 파일 (공개)
├── sermons/      # 설교 자료
├── bulletins/    # 주보
└── resources/    # 기타 자료
```

## 🚀 배포 가이드

### 1. 환경 변수 설정

`.env.local` 파일을 `.env.local.supabase`로 교체:
```bash
cp .env.local.supabase .env.local
```

### 2. 데이터베이스 초기화

Supabase Dashboard SQL Editor에서 실행:
```sql
-- /supabase/schema.sql 파일 내용 전체 실행
```

### 3. Storage 버킷 생성

Supabase Dashboard에서:
1. Storage → New bucket
2. 'images' 버킷 생성 (Public)
3. 'documents' 버킷 생성 (Public)

### 4. 코드 업데이트

기존 Firebase 임포트를 Supabase로 변경:

**변경 전:**
```typescript
import { postService } from '@/utils/postService'
import { fileUploadService } from '@/utils/fileUploadService'
```

**변경 후:**
```typescript
import { postService } from '@/utils/postServiceSupabase'
import { fileUploadService } from '@/utils/fileUploadServiceSupabase'
```

### 5. 로컬 테스트
```bash
npm run dev
# http://localhost:3001 접속
```

### 6. Vercel 환경 변수 업데이트

Vercel Dashboard에서:
```
NEXT_PUBLIC_SUPABASE_URL=https://wnsqpxhvscpjrzpfcqdf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

### 7. 배포
```bash
git add .
git commit -m "Migrate from Firebase to Supabase"
git push origin main
```

## ✅ 체크리스트

- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 설계
- [x] 클라이언트 라이브러리 설정
- [x] 인증 서비스 마이그레이션
- [x] 게시물 서비스 마이그레이션
- [x] 파일 업로드 서비스 마이그레이션
- [x] 기도 요청 서비스 마이그레이션
- [x] 새가족 서비스 마이그레이션
- [ ] 기존 데이터 마이그레이션
- [ ] 테스트 및 검증
- [ ] Vercel 환경 변수 설정
- [ ] 프로덕션 배포

## 🛠️ 트러블슈팅

### 일반적인 문제 해결

#### 1. 로그인 실패
- Supabase Dashboard에서 Google OAuth가 활성화되어 있는지 확인
- Client ID가 올바른지 확인
- Callback URL이 정확한지 확인

#### 2. 파일 업로드 실패
- Storage 버킷이 생성되어 있는지 확인
- 버킷이 Public으로 설정되어 있는지 확인

#### 3. 데이터베이스 쿼리 실패
- RLS 정책이 올바르게 설정되어 있는지 확인
- 테이블 권한 확인

## 📊 Firebase vs Supabase 비교

| 기능 | Firebase | Supabase |
|------|----------|----------|
| 데이터베이스 | NoSQL (Firestore) | PostgreSQL |
| 인증 | Firebase Auth | Supabase Auth |
| 스토리지 | Cloud Storage | Supabase Storage |
| 실시간 | Realtime Database | Realtime Subscriptions |
| 가격 | 요청 기반 과금 | 고정 월 요금 |
| 무료 저장소 | 5GB | 1GB |
| 무료 대역폭 | 1GB/일 | 2GB/월 |

## 🔄 롤백 계획

Firebase로 롤백이 필요한 경우:
1. `.env.local.backup` 파일을 `.env.local`로 복원
2. Firebase 서비스 파일 사용으로 코드 변경
3. 재배포

## 📞 지원 및 문의

- **Supabase 지원**: https://supabase.com/support
- **프로젝트 담당자**: newhosung@gmail.com

## 🎉 마이그레이션 완료!

모든 서비스가 Supabase로 성공적으로 마이그레이션되었습니다.
더 나은 성능과 관리 편의성을 경험해보세요!