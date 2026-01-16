# Session: 2026-01-16 - data fetch & CSP fixes

## Context
- Session ID: B1BCABB1-9E04-43CD-8914-FAF5CD22418C
- Agents Used: [F4-i18nAgent, F6-AdminAgent]
- Files Modified: [next.config.js, src/pages/news/announcements.tsx, src/pages/resources.tsx, src/pages/news/posts/[id].tsx, src/utils/postService.ts]

## Summary
누락된 API 엔드포인트로 인해 발생하던 404/JSON 파싱 오류를 Supabase 직접 조회로 변경하고, Google Fonts 로딩을 허용하도록 CSP를 보완했습니다. 뉴스 상세 페이지는 로케일을 강제하지 않도록 수정했습니다.

## Decisions
- **Decision**: `/api/posts/*` 호출을 제거하고 클라이언트에서 Supabase 조회로 대체.
- **Rationale**: 해당 API 라우트가 존재하지 않아 404 및 JSON 파싱 오류가 발생.
- **Alternatives Considered**: API 라우트 신규 구현보다 빠른 안정화를 위해 클라이언트 조회로 우선 전환.

## Action Items
- [ ] [BUG-001] 게시글 등록 오류 원인(테이블 컬럼/권한) 확인 및 해결
- [ ] [I18N-002] 번역 키 노출 재현 시 로케일/네임스페이스 로딩 경로 추가 점검

## Next Steps
운영 환경에서 게시글 등록 에러 메시지와 콘솔 로그를 확보하세요.
