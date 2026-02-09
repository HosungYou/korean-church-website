# Test Design Document: 새가족 자동 교인 등록

**Feature**: Auto Church Member Registration
**Version**: 2.9.0
**Date**: 2026-02-09
**Test Owner**: System
**Test Status**: 📋 Planned

---

## 1. 테스트 개요 (Test Overview)

### 1.1 테스트 목적

새가족 등록 시 자동으로 교인 명부(`church_members`)에 등록되는 트리거 함수(`auto_register_church_member()`)의 정확성과 안정성을 검증합니다.

### 1.2 테스트 범위

- ✅ 신규 등록 시 자동 INSERT
- ✅ 중복 방지 (이름 + 전화번호)
- ✅ 필드 매핑 정확성 (주소 합치기, gender 변환 등)
- ✅ 기존 데이터 Backfill
- ✅ RLS(Row Level Security) 정책
- ✅ 관리자 수동 전환 시 중복 방지

### 1.3 테스트 환경

- **Database**: Supabase PostgreSQL
- **Test Data**: 아래 테스트 케이스별 샘플 데이터
- **Tools**: Supabase SQL Editor, psql CLI

---

## 2. 테스트 케이스 (Test Cases)

### TC-001: 신규 새가족 등록 → 자동 교인 등록

**목적**: 새가족 폼 제출 시 `church_members`에 자동 등록되는지 확인

**사전 조건**:
- 트리거 함수가 정상 설치됨
- 테스트 데이터가 `church_members`에 없음

**테스트 단계**:

```sql
-- 1. 새가족 등록 (INSERT)
INSERT INTO new_family_registrations (
  korean_name, english_name, email, phone,
  address1, address2, city, state, zip_code,
  birth_date, gender, baptism_date
) VALUES (
  '김철수',
  'Chulsoo Kim',
  'chulsoo@example.com',
  '010-1234-5678',
  '123 Main St',
  'Apt 101',
  'Los Angeles',
  'CA',
  '90001',
  '1990-05-15',
  'male',
  '2020-12-25'
);

-- 2. church_members에 자동 등록되었는지 확인
SELECT
  korean_name,
  english_name,
  email,
  phone,
  address,
  gender,
  member_type,
  baptized,
  baptism_date,
  status
FROM church_members
WHERE korean_name = '김철수' AND phone = '010-1234-5678';
```

**예상 결과**:

| 필드 | 예상 값 |
|------|---------|
| `korean_name` | '김철수' |
| `english_name` | 'Chulsoo Kim' |
| `email` | 'chulsoo@example.com' |
| `phone` | '010-1234-5678' |
| `address` | '123 Main St, Apt 101, Los Angeles, CA, 90001' |
| `gender` | 'male' |
| `member_type` | 'member' |
| `baptized` | `true` |
| `baptism_date` | '2020-12-25' |
| `status` | 'active' |

**검증 SQL**:

```sql
-- 결과가 1행이어야 함
SELECT COUNT(*) AS count
FROM church_members
WHERE korean_name = '김철수' AND phone = '010-1234-5678';
-- Expected: count = 1

-- 필드 값 검증
SELECT
  CASE WHEN address = '123 Main St, Apt 101, Los Angeles, CA, 90001' THEN 'PASS' ELSE 'FAIL' END AS address_check,
  CASE WHEN member_type = 'member' THEN 'PASS' ELSE 'FAIL' END AS member_type_check,
  CASE WHEN baptized = true THEN 'PASS' ELSE 'FAIL' END AS baptized_check,
  CASE WHEN status = 'active' THEN 'PASS' ELSE 'FAIL' END AS status_check
FROM church_members
WHERE korean_name = '김철수' AND phone = '010-1234-5678';
-- Expected: 모든 컬럼이 'PASS'
```

**정리 (Cleanup)**:

```sql
DELETE FROM church_members WHERE korean_name = '김철수' AND phone = '010-1234-5678';
DELETE FROM new_family_registrations WHERE korean_name = '김철수' AND phone = '010-1234-5678';
```

---

### TC-002: 중복 등록 방지

**목적**: 같은 이름 + 전화번호로 재등록 시 `church_members`에 중복 INSERT되지 않는지 확인

**사전 조건**:
- 테스트 데이터가 이미 `church_members`에 존재함

