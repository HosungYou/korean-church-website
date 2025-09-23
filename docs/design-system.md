# 스테이트 칼리지 한인교회 웹사이트 디자인 시스템

## 개요

스테이트 칼리지 한인교회 웹사이트는 **미니멀리즘**과 **모던함**을 핵심 가치로 하는 디자인 시스템을 채택하고 있습니다. 전체적으로 깔끔하고 접근하기 쉬우며, 교회의 따뜻함과 전문성을 동시에 전달하는 것을 목표로 합니다.

## 디자인 철학

### 1. 미니멀리즘 (Minimalism)
- **Simple is Better**: 불필요한 장식 요소를 제거하고 콘텐츠에 집중
- **화이트 스페이스 활용**: 충분한 여백을 통해 가독성과 집중도 향상
- **명확한 위계구조**: 정보의 우선순위를 명확하게 시각화

### 2. 모던 디자인 (Modern Design)
- **깔끔한 타이포그래피**: 가독성이 뛰어난 한글 폰트 체계
- **기하학적 형태**: 둥근 모서리와 부드러운 그라데이션
- **반응형 디자인**: 모든 디바이스에서 일관된 사용자 경험

### 3. 접근성 우선 (Accessibility First)
- **고대비 색상**: 시각적 접근성을 고려한 색상 선택
- **명확한 네비게이션**: 직관적인 사용자 인터페이스
- **다양한 연령층 고려**: 노년층도 쉽게 사용할 수 있는 UI

## 컬러 시스템

### Primary Colors
- **Black**: `#000000` - 주요 텍스트, 액센트 요소
- **White**: `#FFFFFF` - 배경색, 카드 배경
- **Gray-900**: `#111827` - 다크 배경, 헤더
- **Gray-800**: `#1F2937` - 그라데이션, 버튼 호버

### Secondary Colors
- **Gray-50**: `#F9FAFB` - 서브 배경, 카드 섹션
- **Gray-100**: `#F3F4F6` - 구분선, 비활성 배경
- **Gray-500**: `#6B7280` - 서브 텍스트
- **Gray-700**: `#374151` - 일반 텍스트

### Accent Colors
- **Blue-600**: `#2563EB` - 공지사항 배지, 링크
- **Blue-100**: `#DBEAFE` - 공지사항 배지 배경
- **Green-600**: `#16A34A` - 행사 배지
- **Green-100**: `#DCFCE7` - 행사 배지 배경

### Usage Guidelines
- **Primary Black**: 제목, 중요한 버튼, 브랜드 요소
- **Gray Gradients**: 헤더, 히어로 섹션, 카드 오버레이
- **Accent Colors**: 카테고리 구분, 상태 표시, 액션 요소

## 타이포그래피

### 폰트 패밀리
```css
.font-korean {
  font-family: 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif;
}
```

### 폰트 크기 체계
- **Heading 1**: `3rem` (48px) - 페이지 메인 제목
- **Heading 2**: `2rem` (32px) - 섹션 제목
- **Heading 3**: `1.5rem` (24px) - 서브 섹션 제목
- **Body Large**: `1.125rem` (18px) - 중요한 본문
- **Body**: `1rem` (16px) - 일반 본문
- **Small**: `0.875rem` (14px) - 캡션, 메타 정보
- **XSmall**: `0.75rem` (12px) - 배지, 라벨

### 폰트 두께
- **Bold (700)**: 제목, 강조 텍스트
- **Semibold (600)**: 서브 제목, 중요한 내용
- **Medium (500)**: 버튼 텍스트, 네비게이션
- **Regular (400)**: 일반 본문

## 레이아웃 시스템

### 컨테이너
- **Max Width**: `1280px` (7xl)
- **Padding**: `16px` (모바일), `24px` (태블릿), `32px` (데스크톱)

### 그리드 시스템
- **12 Column Grid**: Tailwind CSS 그리드 시스템 활용
- **Responsive Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

### 간격 체계
- **XS**: `4px` - 아이콘과 텍스트 사이
- **SM**: `8px` - 관련 요소 간격
- **MD**: `16px` - 카드 내부 패딩
- **LG**: `24px` - 섹션 간 간격
- **XL**: `48px` - 메이저 섹션 간격

## 컴포넌트 시스템

### 버튼
```css
/* Primary Button */
.btn-primary {
  @apply px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-korean font-medium;
}

/* Secondary Button */
.btn-secondary {
  @apply px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-korean font-medium;
}
```

### 카드
```css
.card {
  @apply bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden;
}

.card-padding {
  @apply p-6 md:p-8;
}
```

