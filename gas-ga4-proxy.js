/**
 * Google Apps Script — GA4 Data API 프록시
 *
 * [설정 방법]
 * 1. https://script.google.com 에서 새 프로젝트 생성
 * 2. 이 코드를 붙여넣기
 * 3. 좌측 "서비스" → "Google Analytics Data API" 추가
 * 4. GA4_PROPERTY_ID 를 본인 GA4 속성 ID로 변경
 *    (GA4 → 관리 → 속성 설정 → 속성 ID)
 * 5. 배포 → 새 배포 → 웹 앱
 *    - 실행 계정: 본인
 *    - 액세스: 모든 사용자
 * 6. 배포 URL을 Dashboard 컴포넌트의 GAS_URL에 입력
 */

const GA4_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"; // 예: "123456789"

function doGet(e) {
  const type = (e && e.parameter && e.parameter.type) || "overview";

  try {
    let result;
    switch (type) {
      case "overview":
        result = getOverview();
        break;
      case "daily":
        result = getDaily(e.parameter.days || "7");
        break;
      case "sources":
        result = getSources();
        break;
      case "conversions":
        result = getConversions(e.parameter.days || "28");
        break;
      case "devices":
        result = getDevices();
        break;
      case "all":
        result = {
          overview: getOverview(),
          daily: getDaily(e.parameter.days || "7"),
          sources: getSources(),
          conversions: getConversions(e.parameter.days || "28"),
          devices: getDevices(),
        };
        break;
      default:
        result = { error: "Unknown type" };
    }

    return jsonpResponse(e, result);
  } catch (err) {
    return jsonpResponse(e, { error: err.message });
  }
}

/** 오늘 & 어제 개요 지표 */
function getOverview() {
  const today = runReport(
    [
      { name: "totalUsers" },
      { name: "screenPageViews" },
      { name: "sessions" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
    [],
    [{ startDate: "today", endDate: "today" }]
  );

  const yesterday = runReport(
    [
      { name: "totalUsers" },
      { name: "screenPageViews" },
      { name: "sessions" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
    [],
    [{ startDate: "yesterday", endDate: "yesterday" }]
  );

  const parse = (rows) => {
    if (!rows || rows.length === 0)
      return {
        users: 0,
        pageViews: 0,
        sessions: 0,
        bounceRate: 0,
        avgDuration: 0,
      };
    const v = rows[0].metricValues;
    return {
      users: Number(v[0].value),
      pageViews: Number(v[1].value),
      sessions: Number(v[2].value),
      bounceRate: Number(Number(v[3].value).toFixed(2)),
      avgDuration: Number(Number(v[4].value).toFixed(0)),
    };
  };

  return { today: parse(today), yesterday: parse(yesterday) };
}

/** 일별 방문자 추이 */
function getDaily(days) {
  const rows = runReport(
    [{ name: "totalUsers" }, { name: "screenPageViews" }, { name: "sessions" }],
    [{ name: "date" }],
    [{ startDate: days + "daysAgo", endDate: "today" }]
  );

  return (rows || [])
    .map((r) => ({
      date: r.dimensionValues[0].value,
      users: Number(r.metricValues[0].value),
      pageViews: Number(r.metricValues[1].value),
      sessions: Number(r.metricValues[2].value),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** 트래픽 소스 */
function getSources() {
  const rows = runReport(
    [{ name: "sessions" }],
    [{ name: "sessionDefaultChannelGroup" }],
    [{ startDate: "28daysAgo", endDate: "today" }]
  );

  return (rows || [])
    .map((r) => ({
      source: r.dimensionValues[0].value,
      sessions: Number(r.metricValues[0].value),
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 8);
}

/** 전환(상담 신청) 데이터 — generate_lead 이벤트 기반 */
function getConversions(days) {
  // generate_lead 이벤트 수 (일별)
  const rows = runReport(
    [{ name: "eventCount" }, { name: "totalUsers" }, { name: "sessions" }],
    [{ name: "date" }],
    [{ startDate: days + "daysAgo", endDate: "today" }],
    { name: "eventName", matchType: "EXACT", value: "generate_lead" }
  );

  // 같은 기간 전체 세션 수
  const sessionRows = runReport(
    [{ name: "sessions" }, { name: "totalUsers" }],
    [],
    [{ startDate: days + "daysAgo", endDate: "today" }]
  );

  const totalSessions =
    sessionRows && sessionRows.length > 0
      ? Number(sessionRows[0].metricValues[0].value)
      : 0;
  const totalUsers =
    sessionRows && sessionRows.length > 0
      ? Number(sessionRows[0].metricValues[1].value)
      : 0;

  const daily = (rows || [])
    .map((r) => ({
      date: r.dimensionValues[0].value,
      leads: Number(r.metricValues[0].value),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalLeads = daily.reduce((s, r) => s + r.leads, 0);
  const conversionRate =
    totalSessions > 0
      ? Number(((totalLeads / totalSessions) * 100).toFixed(2))
      : 0;

  return { totalLeads, totalSessions, totalUsers, conversionRate, daily };
}

/** 디바이스 분류 */
function getDevices() {
  const rows = runReport(
    [{ name: "sessions" }],
    [{ name: "deviceCategory" }],
    [{ startDate: "28daysAgo", endDate: "today" }]
  );

  return (rows || [])
    .map((r) => ({
      device: r.dimensionValues[0].value,
      sessions: Number(r.metricValues[0].value),
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

/** JSONP 응답 헬퍼 — CORS 우회 */
function jsonpResponse(e, data) {
  var callback = e && e.parameter && e.parameter.callback;
  var json = JSON.stringify(data);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/** GA4 Data API 호출 헬퍼 */
function runReport(metrics, dimensions, dateRanges, dimensionFilter) {
  const body = { metrics, dimensions, dateRanges };
  if (dimensionFilter) {
    body.dimensionFilter = {
      filter: {
        fieldName: dimensionFilter.name,
        stringFilter: {
          matchType: dimensionFilter.matchType || "EXACT",
          value: dimensionFilter.value,
        },
      },
    };
  }
  const req = AnalyticsData.Properties.runReport(
    body,
    "properties/" + GA4_PROPERTY_ID
  );
  return req.rows || [];
}