**테스트 단계**:

```sql
-- 1. 먼저 교인으로 등록 (수동 INSERT)
INSERT INTO church_members (korean_name, phone, member_type, status)
VALUES ('박영희', '010-9876-5432', 'member', 'active');

-- 2. 같은 사람을 새가족으로 재등록 시도
INSERT INTO new_family_registrations (
  korean_name, english_name, email, phone
) VALUES (
  '박영희',
  'Younghee Park',
  'younghee@example.com',
  '010-9876-5432'
);

-- 3. church_members에 중복 등록되지 않았는지 확인
SELECT COUNT(*) AS count
FROM church_members
WHERE korean_name = '박영희' AND phone = '010-9876-5432';
-- Expected: count = 1 (여전히 1개만 존재)
```

**예상 결과**:
- `church_members`에 여전히 1개 레코드만 존재
- Postgres 로그에 `NOTICE: church_members에 이미 존재: 박영희 (010-9876-5432)` 출력

**검증 SQL**:

```sql
-- 중복 체크: COUNT가 1이어야 함
SELECT
  CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END AS duplicate_check
FROM church_members
WHERE korean_name = '박영희' AND phone = '010-9876-5432';
-- Expected: duplicate_check = 'PASS'
```

**정리 (Cleanup)**:

```sql
DELETE FROM church_members WHERE korean_name = '박영희' AND phone = '010-9876-5432';
DELETE FROM new_family_registrations WHERE korean_name = '박영희' AND phone = '010-9876-5432';
```

---

### TC-003: 필드 매핑 정확성

**목적**: 새가족 필드가 교인 필드로 정확하게 변환되는지 확인

#### TC-003-1: 주소 합치기 (Address Concatenation)

```sql
-- 1. 주소 필드가 모두 채워진 경우
INSERT INTO new_family_registrations (
  korean_name, phone, address1, address2, city, state, zip_code
) VALUES (
  '테스트1', '010-0001-0001',
  '456 Oak Ave', 'Unit 202', 'San Diego', 'CA', '92101'
);

-- 검증
SELECT address FROM church_members
WHERE korean_name = '테스트1' AND phone = '010-0001-0001';
-- Expected: '456 Oak Ave, Unit 202, San Diego, CA, 92101'

-- 2. address2가 비어있는 경우
INSERT INTO new_family_registrations (
  korean_name, phone, address1, address2, city, state, zip_code
) VALUES (
  '테스트2', '010-0002-0002',
  '789 Pine St', '', 'Irvine', 'CA', '92602'
);

-- 검증
SELECT address FROM church_members
WHERE korean_name = '테스트2' AND phone = '010-0002-0002';
-- Expected: '789 Pine St, Irvine, CA, 92602' (빈 address2 제외됨)

-- 정리
DELETE FROM church_members WHERE korean_name LIKE '테스트%';
DELETE FROM new_family_registrations WHERE korean_name LIKE '테스트%';
```

#### TC-003-2: 성별(Gender) 변환

```sql
-- 1. 유효한 gender ('male', 'female')
INSERT INTO new_family_registrations (korean_name, phone, gender)
VALUES ('테스트남', '010-0003-0003', 'male');

INSERT INTO new_family_registrations (korean_name, phone, gender)
VALUES ('테스트여', '010-0004-0004', 'female');

-- 검증
SELECT gender FROM church_members WHERE korean_name = '테스트남' AND phone = '010-0003-0003';
-- Expected: 'male'

SELECT gender FROM church_members WHERE korean_name = '테스트여' AND phone = '010-0004-0004';
-- Expected: 'female'

-- 2. 유효하지 않은 gender ('other', 빈 값 등)
INSERT INTO new_family_registrations (korean_name, phone, gender)
VALUES ('테스트기타', '010-0005-0005', 'other');

-- 검증
SELECT gender FROM church_members WHERE korean_name = '테스트기타' AND phone = '010-0005-0005';
-- Expected: NULL

-- 정리
DELETE FROM church_members WHERE korean_name LIKE '테스트%';
DELETE FROM new_family_registrations WHERE korean_name LIKE '테스트%';
```

#### TC-003-3: 세례 여부(Baptized) 계산