### 배지
```css
.badge {
  @apply text-xs px-2 py-1 rounded font-korean;
}

.badge-announcement {
  @apply bg-blue-100 text-blue-700;
}

.badge-event {
  @apply bg-green-100 text-green-700;
}
```

## 아이콘 시스템

### 라이브러리
- **Lucide React**: 일관성 있고 모던한 아이콘 세트
- **크기**: 16px, 20px, 24px (상황에 따라 선택)
- **스타일**: Outline 스타일로 통일

### 사용 가이드라인
- **네비게이션**: 명확한 의미 전달을 위한 아이콘 사용
- **액션 버튼**: 아이콘 + 텍스트 조합으로 명확성 향상
- **상태 표시**: 일관된 아이콘으로 상태 구분

## 애니메이션

### 트랜지션
- **Duration**: `150ms` (빠른), `300ms` (일반), `500ms` (느린)
- **Easing**: `ease-in-out` (기본), `ease-out` (enter), `ease-in` (exit)

### 호버 효과
```css
.hover-lift {
  @apply hover:shadow-lg hover:scale-105 transition-all duration-200;
}

.hover-fade {
  @apply hover:opacity-80 transition-opacity duration-150;
}
```

## 반응형 디자인

### 모바일 우선 접근법
1. **Mobile First**: 320px부터 시작
2. **Progressive Enhancement**: 점진적 기능 향상
3. **Touch Friendly**: 44px 이상의 터치 타겟

### 브레이크포인트별 고려사항
- **Mobile (< 768px)**: 단일 컬럼, 대형 버튼, 간소화된 네비게이션
- **Tablet (768px - 1024px)**: 2-3 컬럼 레이아웃, 사이드바 활용
- **Desktop (> 1024px)**: 다중 컬럼, 풍부한 인터랙션

## 성능 최적화

### 이미지
- **WebP 포맷** 우선 사용
- **적절한 크기 조정**: Next.js Image 컴포넌트 활용
- **Lazy Loading**: 스크롤 시 점진적 로드

### 폰트
- **서브셋 로딩**: 필요한 글자만 로드
- **Font Display Swap**: 폰트 로딩 중 텍스트 표시

## 접근성 가이드라인

### WCAG 2.1 AA 준수
- **색상 대비**: 4.5:1 이상 유지
- **키보드 네비게이션**: 모든 인터랙티브 요소 접근 가능
- **스크린 리더**: 의미 있는 alt 텍스트 제공

### 시맨틱 HTML
- **적절한 헤딩 구조**: h1 → h2 → h3 순서 준수
- **랜드마크 역할**: header, nav, main, footer 사용
- **포커스 표시**: 명확한 포커스 인디케이터

## 브랜드 가이드라인

### 교회 정체성 반영
- **신뢰감**: 깔끔하고 전문적인 디자인
- **따뜻함**: 부드러운 색상과 둥근 모서리
- **현대적**: 모던한 레이아웃과 타이포그래피

### 톤앤매너
- **정중하고 친근함**: 존댓말 사용, 따뜻한 인사
- **명확하고 간결함**: 복잡한 설명보다 핵심 전달
- **포용적**: 모든 연령층과 배경의 사람들 고려

## 개발 가이드라인

### CSS 방법론
- **Tailwind CSS**: 유틸리티 클래스 우선 사용
- **Component-based**: 재사용 가능한 컴포넌트 설계
- **Responsive-first**: 모바일부터 시작하는 반응형 설계

### 파일 구조
```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # Next.js 페이지
├── styles/        # 글로벌 스타일
└── utils/         # 유틸리티 함수
```

### 네이밍 컨벤션
- **컴포넌트**: PascalCase (예: `NewsCard`)
- **파일명**: kebab-case (예: `news-card.tsx`)
- **CSS 클래스**: Tailwind 유틸리티 클래스 활용

## 콘텐츠 가이드라인

### 이미지
- **최적 크기**: 1920x1080 (16:9 비율)
- **압축**: WebP 포맷, 80% 품질
- **alt 텍스트**: 의미 있는 설명 필수

### 텍스트
- **가독성**: 줄 높이 1.6-1.8 유지
- **단락**: 2-3문장으로 구성
- **제목**: 명확하고 간결한 표현

### 일관성
- **용어 통일**: 같은 의미는 같은 단어 사용
- **스타일 가이드**: 문체와 표현 방식 통일
- **업데이트**: 정기적인 콘텐츠 검토 및 갱신

---

이 디자인 시스템은 지속적으로 발전하며, 사용자 피드백과 기술 발전에 따라 업데이트됩니다.