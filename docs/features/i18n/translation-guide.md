# i18n 번역 가이드

한영 이중언어 번역 관리 가이드입니다.

---

## 개요

- **라이브러리**: next-i18next
- **기본 언어**: 한국어 (ko)
- **지원 언어**: 한국어 (ko), 영어 (en)
- **번역 파일 위치**: `public/locales/`

---

## 폴더 구조

```
public/
└── locales/
    ├── ko/                 # 한국어
    │   ├── common.json
    │   ├── navigation.json
    │   ├── about.json
    │   ├── sermons.json
    │   ├── education.json
    │   └── admin.json
    └── en/                 # 영어
        ├── common.json
        ├── navigation.json
        ├── about.json
        ├── sermons.json
        ├── education.json
        └── admin.json
```

---

## 네임스페이스 설명

| Namespace | 용도 | 예시 키 |
|-----------|------|---------|
| `common` | 공통 텍스트 | `button.submit`, `error.notFound` |
| `navigation` | 메뉴, 헤더, 푸터 | `menu.home`, `footer.copyright` |
| `about` | 교회 소개 | `greeting.title`, `history.content` |
| `sermons` | 설교 | `live.title`, `archive.description` |
| `education` | 교육부서 | `kindergarten.info`, `youth.schedule` |
| `admin` | 관리자 | `dashboard.title`, `post.create` |

---

## 사용법

### 컴포넌트에서 사용

```typescript
import { useTranslation } from 'next-i18next'

const MyComponent = () => {
  // 단일 네임스페이스
  const { t } = useTranslation('common')

  // 다중 네임스페이스
  const { t } = useTranslation(['common', 'navigation'])

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('navigation:menu.home')}</p>
    </div>
  )
}
```

### 언어별 폰트 적용

```typescript
const { t, i18n } = useTranslation('common')

// 언어별 폰트 클래스
const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

return <div className={fontClass}>{t('greeting')}</div>
```

### 언어 변경

```typescript
const { i18n } = useTranslation()

// 언어 변경
const changeLanguage = (lang: 'ko' | 'en') => {
  i18n.changeLanguage(lang)
}

return (
  <div>
    <button onClick={() => changeLanguage('ko')}>한국어</button>
    <button onClick={() => changeLanguage('en')}>English</button>
  </div>
)
```

### SSR/SSG에서 번역 로드

```typescript
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'navigation'])),
  },
})
```

---

## 번역 파일 예시

### `public/locales/ko/common.json`

```json
{
  "welcome": {
    "title": "환영합니다",
    "subtitle": "하나님의 사랑이 함께하는 곳"
  },
  "button": {
    "submit": "제출",
    "cancel": "취소",
    "save": "저장",
    "delete": "삭제",
    "edit": "수정"
  },
  "error": {
    "notFound": "페이지를 찾을 수 없습니다",
    "serverError": "서버 오류가 발생했습니다"
  }
}
```

### `public/locales/en/common.json`

```json
{
  "welcome": {
    "title": "Welcome",
    "subtitle": "Where God's Love Abides"
  },
  "button": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit"
  },
  "error": {
    "notFound": "Page not found",
    "serverError": "Server error occurred"
  }
}
```

---

## 번역 추가 체크리스트

새 번역 키를 추가할 때:

- [ ] `public/locales/ko/[namespace].json`에 한국어 추가
- [ ] `public/locales/en/[namespace].json`에 영어 추가
- [ ] 키 이름이 의미를 명확히 전달하는지 확인
- [ ] 중첩 구조가 일관적인지 확인
- [ ] 개발 서버 재시작 (변경사항 반영)

---

## 변수 삽입

```json
// common.json
{
  "greeting": "안녕하세요, {{name}}님!"
}
```

```typescript
// 컴포넌트
t('greeting', { name: user.name })
// 결과: "안녕하세요, 홍길동님!"
```

---

## 복수형 처리

```json
// common.json
{
  "post_one": "{{count}}개의 게시글",
  "post_other": "{{count}}개의 게시글"
}
```

```typescript
t('post', { count: 5 })
// 결과: "5개의 게시글"
```

---

## 문제 해결

### 번역이 표시되지 않음

1. 네임스페이스가 `getStaticProps`에 포함되어 있는지 확인
2. JSON 파일 문법 오류 확인
3. 개발 서버 재시작

### 언어 변경이 작동하지 않음

1. `next-i18next.config.js` 설정 확인
2. `_app.tsx`에서 `appWithTranslation` 래퍼 확인

### 폰트가 이상하게 표시됨

1. Tailwind 설정에서 `font-korean`, `font-english` 확인
2. `i18n.language` 기반 폰트 클래스 적용 확인