```sql
-- 1. baptism_date가 있는 경우
INSERT INTO new_family_registrations (korean_name, phone, baptism_date)
VALUES ('세례있음', '010-0006-0006', '2015-08-15');

-- 검증
SELECT baptized, baptism_date FROM church_members
WHERE korean_name = '세례있음' AND phone = '010-0006-0006';
-- Expected: baptized = true, baptism_date = '2015-08-15'

-- 2. baptism_date가 NULL인 경우
INSERT INTO new_family_registrations (korean_name, phone, baptism_date)
VALUES ('세례없음', '010-0007-0007', NULL);

-- 검증
SELECT baptized, baptism_date FROM church_members
WHERE korean_name = '세례없음' AND phone = '010-0007-0007';
-- Expected: baptized = false, baptism_date = NULL

-- 정리
DELETE FROM church_members WHERE korean_name IN ('세례있음', '세례없음');
DELETE FROM new_family_registrations WHERE korean_name IN ('세례있음', '세례없음');
```

---

### TC-004: 기존 데이터 Backfill

**목적**: 마이그레이션 시 기존 `new_family_registrations` 데이터가 `church_members`에 일괄 등록되는지 확인

**사전 조건**:
- 트리거 설치 전에 `new_family_registrations`에 데이터가 있음
- 해당 데이터가 `church_members`에는 없음

**테스트 단계**:

```sql
-- 1. 트리거 설치 전 상황 시뮬레이션 (트리거 임시 비활성화)
ALTER TABLE new_family_registrations DISABLE TRIGGER trigger_auto_register_member;

-- 2. 기존 데이터 INSERT
INSERT INTO new_family_registrations (korean_name, phone, email)
VALUES
  ('기존1', '010-1000-0001', 'existing1@example.com'),
  ('기존2', '010-1000-0002', 'existing2@example.com'),
  ('기존3', '010-1000-0003', 'existing3@example.com');

-- 3. church_members에 없는지 확인
SELECT COUNT(*) FROM church_members WHERE korean_name LIKE '기존%';
-- Expected: 0

-- 4. Backfill 쿼리 실행 (마이그레이션 파일 내용)
INSERT INTO church_members (
  korean_name, english_name, email, phone, address,
  birth_date, gender, member_type, baptized, baptism_date, status
)
SELECT
  nfr.korean_name,
  nfr.english_name,
  nfr.email,
  nfr.phone,
  CONCAT_WS(', ',
    NULLIF(TRIM(nfr.address1), ''),
    NULLIF(TRIM(nfr.address2), ''),
    nfr.city,
    nfr.state,
    nfr.zip_code
  ),
  nfr.birth_date,
  CASE WHEN nfr.gender IN ('male', 'female') THEN nfr.gender ELSE NULL END,
  'member',
  COALESCE(nfr.baptism_date IS NOT NULL, false),
  nfr.baptism_date,
  'active'
FROM new_family_registrations nfr
WHERE NOT EXISTS (
  SELECT 1 FROM church_members cm
  WHERE cm.korean_name = nfr.korean_name
  AND cm.phone = nfr.phone
);

-- 5. Backfill 결과 확인
SELECT COUNT(*) FROM church_members WHERE korean_name LIKE '기존%';
-- Expected: 3

-- 6. 트리거 재활성화
ALTER TABLE new_family_registrations ENABLE TRIGGER trigger_auto_register_member;

-- 정리
DELETE FROM church_members WHERE korean_name LIKE '기존%';
DELETE FROM new_family_registrations WHERE korean_name LIKE '기존%';
```

**예상 결과**:
- Backfill 후 `church_members`에 3개 레코드 생성
- 모든 레코드가 `status = 'active'`, `member_type = 'member'`

---

### TC-005: 관리자 수동 전환 시 중복 방지

**목적**: 관리자가 "교인으로 전환" 버튼을 눌렀을 때 이미 자동 등록된 사람은 중복 등록되지 않는지 확인

**사전 조건**:
- 이미 트리거로 자동 등록된 사람이 있음
- 관리자가 수동 전환 버튼을 누름

**테스트 단계**:

