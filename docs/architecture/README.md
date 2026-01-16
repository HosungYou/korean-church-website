# Architecture Decision Records (ADR)

Korean Church Website 프로젝트의 아키텍처 결정 기록입니다.

---

## ADR 인덱스

| ID | 제목 | 상태 | 날짜 |
|----|------|------|------|
| [ADR-001](./ADR-001_supabase-auth.md) | Supabase Auth 도입 | ✅ Accepted | 2025-01-16 |
| [ADR-002](./ADR-002_i18n-strategy.md) | i18n 전략 (next-i18next) | ✅ Accepted | 2025-01-16 |
| [ADR-003](./ADR-003_supabase-postgresql.md) | Supabase PostgreSQL 데이터베이스 | ✅ Accepted | 2025-01-16 |

---

## ADR 작성 규칙

### 파일명 형식
```
ADR-XXX_[kebab-case-title].md
```

### 템플릿

```markdown
# ADR-XXX: [제목]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-YYY]

## Context
[결정이 필요한 맥락과 문제 상황]

## Decision
[내린 결정 사항]

## Consequences
### Positive
- [긍정적 결과]

### Negative
- [부정적 결과]

### Neutral
- [중립적 결과]

## Alternatives Considered
[검토한 대안들]

## References
[참고 자료]
```

---

## ADR 상태 정의

- **Proposed**: 검토 중
- **Accepted**: 채택됨 (현재 적용 중)
- **Deprecated**: 더 이상 사용하지 않음
- **Superseded**: 다른 ADR로 대체됨
