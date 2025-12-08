# 🛠️ Supabase 설정 명령어 모음

## 1. Supabase Dashboard SQL Editor에서 실행할 명령어

### 데이터베이스 스키마 생성
```sql
-- 전체 스키마 파일 실행
-- /supabase/schema.sql 파일의 전체 내용을 복사하여 실행
```

### Storage 버킷 생성 (SQL)
```sql
-- Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('images', 'images', true),
  ('documents', 'documents', true);

-- Storage 정책 설정
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('images', 'documents'));

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (auth.uid() = owner);

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (auth.uid() = owner);
```

## 2. 로컬 개발 환경 설정

### 환경 변수 설정
```bash
# .env.local 파일 백업
cp .env.local .env.local.firebase-backup

# Supabase 환경 변수로 교체
cp .env.local.supabase .env.local
```

### 패키지 설치 (이미 완료됨)
```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 3. 기존 코드 마이그레이션

### 서비스 파일 교체 스크립트
```bash
# utils 폴더에서 Firebase 서비스를 Supabase로 교체
cd src/utils

# 백업 생성
cp postService.ts postService.firebase.backup.ts
cp fileUploadService.ts fileUploadService.firebase.backup.ts
cp newFamilyService.ts newFamilyService.firebase.backup.ts

# Supabase 버전으로 교체
cp postServiceSupabase.ts postService.ts
cp fileUploadServiceSupabase.ts fileUploadService.ts
cp newFamilyServiceSupabase.ts newFamilyService.ts
```

### 컴포넌트 교체
```bash
cd ../../components

# 백업 생성
cp AdminLoginForm.tsx AdminLoginForm.firebase.backup.tsx

# Supabase 버전으로 교체
cp AdminLoginFormSupabase.tsx AdminLoginForm.tsx
```

## 4. Import 경로 변경

### 자동 변경 스크립트 (Mac/Linux)
```bash
# Firebase 임포트를 Supabase로 변경
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  -e "s|from '../../lib/firebase'|from '../../lib/supabase'|g" \
  -e "s|from '@/lib/firebase'|from '@/lib/supabase'|g" \
  -e "s|from './firebase'|from './supabase'|g"
```

## 5. 테스트 명령어

### 로컬 테스트
```bash
# 개발 서버 시작
npm run dev

# 빌드 테스트
npm run build

# 린트 검사
npm run lint
```

### 인증 테스트
```bash
# 브라우저에서 테스트
open http://localhost:3001/admin/login
```

## 6. Vercel 배포

### Vercel CLI를 통한 환경 변수 설정
```bash
# Vercel CLI 설치 (필요시)
npm i -g vercel

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 배포
vercel --prod
```

## 7. 데이터 마이그레이션 (옵션)

### Firebase 데이터 내보내기
```javascript
// scripts/export-firebase-data.js
const admin = require('firebase-admin');
const fs = require('fs');

// Firebase Admin 초기화
admin.initializeApp({
  // Firebase 설정
});

const db = admin.firestore();

async function exportData() {
  // Posts 내보내기
  const posts = await db.collection('posts').get();
  const postsData = posts.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  fs.writeFileSync('firebase-posts.json', JSON.stringify(postsData, null, 2));

  console.log('Data exported successfully');
}

exportData();
```

### Supabase로 데이터 가져오기
```javascript
// scripts/import-to-supabase.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://wnsqpxhvscpjrzpfcqdf.supabase.co',
  'your-anon-key'
);

async function importData() {
  const postsData = JSON.parse(fs.readFileSync('firebase-posts.json', 'utf8'));

  for (const post of postsData) {
    const { error } = await supabase
      .from('posts')
      .insert({
        title: post.title,
        content: post.content,
        type: post.type,
        category: post.category,
        status: post.status,
        // ... 기타 필드 매핑
      });

    if (error) {
      console.error('Error importing post:', error);
    }
  }

  console.log('Data imported successfully');
}

importData();
```

## 8. 모니터링 및 디버깅

### Supabase 로그 확인
```bash
# Supabase Dashboard에서:
# 1. Logs 섹션 이동
# 2. API logs, Auth logs, Database logs 확인
```

### 브라우저 콘솔에서 테스트
```javascript
// Supabase 클라이언트 테스트
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://wnsqpxhvscpjrzpfcqdf.supabase.co',
  'your-anon-key'
);

// 인증 테스트
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});

// 데이터 조회 테스트
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .limit(10);
console.log(posts);
```

## 9. 롤백 명령어 (필요시)

### Firebase로 롤백
```bash
# 환경 변수 복원
cp .env.local.firebase-backup .env.local

# 서비스 파일 복원
cd src/utils
cp postService.firebase.backup.ts postService.ts
cp fileUploadService.firebase.backup.ts fileUploadService.ts
cp newFamilyService.firebase.backup.ts newFamilyService.ts

# 컴포넌트 복원
cd ../../components
cp AdminLoginForm.firebase.backup.tsx AdminLoginForm.tsx

# 재배포
npm run build
vercel --prod
```

## 10. 유용한 Supabase CLI 명령어

```bash
# Supabase CLI 설치
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref wnsqpxhvscpjrzpfcqdf

# 데이터베이스 마이그레이션 생성
supabase migration new create_tables

# 타입 생성
supabase gen types typescript --project-id wnsqpxhvscpjrzpfcqdf > types/supabase.ts

# 로컬 개발 서버 시작
supabase start

# 로컬 개발 서버 중지
supabase stop
```

## 🎯 Quick Start (빠른 시작)

```bash
# 1. 환경 변수 설정
cp .env.local.supabase .env.local

# 2. 개발 서버 시작
npm run dev

# 3. 테스트
open http://localhost:3001

# 4. 배포
vercel --prod
```

---

모든 명령어는 프로젝트 루트 디렉토리에서 실행하세요.