```sql
-- 1. 새가족 등록 (자동으로 church_members에 등록됨)
INSERT INTO new_family_registrations (korean_name, phone, email)
VALUES ('이자동', '010-2000-0001', 'auto@example.com');

-- 2. 자동 등록 확인
SELECT COUNT(*) FROM church_members WHERE korean_name = '이자동' AND phone = '010-2000-0001';
-- Expected: 1

-- 3. 관리자가 수동 전환 시도 (애플리케이션 레벨 체크 시뮬레이션)
DO $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- 중복 체크
  SELECT EXISTS (
    SELECT 1 FROM church_members
    WHERE korean_name = '이자동' AND phone = '010-2000-0001'
  ) INTO v_exists;

  IF v_exists THEN
    RAISE NOTICE '이미 교인 명부에 등록된 분입니다.';
  ELSE
    -- INSERT 로직 (실행되지 않아야 함)
    INSERT INTO church_members (korean_name, phone, member_type, status)
    VALUES ('이자동', '010-2000-0001', 'member', 'active');
  END IF;
END $$;

-- 4. 중복 등록되지 않았는지 확인
SELECT COUNT(*) FROM church_members WHERE korean_name = '이자동' AND phone = '010-2000-0001';
-- Expected: 1 (여전히 1개만 존재)

-- 정리
DELETE FROM church_members WHERE korean_name = '이자동' AND phone = '010-2000-0001';
DELETE FROM new_family_registrations WHERE korean_name = '이자동' AND phone = '010-2000-0001';
```

**예상 결과**:
- `church_members`에 여전히 1개 레코드만 존재
- NOTICE: "이미 교인 명부에 등록된 분입니다." 출력

---

### TC-006: RLS 정책 - 비인증 사용자의 직접 접근 차단

**목적**: 비인증 사용자가 `church_members` 테이블에 직접 INSERT할 수 없는지 확인

**사전 조건**:
- RLS(Row Level Security)가 활성화되어 있음
- `church_members` 테이블에 관리자 전용 정책이 설정됨

**테스트 단계**:

```sql
-- 1. RLS 정책 확인
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'church_members';
-- Expected: 관리자 전용 정책이 존재

-- 2. 비인증 사용자로 INSERT 시도 (anon role)
SET ROLE anon;

INSERT INTO church_members (korean_name, phone, member_type, status)
VALUES ('해커', '010-9999-9999', 'member', 'active');
-- Expected: ERROR - new row violates row-level security policy

-- 3. 권한 복원
RESET ROLE;

-- 4. 트리거를 통한 INSERT는 성공하는지 확인
INSERT INTO new_family_registrations (korean_name, phone)
VALUES ('정상', '010-8888-8888');

SELECT COUNT(*) FROM church_members WHERE korean_name = '정상' AND phone = '010-8888-8888';
-- Expected: 1 (트리거는 SECURITY DEFINER로 RLS 우회)

-- 정리
DELETE FROM church_members WHERE korean_name IN ('해커', '정상');
DELETE FROM new_family_registrations WHERE korean_name = '정상';
```

**예상 결과**:
- 비인증 사용자의 직접 INSERT는 실패
- 트리거를 통한 INSERT는 성공 (SECURITY DEFINER)

---

## 3. 엣지 케이스 테스트 (Edge Cases)

### EC-001: 전화번호 형식 변형

```sql
-- 같은 전화번호를 다른 형식으로 입력 시 중복 감지 여부
INSERT INTO new_family_registrations (korean_name, phone)
VALUES ('형식1', '010-1234-5678');

INSERT INTO new_family_registrations (korean_name, phone)
VALUES ('형식2', '01012345678');  -- 하이픈 없음

-- 검증: 현재는 다른 번호로 취급됨 (정규화 필요)
SELECT COUNT(*) FROM church_members WHERE korean_name LIKE '형식%';
-- Expected: 2 (별도 레코드)
-- TODO: 전화번호 정규화 함수 추가 권장

-- 정리
DELETE FROM church_members WHERE korean_name LIKE '형식%';
DELETE FROM new_family_registrations WHERE korean_name LIKE '형식%';
```

### EC-002: NULL 필드 처리

