# Session: 2026-01-16 - i18n admin locale sync

## Context
- Session ID: B5F18822-ADDF-4274-95F7-BC2EEBD67BA2
- Agents Used: [F4-i18nAgent, F6-AdminAgent]
- Files Modified: [src/pages/_app.tsx, src/components/Layout.tsx]

## Summary
Admin 로그인 후 번역 키가 그대로 노출되는 문제를 해결하기 위해 Next.js 로케일과 i18n 언어 상태를 동기화하고, 언어 전환을 라우터 기반으로 처리하도록 정리했습니다.

## Decisions
- **Decision**: `_app.tsx`에서 로케일 강제 리다이렉트를 제거하고, `Layout`에서 `router.locale`과 i18n 언어를 동기화하도록 변경.
- **Rationale**: 강제 리다이렉트는 언어 리소스와 라우터 로케일을 어긋나게 만들어 번역 키가 그대로 노출될 수 있음.
- **Alternatives Considered**: i18n 리소스 수동 로드(복잡도 증가) 대신 라우터 기반 전환을 사용.

## Action Items
- [ ] [I18N-001] 운영 환경에서 언어 전환/관리자 로그인 흐름 재검증

## Next Steps
로컬 또는 배포 환경에서 관리자 로그인 후 홈 화면 번역 키 노출 여부를 재확인하세요.
