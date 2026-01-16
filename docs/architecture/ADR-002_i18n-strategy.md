# ADR-002: i18n 전략 (next-i18next)

## Status
✅ Accepted

## Date
2025-01-16

## Context

한영 이중언어 교회 웹사이트로서 다국어 지원이 필수적입니다:

1. **주요 사용자**: 한국어/영어 사용 교인
2. **콘텐츠 범위**: 모든 정적 텍스트 + 동적 콘텐츠
3. **SEO**: 각 언어별 URL 구조 필요
4. **유지보수**: 비개발자도 번역 추가/수정 가능

## Decision

**next-i18next**를 다국어 솔루션으로 채택합니다.

### 구현 구조

```
public/
└── locales/
    ├── ko/
    │   ├── common.json
    │   ├── navigation.json
    │   └── [namespace].json
    └── en/
        ├── common.json
        ├── navigation.json
        └── [namespace].json
```

### 사용 패턴

```typescript
// 컴포넌트에서 사용
import { useTranslation } from 'next-i18next'

const Component = () => {
  const { t, i18n } = useTranslation('common')

  // 언어별 폰트 적용
  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  return <div className={fontClass}>{t('greeting')}</div>
}

// SSR/SSG에서 번역 로드
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'navigation'])),
  },
})
```

## Consequences

### Positive
- ✅ Next.js 공식 권장 솔루션
- ✅ SSR/SSG 완벽 지원
- ✅ JSON 파일 기반으로 번역 관리 용이
- ✅ 자동 언어 감지
- ✅ URL 기반 언어 라우팅 (`/ko/...`, `/en/...`)

### Negative
- ⚠️ 모든 페이지에 `getStaticProps` 필요
- ⚠️ 네임스페이스 관리 복잡성

### Neutral
- 📝 기본 언어: 한국어 (ko)
- 📝 지원 언어: 한국어 (ko), 영어 (en)

## Language-Specific Styling

```typescript
// Tailwind 폰트 설정
// tailwind.config.js
fontFamily: {
  korean: ['Noto Sans KR', 'sans-serif'],
  english: ['Inter', 'sans-serif'],
}

// 사용 예시
const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'
```

## Namespace 구조

| Namespace | 용도 |
|-----------|------|
| `common` | 공통 텍스트 (버튼, 레이블 등) |
| `navigation` | 메뉴, 헤더, 푸터 |
| `about` | 교회 소개 페이지 |
| `sermons` | 설교 관련 |
| `education` | 교육부서 관련 |
| `admin` | 관리자 페이지 |

## Alternatives Considered

### react-i18next (without next-i18next)
- **장점**: 더 낮은 수준의 제어
- **단점**: Next.js SSR 직접 구현 필요
- **결론**: next-i18next가 Next.js 통합이 더 좋음

### Lingui
- **장점**: 메시지 추출 자동화
- **단점**: 학습 곡선, 생태계 작음
- **결론**: next-i18next가 더 성숙한 솔루션

### Hardcoded Translations
- **장점**: 초기 구현 간단
- **단점**: 유지보수 불가능
- **결론**: 장기적으로 불가능

## References

- [next-i18next Documentation](https://github.com/i18next/next-i18next)
- [i18next Documentation](https://www.i18next.com/)
- `next-i18next.config.js` - 설정 파일
- `public/locales/` - 번역 파일