```sql
-- 필수 필드만 채우고 나머지 NULL인 경우
INSERT INTO new_family_registrations (korean_name, phone)
VALUES ('최소정보', '010-0000-0001');

-- 검증: INSERT 성공, 나머지 필드는 NULL
SELECT korean_name, phone, email, address, baptized
FROM church_members
WHERE korean_name = '최소정보' AND phone = '010-0000-0001';
-- Expected: email=NULL, address=NULL, baptized=false

-- 정리
DELETE FROM church_members WHERE korean_name = '최소정보';
DELETE FROM new_family_registrations WHERE korean_name = '최소정보';
```

### EC-003: 특수문자 이름

```sql
-- 이름에 특수문자가 포함된 경우
INSERT INTO new_family_registrations (korean_name, phone)
VALUES ('김•철•수', '010-0000-0002');

-- 검증: 정상 등록됨
SELECT COUNT(*) FROM church_members WHERE korean_name = '김•철•수' AND phone = '010-0000-0002';
-- Expected: 1

-- 정리
DELETE FROM church_members WHERE korean_name = '김•철•수';
DELETE FROM new_family_registrations WHERE korean_name = '김•철•수';
```

---

## 4. 성능 테스트 (Performance Test)

### PT-001: 대량 INSERT 성능

**목적**: 100개의 새가족 등록을 한 번에 처리할 때 성능 측정

```sql
-- 1. 대량 데이터 생성
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO new_family_registrations (korean_name, phone, email)
    VALUES (
      '대량테스트' || i,
      '010-' || LPAD(i::text, 4, '0') || '-' || LPAD(i::text, 4, '0'),
      'bulk' || i || '@example.com'
    );
  END LOOP;
END $$;

-- 2. church_members에 모두 등록되었는지 확인
SELECT COUNT(*) FROM church_members WHERE korean_name LIKE '대량테스트%';
-- Expected: 100

-- 3. 실행 시간 측정 (EXPLAIN ANALYZE)
EXPLAIN ANALYZE
INSERT INTO new_family_registrations (korean_name, phone, email)
VALUES ('성능테스트', '010-9999-0001', 'perf@example.com');
-- Expected: < 100ms

-- 정리
DELETE FROM church_members WHERE korean_name LIKE '대량테스트%' OR korean_name = '성능테스트';
DELETE FROM new_family_registrations WHERE korean_name LIKE '대량테스트%' OR korean_name = '성능테스트';
```

**성능 기준**:
- 단일 INSERT: < 100ms
- 100건 일괄 INSERT: < 5초

---

## 5. 회귀 테스트 (Regression Test)

### RT-001: 기존 기능 영향 확인

**목적**: 트리거 추가 후 기존 기능이 정상 작동하는지 확인

```sql
-- 1. new_family_registrations에 데이터 저장됨 (기존 기능)
INSERT INTO new_family_registrations (korean_name, phone, email)
VALUES ('회귀테스트', '010-7777-0001', 'regression@example.com');

SELECT COUNT(*) FROM new_family_registrations WHERE korean_name = '회귀테스트';
-- Expected: 1

-- 2. 트리거가 정상 작동함 (새 기능)
SELECT COUNT(*) FROM church_members WHERE korean_name = '회귀테스트' AND phone = '010-7777-0001';
-- Expected: 1

-- 3. 기존 쿼리가 여전히 작동함
SELECT * FROM new_family_registrations WHERE status = 'pending';
-- Expected: 에러 없이 결과 반환

-- 정리
DELETE FROM church_members WHERE korean_name = '회귀테스트';
DELETE FROM new_family_registrations WHERE korean_name = '회귀테스트';
```

---

## 6. 롤백 테스트 (Rollback Test)

### RB-001: 트리거 제거 후 동작

**목적**: 트리거 제거 후 기존 기능이 정상 작동하는지 확인

```sql
-- 1. 트리거 제거
DROP TRIGGER IF EXISTS trigger_auto_register_member ON new_family_registrations;
DROP FUNCTION IF EXISTS auto_register_church_member();

-- 2. new_family_registrations에 INSERT
INSERT INTO new_family_registrations (korean_name, phone)
VALUES ('롤백테스트', '010-6666-0001');

-- 3. church_members에 자동 등록되지 않음 확인
SELECT COUNT(*) FROM church_members WHERE korean_name = '롤백테스트';
-- Expected: 0

-- 4. new_family_registrations에는 정상 저장됨 확인
SELECT COUNT(*) FROM new_family_registrations WHERE korean_name = '롤백테스트';
-- Expected: 1

-- 5. 트리거 재설치 (마이그레이션 파일 재실행)
-- (생략 - 실제로는 마이그레이션 파일 다시 실행)

-- 정리
DELETE FROM new_family_registrations WHERE korean_name = '롤백테스트';
```

