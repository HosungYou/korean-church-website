# Session: 2026-01-16 - i18n localepath client

## Context
- Session ID: 06DEE245-1A42-4180-9FDB-564489E2DCDF
- Agents Used: [F4-i18nAgent]
- Files Modified: [next-i18next.config.js]

## Summary
클라이언트 네임스페이스 로딩이 실패하던 문제를 해결하기 위해 localePath를 서버/클라이언트 분기 처리했습니다.

## Decisions
- **Decision**: 브라우저에서는 `/locales` 경로를 사용하도록 localePath를 분기.
- **Rationale**: 서버 경로(`./public/locales`)를 그대로 사용하면 클라이언트에서 번역 JSON을 찾지 못해 키가 노출됨.
- **Alternatives Considered**: 네임스페이스별 defaultValue를 늘리는 대신 근본 경로 문제를 수정.

## Action Items
- [ ] [I18N-003] 관리자 로그인 후 홈/공지/리소스 페이지 번역 키 노출 여부 재확인

## Next Steps
로컬/배포 환경에서 `/locales/{lang}/home.json` 로딩 상태를 점검하세요.
