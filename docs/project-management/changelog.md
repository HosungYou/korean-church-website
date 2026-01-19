# 변경 이력 (Changelog)

모든 주요 변경사항을 기록합니다.

---

## [Unreleased]

### Added
- -

### Changed
- -

### Fixed
- -

### Removed
- -

---

## [2.4.0] - 2026-01-19

### Added
- **제자훈련 시스템 신규 생성** (`/training`)
  - 훈련 프로그램 관리 (training_programs 테이블)
  - 주차별 교육 자료 관리 (training_materials 테이블)
  - PDF, 영상, 오디오 파일 지원
  - 프로그램 카테고리: 제자훈련, 성경공부, 리더십훈련, 세례교육, 일반
  - 주차별 커리큘럼 구조 (1-52주 지원)
  - VS Design Diverge 디자인 시스템 적용 (Editorial Minimalism + 한국적 미학)
  - OKLCH 색상 시스템 적용
  - 조회수 추적 기능

- **관리자 페이지** (`/admin/training`)
  - 프로그램 목록 관리 (검색, 필터링, 통계)
  - 프로그램 생성/수정/삭제
  - 자료 추가/수정/삭제 (PDF, 영상, 오디오)
  - 커버 이미지 업로드
  - 공개/비공개 전환

- **공개 페이지** (`/training`, `/training/[id]`)
  - 프로그램 목록 페이지 (카테고리 필터, 통계)
  - 프로그램 상세 페이지 (주차별 아코디언 UI)
  - 자료 타입별 필터링
  - 자료 다운로드/재생

### Changed
- **네비게이션 메뉴 업데이트**
  - "양육/훈련" 메뉴 재구성
  - `/education/training` → `/training` 경로 변경
  - 메뉴 순서: 제자훈련 > 한글학교 > 새가족 등록

### Database
- `training_programs` 테이블 생성
  - id, title, description, category, cover_image_url
  - total_weeks, is_visible, sort_order
  - created_at, updated_at

- `training_materials` 테이블 생성
  - id, program_id (FK), title, description
  - week_number, material_type (pdf/video/audio)
  - file_url, duration_minutes, view_count
  - is_visible, sort_order
  - created_at, updated_at

- RLS 정책: admin_users 이메일 기반 권한 관리

### Files
- `src/utils/trainingService.ts` - 훈련 시스템 서비스 파일
- `src/pages/training/index.tsx` - 공개 프로그램 목록 페이지
- `src/pages/training/[id].tsx` - 공개 프로그램 상세 페이지
- `src/pages/admin/training/index.tsx` - 관리자 프로그램 목록
- `src/pages/admin/training/new.tsx` - 관리자 프로그램 생성
- `src/pages/admin/training/[id].tsx` - 관리자 프로그램 편집
- `public/locales/ko/training.json` - 한국어 번역
- `public/locales/en/training.json` - 영어 번역
- `types/supabase.ts` - TypeScript 타입 추가
- `supabase/migrations/20260119_create_training_tables.sql` - DB 마이그레이션

---

## [2.3.0] - 2026-01-19