---

## 7. 통합 테스트 시나리오 (Integration Test)

### IT-001: End-to-End 플로우

**시나리오**: 사용자가 웹 폼을 통해 새가족 등록 → 관리자가 교인 명부에서 확인

```sql
-- 1. 웹 폼 제출 시뮬레이션 (비인증 사용자)
SET ROLE anon;

INSERT INTO new_family_registrations (
  korean_name, english_name, email, phone,
  address1, city, state, zip_code,
  birth_date, gender, baptism_date
) VALUES (
  '통합테스트',
  'Integration Test',
  'integration@example.com',
  '010-5555-0001',
  '789 Test Blvd',
  'Fullerton',
  'CA',
  '92831',
  '1985-03-20',
  'female',
  '2018-05-10'
);

RESET ROLE;

-- 2. 관리자가 church_members에서 확인 (인증된 사용자)
-- (실제로는 Admin UI에서 확인)
SELECT
  korean_name,
  english_name,
  email,
  phone,
  address,
  member_type,
  status,
  baptized
FROM church_members
WHERE korean_name = '통합테스트' AND phone = '010-5555-0001';

-- Expected:
-- korean_name: '통합테스트'
-- english_name: 'Integration Test'
-- email: 'integration@example.com'
-- phone: '010-5555-0001'
-- address: '789 Test Blvd, Fullerton, CA, 92831'
-- member_type: 'member'
-- status: 'active'
-- baptized: true

-- 3. 관리자가 추가 정보 수정 (직분, 부서 등)
UPDATE church_members
SET
  position = '권사',
  department = '여전도회'
WHERE korean_name = '통합테스트' AND phone = '010-5555-0001';

-- 4. 수정된 정보 확인
SELECT position, department
FROM church_members
WHERE korean_name = '통합테스트' AND phone = '010-5555-0001';
-- Expected: position='권사', department='여전도회'

-- 정리
DELETE FROM church_members WHERE korean_name = '통합테스트';
DELETE FROM new_family_registrations WHERE korean_name = '통합테스트';
```

---

## 8. 테스트 실행 계획 (Test Execution Plan)

### 8.1 테스트 순서

1. **사전 검증**: 마이그레이션 파일이 정상 적용되었는지 확인
2. **기본 기능 테스트**: TC-001 ~ TC-006 순차 실행
3. **엣지 케이스 테스트**: EC-001 ~ EC-003 실행
4. **성능 테스트**: PT-001 실행 (성능 기준 충족 확인)
5. **회귀 테스트**: RT-001 실행 (기존 기능 영향 없음 확인)
6. **통합 테스트**: IT-001 실행 (End-to-End 플로우 검증)
7. **롤백 테스트**: RB-001 실행 (필요 시)

### 8.2 테스트 체크리스트

- [ ] TC-001: 신규 등록 → 자동 INSERT ✅
- [ ] TC-002: 중복 방지 ✅
- [ ] TC-003-1: 주소 합치기 ✅
- [ ] TC-003-2: 성별 변환 ✅
- [ ] TC-003-3: 세례 여부 계산 ✅
- [ ] TC-004: Backfill ✅
- [ ] TC-005: 관리자 수동 전환 중복 방지 ✅
- [ ] TC-006: RLS 정책 ✅
- [ ] EC-001: 전화번호 형식 변형 ⚠️ (정규화 필요)
- [ ] EC-002: NULL 필드 처리 ✅
- [ ] EC-003: 특수문자 이름 ✅
- [ ] PT-001: 대량 INSERT 성능 ✅
- [ ] RT-001: 기존 기능 영향 ✅
- [ ] IT-001: End-to-End 플로우 ✅

---

## 9. 버그 리포트 템플릿 (Bug Report Template)

테스트 중 버그 발견 시 아래 템플릿 사용:

