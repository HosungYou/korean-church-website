# Session: 2026-01-20 - 성경통독 자료 페이지 배너 업데이트

## Context
- **Session ID**: 7b3a8c3d-add6-40a2-b103-c3c42d8a012c
- **Agents Used**: F1-FrontendAgent, F4-i18nAgent
- **Files Modified**:
  - `src/pages/bible-materials/index.tsx`
  - `public/locales/ko/common.json`
  - `public/locales/en/common.json`

## Summary

성경통독 자료 페이지의 배너를 QT(묵상) 페이지와 동일한 스타일로 업데이트하고, 카테고리 카운트가 0으로 표시되던 문제를 해결했습니다.

### 변경 사항

1. **배너 컴포넌트 교체**
   - 기존 커스텀 헤더 섹션을 `PageHeader` 컴포넌트로 교체
   - 이미지 배경, OKLCH 색상 시스템, grain 오버레이 적용
   - VS Design Diverge 디자인 시스템 준수

2. **카테고리 카운트 동적 업데이트**
   - 문제: `getStaticProps`에서 빌드 시점에 계산된 카운트가 0으로 표시됨
   - 해결: `useEffect` 훅으로 클라이언트 측에서 실시간 카운트 로드
   ```typescript
   useEffect(() => {
     async function loadCounts() {
       const counts = await getMaterialCountByCategory()
       setCategoryCounts(counts)
     }
     loadCounts()
   }, [])
   ```

3. **번역 키 추가**
   - 한국어: `bible_materials.label` = "성경통독"
   - 영어: `bible_materials.label` = "Bible Study"

## Decisions

- **Decision**: 정적 생성(SSG) 유지 + 클라이언트 측 데이터 패칭 조합
- **Rationale**: 초기 로드 속도를 위해 SSG 유지하면서, 실시간 데이터는 클라이언트에서 업데이트
- **Alternatives Considered**:
  - `getServerSideProps`로 변경 (SEO 및 성능 저하 우려로 기각)
  - ISR revalidate 주기 단축 (실시간성 부족으로 기각)

## Technical Details

### PageHeader 사용 패턴

```tsx
<PageHeader
  label={t('bible_materials.label') || '성경통독'}
  title={t('bible_materials.title') || '성경통독 자료'}
  subtitle={t('bible_materials.description') || '성경 통독을 위한 자료와 해설을 제공합니다.'}
/>
```

### 필터 버튼 스타일 (VS Design Diverge)

```tsx
style={{
  background: selectedCategory === 'all'
    ? 'oklch(0.45 0.12 265)'  // Primary indigo
    : 'oklch(0.97 0.005 75)', // Neutral light
  color: selectedCategory === 'all'
    ? 'oklch(0.98 0.003 75)'  // White
    : 'oklch(0.35 0.02 265)', // Dark text
  border: `1px solid ${
    selectedCategory === 'all'
      ? 'oklch(0.45 0.12 265)'
      : 'oklch(0.88 0.005 75)'
  }`,
}}
```

## Verification

- [x] 로컬 빌드 성공 (134 pages)
- [x] Vercel 프로덕션 배포 완료
- [x] 배너 이미지 배경 정상 표시
- [x] 카테고리 카운트 동적 업데이트 확인
- [x] 한/영 번역 정상 동작

## Related Pages

다음 페이지들이 동일한 `PageHeader` 컴포넌트를 사용하여 배너 스타일이 통일됨:
- `/bible-reading` (QT 묵상)
- `/sermons/*` (설교 페이지들)
- `/about/*` (교회 소개 페이지들)
- `/education/*` (교육부서 페이지들)
- `/missions/*` (선교 페이지들)
- 총 38개 이상의 페이지

## Deployment

- **Platform**: Vercel
- **URL**: https://korean-church-website.vercel.app/bible-materials
- **Build Time**: 49 seconds
- **Status**: Production 배포 완료

## Next Steps

- [ ] 사용자 피드백 수집 후 추가 UI 개선 검토
- [ ] 성경통독 자료 콘텐츠 추가 (관리자 페이지에서)
