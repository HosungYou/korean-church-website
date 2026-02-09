# CSV Import Guide for Church Members

## Overview

The CSV Import feature allows administrators to bulk upload church member data from a CSV file. This feature includes duplicate detection, validation, and detailed error reporting.

## Feature Location

**Path**: `/admin/members` → Click "CSV 가져오기" button

## CSV Format

### Required Headers (Korean)

The CSV file must include the following headers in Korean:

```
이름(한글),이름(영문),이메일,전화,주소,생년월일,성별,직분,부서,세례여부,상태
```

### Field Mappings

| Korean Header | English Field | Type | Required | Valid Values |
|---------------|---------------|------|----------|--------------|
| 이름(한글) | korean_name | string | ✅ Yes | Any Korean name |
| 이름(영문) | english_name | string | No | Any English name |
| 이메일 | email | string | No | Valid email format |
| 전화 | phone | string | No | Phone number (e.g., 010-1234-5678) |
| 주소 | address | string | No | Any address |
| 생년월일 | birth_date | string | No | YYYY-MM-DD format |
| 성별 | gender | string | No | 남 (male), 여 (female) |
| 직분 | member_type | string | No | 성도, 집사, 장로, 목사, 교역자 |
| 부서 | department | string | No | Any department name |
| 세례여부 | baptized | boolean | No | 예 (yes), 아니오 (no) |
| 상태 | status | string | No | 활동, 비활동, 이적, 사망 |

## Example CSV

See `docs/examples/members_import_template.csv` for a sample file:

```csv
이름(한글),이름(영문),이메일,전화,주소,생년월일,성별,직분,부서,세례여부,상태
김철수,Kim Chulsoo,chulsoo@example.com,010-1234-5678,서울시 강남구,1980-05-15,남,집사,청년부,예,활동
이영희,Lee Younghee,younghee@example.com,010-2345-6789,서울시 서초구,1985-03-20,여,성도,여선교회,예,활동
박민수,Park Minsu,minsu@example.com,010-3456-7890,서울시 송파구,1990-08-10,남,성도,청년부,아니오,활동
```

## Import Process

### 1. File Upload
- Click "CSV 가져오기" button
- Select a CSV file (UTF-8 encoded)
- File is automatically parsed

### 2. Preview
- System shows preview of first 10 rows
- Displays: Name, Phone, Email, Member Type
- Shows total count of members to import

### 3. Duplicate Detection
- Checks for duplicates using: Korean Name + Phone Number
- If duplicate found: Skipped with warning message
- Allows import of non-duplicate records

### 4. Import Execution
- Click "가져오기" button to start import
- Progress indicator shown during import
- Each row validated before insertion

### 5. Results Summary
- **성공 (Success)**: Number of successfully imported members
- **중복 (Duplicates)**: Number of skipped duplicates
- **실패 (Failed)**: Number of failed imports
- **Error Details**: Specific error messages for each failed row

## Validation Rules

### Automatic Defaults
- If `member_type` not specified → defaults to "성도" (member)
- If `status` not specified → defaults to "활동" (active)
- If `baptized` not specified → defaults to false

### Data Transformation
- BOM (Byte Order Mark) automatically removed
- Empty fields converted to `null`
- Korean values mapped to English database fields:
  - 성별: 남→male, 여→female
  - 직분: 성도→member, 집사→deacon, 장로→elder, 목사→pastor, 교역자→staff
  - 상태: 활동→active, 비활동→inactive, 이적→transferred, 사망→deceased

## Error Handling

### Common Errors

1. **Duplicate Member**
   - Message: `행 X: "김철수" 중복 (이름+전화번호)`
   - Resolution: Check if member already exists, update phone number if different

2. **Invalid Data Format**
   - Message: `행 X: "이영희" 오류 - [specific error]`
   - Resolution: Check field format matches expected type

3. **Missing Required Field**
   - Message: `행 X: "박민수" 오류 - korean_name is required`
   - Resolution: Ensure Korean name is provided

## Technical Implementation

### Backend Functions

**File**: `src/utils/memberService.ts`

- `parseCSV(csvText: string): ParsedMemberRow[]`
  - Parses CSV text into structured objects
  - Handles BOM removal and line splitting
  - Maps Korean headers to English fields

- `importMembersFromCSV(rows: ParsedMemberRow[]): Promise<CSVImportResult>`
  - Validates and imports member records
  - Performs duplicate checking
  - Returns detailed import results

### Frontend Components

**File**: `src/pages/admin/members/index.tsx`

- Modal dialog with file input
- Preview table showing parsed data
- Import button with loading state
- Results display with success/error breakdown

## Best Practices

1. **Prepare CSV File**
   - Use UTF-8 encoding (with BOM for Excel compatibility)
   - Ensure headers match exactly (case-sensitive)
   - Validate data before import

2. **Test with Small Batch**
   - Import 2-3 test records first
   - Verify data appears correctly
   - Then proceed with full import

3. **Export Before Import**
   - Use "CSV 내보내기" to get current format
   - Use exported file as template
   - Ensures format consistency

4. **Review Results**
   - Check success count matches expected
   - Review error messages for failed imports
   - Fix issues and re-import failed records

## Troubleshooting

### File Not Parsing
- **Issue**: No preview shown after file upload
- **Solution**: Check file encoding is UTF-8, verify headers are correct

### All Records Showing as Duplicates
- **Issue**: Existing members with same name+phone
- **Solution**: Either update phone numbers or manually add with different info

### Import Hangs
- **Issue**: Large file causing timeout
- **Solution**: Split into smaller batches (50-100 records per file)

## Security Considerations

- Only administrators can access import feature
- Duplicate detection prevents accidental overwrites
- All imports logged in browser console
- No sensitive data exposed in error messages
- Database constraints prevent invalid data insertion

## Future Enhancements

Potential improvements for future versions:

- [ ] Support for Excel (.xlsx) files
- [ ] Async import for large files (>500 records)
- [ ] Email notification when import completes
- [ ] Import history/audit log
- [ ] Preview with inline validation errors
- [ ] Support for updating existing records (merge mode)