### Added
- **통합 예배 페이지 신규 생성** (`/worship`)
  - 주일예배, 수요예배, 새벽기도 정보 통합
  - 새벽기도 Zoom 링크 (https://tinyurl.com/sckc3)
  - YouTube Live "준비중" 표시
  - 헌금 안내 (헌금봉투, 우편, PayPal, Venmo)
  - VS Design Diverge 디자인 시스템 적용 (Editorial Minimalism + 한국적 미학)
  - OKLCH 색상 시스템 적용

### Changed
- **네비게이션 메뉴 단순화**
  - 기존 "예배" 메뉴: 설교, 주일설교, 수요설교, 예배안내 (4개)
  - 신규 "예배" 메뉴: 예배안내, 주일설교, 수요설교 (3개)
  - `/about/service-info` 대신 `/worship` 페이지로 통합

### Files
- `src/pages/worship.tsx` - 통합 예배 페이지 신규 생성
- `public/locales/ko/worship.json` - 한국어 번역 파일
- `public/locales/en/worship.json` - 영어 번역 파일
- `src/components/Layout.tsx` - 네비게이션 메뉴 업데이트
- `public/locales/ko/common.json` - 네비게이션 키 추가
- `public/locales/en/common.json` - 네비게이션 키 추가

---

## [2.2.2] - 2026-01-18

### Fixed
- **갤러리 앨범 편집 권한 오류 수정**: 관리자가 갤러리 앨범 생성/수정 시 "저장 중 오류가 발생했습니다" 에러 해결
  - **원인**: RLS 정책이 `profiles` 테이블을 확인했으나, 실제 관리자 정보는 `admin_users` 테이블에 저장됨
  - **증상**: `gallery_albums`, `gallery_photos` 테이블에 INSERT/UPDATE 시 403 에러
  - **해결**: RLS 정책을 `admin_users` 테이블 기반으로 변경 + `auth.jwt()->>'email'` 사용 + `LOWER()` 함수로 대소문자 무관 비교

### Database
- `gallery_albums` RLS 정책 재생성:
  - `gallery_albums_select_public`: 모든 사용자 SELECT 허용
  - `gallery_albums_insert_admin`: `admin_users` 테이블 기반 INSERT 권한
  - `gallery_albums_update_admin`: `admin_users` 테이블 기반 UPDATE 권한
  - `gallery_albums_delete_admin`: `admin_users` 테이블 기반 DELETE 권한
- `gallery_photos` RLS 정책 재생성:
  - `gallery_photos_select_public`: 모든 사용자 SELECT 허용
  - `gallery_photos_insert_admin`: `admin_users` 테이블 기반 INSERT 권한
  - `gallery_photos_update_admin`: `admin_users` 테이블 기반 UPDATE 권한
  - `gallery_photos_delete_admin`: `admin_users` 테이블 기반 DELETE 권한

### Migration
- `supabase/migrations/20260118_fix_gallery_rls_policies.sql` 추가

---

## [2.2.1] - 2026-01-18

### Fixed
- **관리자 로그인 버그 수정**: 새로 추가된 관리자가 Google 로그인 시 접근 거부되는 문제 해결
  - **원인 1**: `admin_users.id`가 `auth.users.id`와 불일치하여 인증 실패
  - **원인 2**: 이메일 대소문자 불일치 (`KyuHongYeon@gmail.com` vs `kyuhongyeon@gmail.com`)
  - **해결**:
    - `callback.tsx`, `useAdminAuth.ts`에서 ID 기반 조회를 **이메일 기반 조회**로 변경
    - 첫 로그인 시 `admin_users.id`를 `auth.users.id`와 자동 동기화하는 로직 추가
    - **이메일 소문자 정규화**: 모든 이메일 비교/저장 시 소문자로 변환
  - **영향받은 사용자**: `leesinhak@gmail.com`, `kyuhongyeon@gmail.com` (DB 수동 수정 완료)
  - **향후 예방**:
    - 새 관리자 추가 시 이메일이 자동으로 소문자로 저장됨
    - 첫 로그인 시 ID가 자동 동기화됨

### Changed
- `src/hooks/useAdminAuth.ts`: 이메일 소문자 변환 + 이메일 기반 관리자 조회 + ID 자동 동기화
- `src/pages/auth/callback.tsx`: 이메일 소문자 변환 + 이메일 기반 관리자 조회 + ID 자동 동기화
- `src/utils/adminService.ts`: 관리자 추가 시 이메일을 소문자로 정규화하여 저장

### Database
- `admin_users` 테이블:
  - `leesinhak@gmail.com`의 `id`를 `auth.users.id`와 일치하도록 업데이트
  - `KyuHongYeon@gmail.com` → `kyuhongyeon@gmail.com`으로 변경 + ID 동기화

---

## [2.2.0] - 2025-01-16

### Added
- Sub-Agent 시스템 도입 (CLAUDE.md)
- 프로젝트 문서화 구조 (DOCS/)
- ADR (Architecture Decision Records) 작성
  - ADR-001: Supabase Auth
  - ADR-002: i18n 전략
  - ADR-003: Supabase PostgreSQL

### Changed
- ADR-003을 Firebase Firestore에서 Supabase PostgreSQL로 업데이트
- posts-system.md를 Supabase 기반으로 업데이트

---

## [2.1.0] - 2025-01-16

### Added
- 관리자 대시보드 완성
- admin_users 테이블 기반 권한 관리
- 기도요청 기능 (prayer_requests, prayer_replies 테이블)

### Changed
- profiles 테이블 대신 admin_users 테이블 사용

### Fixed
- 타입 오류 및 빌드 오류 수정

---

## [2.0.0] - 2025-01-16

### Added
- Supabase PostgreSQL 완전 마이그레이션
- 새가족 등록 시스템 (new_family_registrations 테이블)
- 이메일 구독 시스템 (email_subscribers 테이블)
- Supabase Realtime 지원

### Changed
- Firebase Firestore → Supabase PostgreSQL 마이그레이션
- postService.ts: Supabase 쿼리 패턴 적용
- emailService.ts: Supabase 기반으로 재작성
- newFamilyService.ts: Supabase 기반으로 재작성

### Removed
- lib/firebase.ts
- lib/firebaseAdmin.ts
- Firebase 관련 의존성

---

## [1.0.0] - 2025-01-16

### Added
- 초기 프로젝트 설정
- Next.js 14 + TypeScript + Tailwind CSS
- Supabase Auth (Google OAuth)
- 한영 이중언어 지원 (next-i18next)
- 관리자 대시보드 기본 구조
- 게시글 CRUD 시스템
- 교회 소개 페이지 (인사말, 역사, 사역자, 예배안내, 오시는길)
- 설교 페이지 (주일, 수요, 금요, 찬양)
- 교육부서 페이지 (영아부, 유치부, 초등부, 중고등부, 청년부, 한글학교)
- 선교 페이지 (국내, 해외, 제자훈련, 새가족)
- 뉴스 페이지 (공지사항, 갤러리, 주보)

---

## 변경 이력 작성 가이드

### 카테고리

- **Added**: 새로운 기능
- **Changed**: 기존 기능 변경
- **Deprecated**: 곧 제거될 기능
- **Removed**: 제거된 기능
- **Fixed**: 버그 수정
- **Security**: 보안 관련 변경

### 형식

```markdown
## [버전] - YYYY-MM-DD

### Added
- 새로운 기능 설명

### Changed
- 변경된 기능 설명

### Fixed
- 수정된 버그 설명
```

### 버전 규칙 (Semantic Versioning)

- **Major (X.0.0)**: 호환성 깨는 변경
- **Minor (0.X.0)**: 새 기능 추가 (호환성 유지)
- **Patch (0.0.X)**: 버그 수정
