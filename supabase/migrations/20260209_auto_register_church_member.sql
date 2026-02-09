-- ============================================================
-- Migration: Auto-register church member on new family registration
-- Date: 2026-02-09
-- Description: 새가족 등록 시 자동으로 교인(church_members)에 등록
-- ============================================================

-- 1. Trigger Function: new_family_registrations INSERT → church_members INSERT
CREATE OR REPLACE FUNCTION auto_register_church_member()
RETURNS TRIGGER AS $$
BEGIN
  -- 중복 체크: 같은 이름+전화번호가 이미 있으면 건너뜀
  IF EXISTS (
    SELECT 1 FROM church_members
    WHERE korean_name = NEW.korean_name
    AND phone = NEW.phone
  ) THEN
    RAISE NOTICE 'church_members에 이미 존재: % (%)', NEW.korean_name, NEW.phone;
    RETURN NEW;
  END IF;

  INSERT INTO church_members (
    korean_name,
    english_name,
    email,
    phone,
    address,
    birth_date,
    gender,
    member_type,
    baptized,
    baptism_date,
    status
  ) VALUES (
    NEW.korean_name,
    NEW.english_name,
    NEW.email,
    NEW.phone,
    CONCAT_WS(', ',
      NULLIF(TRIM(NEW.address1), ''),
      NULLIF(TRIM(NEW.address2), ''),
      NEW.city,
      NEW.state,
      NEW.zip_code
    ),
    NEW.birth_date,
    CASE WHEN NEW.gender IN ('male', 'female') THEN NEW.gender ELSE NULL END,
    'member',
    COALESCE(NEW.baptism_date IS NOT NULL, false),
    NEW.baptism_date,
    'active'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger: AFTER INSERT on new_family_registrations
DROP TRIGGER IF EXISTS trigger_auto_register_member ON new_family_registrations;

CREATE TRIGGER trigger_auto_register_member
  AFTER INSERT ON new_family_registrations
  FOR EACH ROW
  EXECUTE FUNCTION auto_register_church_member();

-- 3. Backfill: 기존 new_family_registrations 중 church_members에 없는 데이터 일괄 등록
INSERT INTO church_members (
  korean_name,
  english_name,
  email,
  phone,
  address,
  birth_date,
  gender,
  member_type,
  baptized,
  baptism_date,
  status
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

-- 4. 기존 new_family_registrations 중 backfill된 항목의 상태를 'registered'로 업데이트
UPDATE new_family_registrations nfr
SET status = 'registered'
WHERE status != 'registered'
AND EXISTS (
  SELECT 1 FROM church_members cm
  WHERE cm.korean_name = nfr.korean_name
  AND cm.phone = nfr.phone
);

COMMENT ON FUNCTION auto_register_church_member() IS '새가족 등록 시 자동으로 교인 테이블에 등록하는 트리거 함수';
