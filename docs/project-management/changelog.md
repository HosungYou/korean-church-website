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
