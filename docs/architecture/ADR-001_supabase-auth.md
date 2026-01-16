# ADR-001: Supabase Auth 도입

## Status
✅ Accepted

## Date
2025-01-16

## Context

교회 웹사이트 관리자 인증 시스템이 필요했습니다. 주요 요구사항:

1. **Google OAuth 지원**: 교회 관리자들이 Google 계정으로 쉽게 로그인
2. **보안**: 민감한 콘텐츠(공지사항, 설교 등) 관리에 적합한 인증
3. **개발 효율성**: 빠른 구현과 유지보수
4. **비용**: 소규모 교회에 적합한 무료/저비용 솔루션

## Decision

**Supabase Auth**를 관리자 인증 시스템으로 채택합니다.

### 구현 구조

```
lib/
├── supabase.ts          # 클라이언트 설정
└── supabaseAdmin.ts     # Admin SDK

src/hooks/
└── useAdminAuth.ts      # 인증 상태 관리 훅
```

### 인증 플로우

```
1. 관리자가 /admin/login 접속
2. "Google로 로그인" 버튼 클릭
3. Supabase → Google OAuth 리다이렉트
4. 인증 성공 시 /admin/dashboard로 이동
5. useAdminAuth 훅이 세션 상태 관리
```

## Consequences

### Positive
- ✅ Google OAuth 네이티브 지원
- ✅ 무료 티어로 충분한 사용량
- ✅ React 훅 기반 간편한 상태 관리
- ✅ localStorage 폴백으로 세션 지속성
- ✅ TypeScript 완벽 지원

### Negative
- ⚠️ Firebase Auth 대비 커뮤니티 크기 작음

### Neutral
- 📝 Supabase PostgreSQL과 완전 통합 (단일 플랫폼)
- 📝 인증과 데이터베이스가 동일 서비스에서 관리됨

## Alternatives Considered

### Firebase Authentication
- **장점**: 대규모 커뮤니티, 풍부한 문서
- **단점**: Google OAuth 설정이 더 복잡
- **결론**: Supabase의 더 간단한 OAuth 설정 및 PostgreSQL 통합 선호

### NextAuth.js
- **장점**: Next.js 생태계 표준
- **단점**: 자체 DB 필요, 설정 복잡
- **결론**: Supabase의 턴키 솔루션 선호

### Custom JWT Auth
- **장점**: 완전한 제어권
- **단점**: 개발/유지보수 부담
- **결론**: 오버엔지니어링으로 판단

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- `src/hooks/useAdminAuth.ts` - 구현 코드
- `lib/supabase.ts` - 클라이언트 설정
