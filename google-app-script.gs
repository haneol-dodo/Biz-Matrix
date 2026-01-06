/*
  BizMatrix Analytics Google App Script

  사용 방법:
  1. Google Sheets 열기
  2. 확장 프로그램 > Apps Script 클릭
  3. 이 코드를 Apps Script 편집기에 붙여넣기
  4. SUPABASE_URL과 SUPABASE_ANON_KEY를 설정
  5. =fetchBizMatrixAnalytics() 함수 호출
  6. 또는 메뉴: BizMatrix > 분석 데이터 불러오기

  CSV 템플릿 (Sheet 1에 직접 붙여넣기 가능):

  세션ID,액션타입,필드값,발생시간
  session_1735000000_abc123,page_visit,,2026-01-06 10:00:00
  session_1735000000_abc123,search_execution,1인창업가 카페운영 구독모델,2026-01-06 10:01:15
  session_1735000000_abc123,input_focus,,2026-01-06 10:01:05
  session_1735000000_abc123,result_view,1인창업가 카페운영 구독모델,2026-01-06 10:02:30
  session_1735000000_abc123,pdf_export,1인창업가 카페운영 구독모델,2026-01-06 10:03:45
  session_1735000001_def456,page_visit,,2026-01-06 10:10:00
  session_1735000001_def456,input_focus,,2026-01-06 10:10:30
  session_1735000001_def456,search_execution,프리랜서 디자이너 뉴스레터 유료회원,2026-01-06 10:11:00
  session_1735000001_def456,result_view,프리랜서 디자이너 뉴스레터 유료회원,2026-01-06 10:12:15
  session_1735000001_def456,txt_export,프리랜서 디자이너 뉴스레터 유료회원,2026-01-06 10:13:30
*/

// ===== 설정 =====
const SUPABASE_URL = "https://0ec90b57d6e95fcbda19832f.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw";

// ===== 메뉴 추가 =====
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('BizMatrix')
    .addItem('분석 데이터 불러오기', 'fetchBizMatrixAnalytics')
    .addItem('통계 요약 보기', 'showAnalyticsSummary')
    .addSeparator()
    .addItem('데이터 새로고침', 'refreshData')
    .addToUi();
}

// ===== 주요 함수: 분석 데이터 불러오기 =====
function fetchBizMatrixAnalytics() {
  try {
    const data = fetchActionLogs();
    if (!data || data.length === 0) {
      SpreadsheetApp.getUi().alert('데이터가 없습니다.');
      return;
    }

    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.clear();

    // 헤더 설정
    const headers = ['세션ID', '액션타입', '필드값', '발생시간'];
    sheet.appendRow(headers);

    // 데이터 입력
    const rows = data.map(log => [
      log.session_id,
      translateActionType(log.action_type),
      log.field_value || '',
      new Date(log.created_at).toLocaleString('ko-KR')
    ]);

    sheet.getRange(2, 1, rows.length, 4).setValues(rows);

    // 형식 설정
    formatAnalyticsSheet(sheet, headers.length, rows.length);

    SpreadsheetApp.getUi().alert(`${data.length}개의 액션 데이터를 불러왔습니다.`);
  } catch (error) {
    SpreadsheetApp.getUi().alert('오류: ' + error.message);
    Logger.log('Error:', error);
  }
}

// ===== 함수: Supabase에서 액션 로그 조회 =====
function fetchActionLogs() {
  const url = `${SUPABASE_URL}/rest/v1/action_logs?select=*&order=created_at.desc`;

  const options = {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (response.getResponseCode() !== 200) {
    throw new Error(`Supabase API 오류: ${response.getResponseCode()} - ${response.getContentText()}`);
  }

  return result;
}

// ===== 함수: 액션 타입 한글 변환 =====
function translateActionType(actionType) {
  const translations = {
    'page_visit': '페이지 방문',
    'search_execution': '검색 실행',
    'result_view': '결과 보기',
    'pdf_export': 'PDF 내보내기',
    'txt_export': 'TXT 내보내기',
    'input_focus': '입력 시작',
    'input_clear': '입력 클리어'
  };
  return translations[actionType] || actionType;
}

// ===== 함수: 시트 형식 설정 =====
function formatAnalyticsSheet(sheet, headerCount, dataCount) {
  const headerRange = sheet.getRange(1, 1, 1, headerCount);
  headerRange.setBackground('#1a365d');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');

  sheet.setColumnWidth(1, 180); // 세션ID
  sheet.setColumnWidth(2, 120); // 액션타입
  sheet.setColumnWidth(3, 250); // 필드값
  sheet.setColumnWidth(4, 180); // 발생시간

  // 데이터 행 배경색 (교대로)
  if (dataCount > 0) {
    for (let i = 2; i <= dataCount + 1; i++) {
      if ((i - 2) % 2 === 0) {
        sheet.getRange(i, 1, 1, headerCount).setBackground('#f7fafc');
      }
    }
  }
}

// ===== 함수: 통계 요약 =====
function showAnalyticsSummary() {
  try {
    const data = fetchActionLogs();
    if (!data || data.length === 0) {
      SpreadsheetApp.getUi().alert('데이터가 없습니다.');
      return;
    }

    // 액션 타입별 집계
    const summary = {};
    let uniqueSessions = new Set();

    data.forEach(log => {
      const type = log.action_type;
      summary[type] = (summary[type] || 0) + 1;
      uniqueSessions.add(log.session_id);
    });

    // 결과 표시
    let message = '📊 BizMatrix 분석 요약\n\n';
    message += `총 액션: ${data.length}개\n`;
    message += `고유 세션: ${uniqueSessions.size}개\n\n`;
    message += '액션 타입별:\n';

    Object.keys(summary).sort().forEach(type => {
      message += `  • ${translateActionType(type)}: ${summary[type]}개\n`;
    });

    // 가장 많이 검색된 분야 (상위 5개)
    const fieldSummary = {};
    data.forEach(log => {
      if (log.action_type === 'search_execution' && log.field_value) {
        fieldSummary[log.field_value] = (fieldSummary[log.field_value] || 0) + 1;
      }
    });

    const topFields = Object.entries(fieldSummary)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topFields.length > 0) {
      message += '\n🔝 인기 검색어 (상위 5개):\n';
      topFields.forEach(([field, count], index) => {
        message += `  ${index + 1}. ${field} (${count}회)\n`;
      });
    }

    SpreadsheetApp.getUi().alert(message);
  } catch (error) {
    SpreadsheetApp.getUi().alert('오류: ' + error.message);
    Logger.log('Error:', error);
  }
}

// ===== 함수: 데이터 새로고침 =====
function refreshData() {
  fetchBizMatrixAnalytics();
}

// ===== 커스텀 함수: 시트 내에서 직접 호출 =====
function getBizMatrixActionCount() {
  try {
    const data = fetchActionLogs();
    return data ? data.length : 0;
  } catch (error) {
    return `오류: ${error.message}`;
  }
}

function getBizMatrixSessionCount() {
  try {
    const data = fetchActionLogs();
    if (!data) return 0;
    const sessions = new Set(data.map(log => log.session_id));
    return sessions.size;
  } catch (error) {
    return `오류: ${error.message}`;
  }
}

function getBizMatrixActionsByType(actionType) {
  try {
    const data = fetchActionLogs();
    if (!data) return 0;
    return data.filter(log => log.action_type === actionType).length;
  } catch (error) {
    return `오류: ${error.message}`;
  }
}

// 사용 예:
// =getBizMatrixActionCount()
// =getBizMatrixSessionCount()
// =getBizMatrixActionsByType("search_execution")
