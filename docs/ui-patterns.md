# UI 패턴 가이드

## 개요

이 문서는 스위트 월드 침례교회 웹사이트에서 사용되는 주요 UI 패턴과 구현 방법을 설명합니다.

## 페이지 레이아웃 패턴

### 1. 기본 페이지 구조
```typescript
<Layout>
  <Header />           // 페이지 타이틀 및 브레드크럼
  <MainContent />      // 주요 콘텐츠 영역
  <Footer />           // 페이지 하단 (Layout에 포함)
</Layout>
```

### 2. 헤더 패턴
```typescript
// 그라데이션 헤더 (권장)
<div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center">
      <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
      <h1 className="text-4xl font-bold text-white font-korean">페이지 제목</h1>
    </div>
  </div>
</div>
```

## 카드 패턴

### 1. 기본 카드
```typescript
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="p-6 md:p-8">
    {/* 카드 내용 */}
  </div>
</div>
```

### 2. 리스트 아이템 카드
```typescript
<div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <span className="badge badge-announcement">배지</span>
        <div className="text-sm text-gray-500">메타 정보</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">제목</h3>
      <p className="text-sm text-gray-600">설명</p>
    </div>
  </div>
</div>
```

### 3. 이미지 카드
```typescript
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  {coverImageUrl && (
    <div className="w-full h-64 relative">
      <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
    </div>
  )}
  <div className="p-6">
    {/* 카드 내용 */}
  </div>
</div>
```

## 네비게이션 패턴

### 1. 탭 네비게이션
```typescript
<div className="flex border-b border-gray-200 flex-wrap">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 font-korean font-medium transition-colors ${
        activeTab === tab
          ? 'text-black border-b-2 border-black'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {tab}
    </button>
  ))}
</div>
```

### 2. 브레드크럼
```typescript
<Link href="/parent" className="inline-flex items-center text-white/80 hover:text-white transition-colors font-korean">
  <ArrowLeft className="w-4 h-4 mr-2" />
  상위 페이지로 돌아가기
</Link>
```

## 폼 패턴

### 1. 기본 입력 필드
```typescript
<input
  type="text"
  placeholder="입력해주세요"
  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black font-korean"
/>
```

### 2. 검색 필드
```typescript
<div className="flex-1 relative">
  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
  <input
    type="text"
    placeholder="검색어를 입력해주세요"
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
  />
</div>
```

### 3. 이메일 구독 폼
```typescript
<form className="flex gap-3">
  <input
    type="email"
    placeholder="이메일 주소를 입력해주세요"
    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
    required
  />
  <button
    type="submit"
    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-korean flex items-center"
  >
    <Bell className="w-4 h-4 mr-2" />
    구독하기
  </button>
</form>
```

## 버튼 패턴

### 1. Primary 버튼
```typescript
<button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-korean font-medium">
  버튼 텍스트
</button>
```

### 2. Secondary 버튼
```typescript
<button className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-korean font-medium">
  버튼 텍스트
</button>
```

### 3. 아이콘 버튼
```typescript
<button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors font-korean">
  <Icon className="w-4 h-4 mr-2" />
  버튼 텍스트
</button>
```

## 배지 패턴

### 1. 카테고리 배지
```typescript
<span className={`text-xs px-2 py-1 rounded font-korean ${
  type === 'announcement' ? 'bg-blue-100 text-blue-700' :
  type === 'event' ? 'bg-green-100 text-green-700' :
  'bg-gray-100 text-gray-700'
}`}>
  {type === 'announcement' ? '공지사항' : type === 'event' ? '행사' : '일반'}
</span>
```

### 2. 상태 배지
```typescript
<span className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded font-korean">
  상태
</span>
```

## 로딩 패턴

### 1. 스피너
```typescript
<div className="min-h-screen flex items-center justify-center">
  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
</div>
```

### 2. 스켈레톤
```typescript
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

## 에러 패턴

### 1. 404 페이지
```typescript
<div className="text-center">
  <h1 className="text-2xl font-bold text-gray-900 font-korean mb-4">페이지를 찾을 수 없습니다</h1>
  <Link href="/" className="text-blue-600 hover:text-blue-800 font-korean">
    홈으로 돌아가기
  </Link>
</div>
```

### 2. 빈 상태
```typescript
<div className="p-12 text-center text-gray-500 font-korean">
  표시할 내용이 없습니다.
</div>
```

## 공유 패턴

### 1. 소셜 공유 버튼
```typescript
<div className="flex items-center gap-3">
  <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors font-korean">
    <Facebook className="w-4 h-4 mr-2" />
    페이스북
  </button>
  <button className="inline-flex items-center px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors font-korean">
    <Twitter className="w-4 h-4 mr-2" />
    트위터
  </button>
</div>
```

## 반응형 패턴

### 1. 그리드 레이아웃
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 그리드 아이템들 */}
</div>
```

### 2. 플렉스 레이아웃
```typescript
<div className="flex flex-col sm:flex-row gap-4">
  {/* 플렉스 아이템들 */}
</div>
```

### 3. 숨김/표시 패턴
```typescript
<div className="hidden md:block">데스크톱에서만 표시</div>
<div className="md:hidden">모바일에서만 표시</div>
```

## 애니메이션 패턴

### 1. 호버 효과
```typescript
<div className="hover:bg-gray-50 transition-colors cursor-pointer">
  호버 시 배경색 변경
</div>
```

### 2. 스케일 효과
```typescript
<div className="hover:scale-105 transition-transform duration-200">
  호버 시 확대
</div>
```

### 3. 페이드 효과
```typescript
<div className="hover:opacity-80 transition-opacity duration-150">
  호버 시 투명도 변경
</div>
```

## 접근성 패턴

### 1. 키보드 네비게이션
```typescript
<button
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  className="focus:ring-2 focus:ring-black focus:outline-none"
>
  접근 가능한 버튼
</button>
```

### 2. 스크린 리더 지원
```typescript
<img src={src} alt="의미 있는 이미지 설명" />
<button aria-label="구체적인 동작 설명">
  <Icon />
</button>
```

### 3. 의미적 HTML
```typescript
<main>
  <article>
    <header>
      <h1>기사 제목</h1>
    </header>
    <section>
      <p>기사 내용</p>
    </section>
  </article>
</main>
```

## 성능 최적화 패턴

### 1. 이미지 최적화
```typescript
import Image from 'next/image'

<Image
  src={imageSrc}
  alt={altText}
  width={800}
  height={600}
  className="w-full h-auto"
  priority={isAboveFold}
/>
```

### 2. 컴포넌트 레이지 로딩
```typescript
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
})
```

### 3. 메모이제이션
```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(dependency)
}, [dependency])

const MemoizedComponent = memo(Component)
```

이러한 패턴들을 일관성 있게 사용하여 사용자 경험을 향상시키고 개발 효율성을 높일 수 있습니다.