```markdown
### Bug ID: BUG-YYYY-MM-DD-###

**Title**: [간단한 제목]

**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low

**Test Case**: TC-### / EC-### / PT-### / IT-###

**Description**:
[버그 설명]

**Steps to Reproduce**:
1. [단계 1]
2. [단계 2]
3. [단계 3]

**Expected Result**:
[예상 결과]

**Actual Result**:
[실제 결과]

**SQL Query**:
```sql
[재현 쿼리]
```

**Environment**:
- Database: Supabase PostgreSQL
- Migration Version: 20260209_auto_register_church_member.sql

**Proposed Fix**:
[수정 방안 제안]

**Action Items**:
- [ ] 버그 수정
- [ ] 테스트 재실행
- [ ] 문서 업데이트
```

---

## 10. 테스트 자동화 (Test Automation)

### 10.1 PostgreSQL Test Script

전체 테스트 케이스를 자동 실행하는 스크립트:

```sql
-- test_auto_registration.sql

-- 테스트 시작
DO $$
DECLARE
  v_test_count INTEGER := 0;
  v_pass_count INTEGER := 0;
  v_fail_count INTEGER := 0;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Auto Church Member Registration Tests';
  RAISE NOTICE '========================================';

  -- TC-001: 신규 등록
  BEGIN
    v_test_count := v_test_count + 1;

    INSERT INTO new_family_registrations (korean_name, phone)
    VALUES ('자동테스트1', '010-TEST-0001');

    IF EXISTS (SELECT 1 FROM church_members WHERE korean_name = '자동테스트1' AND phone = '010-TEST-0001') THEN
      v_pass_count := v_pass_count + 1;
      RAISE NOTICE '[PASS] TC-001: 신규 등록 → 자동 INSERT';
    ELSE
      v_fail_count := v_fail_count + 1;
      RAISE NOTICE '[FAIL] TC-001: 신규 등록 → 자동 INSERT';
    END IF;

    DELETE FROM church_members WHERE korean_name = '자동테스트1';
    DELETE FROM new_family_registrations WHERE korean_name = '자동테스트1';
  EXCEPTION WHEN OTHERS THEN
    v_fail_count := v_fail_count + 1;
    RAISE NOTICE '[FAIL] TC-001: 에러 발생 - %', SQLERRM;
  END;

  -- TC-002: 중복 방지
  BEGIN
    v_test_count := v_test_count + 1;

    INSERT INTO church_members (korean_name, phone, member_type, status)
    VALUES ('자동테스트2', '010-TEST-0002', 'member', 'active');

    INSERT INTO new_family_registrations (korean_name, phone)
    VALUES ('자동테스트2', '010-TEST-0002');

    IF (SELECT COUNT(*) FROM church_members WHERE korean_name = '자동테스트2' AND phone = '010-TEST-0002') = 1 THEN
      v_pass_count := v_pass_count + 1;
      RAISE NOTICE '[PASS] TC-002: 중복 방지';
    ELSE
      v_fail_count := v_fail_count + 1;
      RAISE NOTICE '[FAIL] TC-002: 중복 방지';
    END IF;

    DELETE FROM church_members WHERE korean_name = '자동테스트2';
    DELETE FROM new_family_registrations WHERE korean_name = '자동테스트2';
  EXCEPTION WHEN OTHERS THEN
    v_fail_count := v_fail_count + 1;
    RAISE NOTICE '[FAIL] TC-002: 에러 발생 - %', SQLERRM;
  END;

  -- 결과 요약
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Test Summary';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total: % | Pass: % | Fail: %', v_test_count, v_pass_count, v_fail_count;

  IF v_fail_count > 0 THEN
    RAISE NOTICE 'Status: FAIL ❌';
  ELSE
    RAISE NOTICE 'Status: PASS ✅';
  END IF;
END $$;
```

**실행 방법**:

```bash
# Supabase CLI 사용
supabase db test < test_auto_registration.sql

# 또는 psql 사용
psql -h db.xxx.supabase.co -U postgres -d postgres < test_auto_registration.sql
```

---

## 11. 참고 자료 (References)

- **SDD**: `DOCS/features/auto-member-registration-SDD.md`
- **Migration File**: `supabase/migrations/20260209_auto_register_church_member.sql`
- **Admin UI**: `src/pages/admin/new-families/index.tsx`

---

**문서 작성일**: 2026-02-09
**마지막 업데이트**: 2026-02-09
**테스트 상태**: 📋 Planned
