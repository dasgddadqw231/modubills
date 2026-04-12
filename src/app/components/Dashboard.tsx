import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import {
  Users,
  Eye,
  MousePointerClick,
  Timer,
  TrendingUp,
  TrendingDown,
  FileCheck2,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

// ── Google Apps Script 배포 URL (배포 후 여기에 입력) ──
const GAS_URL = "https://script.google.com/macros/s/AKfycby5OzDfFvTfX2rH7ikdw8MTm3pdtuh-Fn385cvtaQm7fTspuJjOhiBpxO3cgc4q0S2VkQ/exec";

// ── 타입 ──
interface Overview {
  users: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgDuration: number;
}
interface DailyRow {
  date: string;
  users: number;
  pageViews: number;
  sessions: number;
}
interface SourceRow {
  source: string;
  sessions: number;
}
interface ConversionData {
  totalLeads: number;
  totalSessions: number;
  totalUsers: number;
  conversionRate: number;
  daily: { date: string; leads: number }[];
}
interface DeviceRow {
  device: string;
  sessions: number;
}
interface DashboardData {
  overview: { today: Overview; yesterday: Overview };
  daily: DailyRow[];
  sources: SourceRow[];
  conversions: ConversionData;
  devices: DeviceRow[];
}

const COLORS = ["#18181b", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"];

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const DEVICE_LABELS: Record<string, string> = {
  desktop: "PC",
  mobile: "모바일",
  tablet: "태블릿",
};

// ── 데모 데이터 (GAS_URL 미설정 시) ──
function generateDemoData(days: number): DashboardData {
  const daily: DailyRow[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ymd = d.toISOString().slice(0, 10).replace(/-/g, "");
    const users = Math.floor(Math.random() * 40) + 10;
    daily.push({
      date: ymd,
      users,
      pageViews: users * (2 + Math.floor(Math.random() * 3)),
      sessions: users + Math.floor(Math.random() * 10),
    });
  }
  const todayRow = daily[daily.length - 1];
  const yesterdayRow = daily[daily.length - 2];
  return {
    overview: {
      today: {
        users: todayRow.users,
        pageViews: todayRow.pageViews,
        sessions: todayRow.sessions,
        bounceRate: 0.45 + Math.random() * 0.2,
        avgDuration: 60 + Math.floor(Math.random() * 120),
      },
      yesterday: {
        users: yesterdayRow.users,
        pageViews: yesterdayRow.pageViews,
        sessions: yesterdayRow.sessions,
        bounceRate: 0.45 + Math.random() * 0.2,
        avgDuration: 60 + Math.floor(Math.random() * 120),
      },
    },
    daily,
    sources: [
      { source: "Organic Search", sessions: 120 },
      { source: "Direct", sessions: 85 },
      { source: "Social", sessions: 45 },
      { source: "Referral", sessions: 30 },
      { source: "Paid Search", sessions: 15 },
    ],
    conversions: (() => {
      const convDaily = daily.map((r) => ({
        date: r.date,
        leads: Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0,
      }));
      const totalLeads = convDaily.reduce((s, r) => s + r.leads, 0);
      const totalSessions = daily.reduce((s, r) => s + r.sessions, 0);
      return {
        totalLeads,
        totalSessions,
        totalUsers: daily.reduce((s, r) => s + r.users, 0),
        conversionRate: totalSessions > 0 ? Number(((totalLeads / totalSessions) * 100).toFixed(2)) : 0,
        daily: convDaily,
      };
    })(),
    devices: [
      { device: "mobile", sessions: 180 },
      { device: "desktop", sessions: 95 },
      { device: "tablet", sessions: 20 },
    ],
  };
}

// ── JSONP fetch (GAS CORS 우회) ──
function fetchJsonp(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const cb = "_ga4_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    const script = document.createElement("script");

    const cleanup = () => {
      delete (window as any)[cb];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    (window as any)[cb] = (data: any) => {
      cleanup();
      resolve(data);
    };

    script.src = url + (url.includes("?") ? "&" : "?") + "callback=" + cb;
    script.onerror = () => {
      cleanup();
      reject(new Error("데이터를 불러올 수 없습니다"));
    };

    document.head.appendChild(script);
  });
}

// ── 유틸 ──
function formatDate(ymd: string) {
  const m = ymd.slice(4, 6);
  const d = ymd.slice(6, 8);
  return `${Number(m)}/${Number(d)}`;
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

function pctChange(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

// ── 컴포넌트 ──
export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(7);
  const [daysOpen, setDaysOpen] = useState(false);
  const isDemo = !GAS_URL;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!GAS_URL) {
      // 데모 모드
      await new Promise((r) => setTimeout(r, 600));
      setData(generateDemoData(days));
      setLoading(false);
      return;
    }

    try {
      const json = await fetchJsonp(`${GAS_URL}?type=all&days=${days}`);
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message || "데이터를 불러올 수 없습니다");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ov = data?.overview;
  const todayStats = ov?.today;
  const yesterdayStats = ov?.yesterday;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-100">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <a href="/" className="text-zinc-400 active:text-zinc-600">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-base font-bold text-zinc-900 leading-tight">
                모두빌스 대시보드
              </h1>
              <p className="text-[11px] text-zinc-400 leading-tight">
                G-MZZC4G4YQG
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-zinc-500 active:text-zinc-800 disabled:opacity-40"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="px-4 pt-4 pb-24 space-y-4 max-w-lg mx-auto">
        {/* 데모 배너 */}
        {isDemo && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
            데모 데이터입니다. <code className="bg-amber-100 px-1 rounded text-[11px]">gas-ga4-proxy.js</code>를
            Apps Script에 배포 후 <code className="bg-amber-100 px-1 rounded text-[11px]">GAS_URL</code>을 설정하세요.
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* 기간 선택 */}
        <div className="relative">
          <button
            onClick={() => setDaysOpen(!daysOpen)}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 active:bg-zinc-50"
          >
            최근 {days}일
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
          {daysOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {[7, 14, 28].map((d) => (
                <button
                  key={d}
                  onClick={() => { setDays(d); setDaysOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm active:bg-zinc-50 ${
                    d === days ? "font-bold text-zinc-900 bg-zinc-50" : "text-zinc-600"
                  }`}
                >
                  최근 {d}일
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 오늘(일일) 개요 카드 */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-500 mb-2">오늘의 실시간 지표 <span className="text-[11px] text-zinc-400 font-normal">(일일 데이터)</span></h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="방문자"
            value={todayStats?.users}
            prev={yesterdayStats?.users}
            icon={Users}
            loading={loading}
          />
          <StatCard
            label="페이지뷰"
            value={todayStats?.pageViews}
            prev={yesterdayStats?.pageViews}
            icon={Eye}
            loading={loading}
          />
          <StatCard
            label="세션"
            value={todayStats?.sessions}
            prev={yesterdayStats?.sessions}
            icon={MousePointerClick}
            loading={loading}
          />
          <StatCard
            label="평균 체류"
            value={todayStats?.avgDuration}
            prev={yesterdayStats?.avgDuration}
            icon={Timer}
            loading={loading}
            format={formatDuration}
          />
        </div>

        {/* 일별 추이 차트 */}
        <Card className="border-zinc-200/80 shadow-none">
          <CardHeader className="pb-0 pt-4 px-4 gap-0">
            <CardTitle className="text-sm font-semibold text-zinc-800">일별 방문자</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3 pt-2">
            {loading ? (
              <Skeleton className="h-[200px] w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data?.daily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#18181b" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 11, fill: "#a1a1aa" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#a1a1aa" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    labelFormatter={(v) => formatDate(String(v))}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e4e4e7",
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                    formatter={(value: number, name: string) => [
                      value,
                      name === "users" ? "방문자" : name === "pageViews" ? "페이지뷰" : "세션",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#18181b"
                    strokeWidth={2}
                    fill="url(#gradUsers)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#18181b" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* 디바이스 & 트래픽 소스 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 디바이스 */}
          <Card className="border-zinc-200/80 shadow-none">
            <CardHeader className="pb-0 pt-4 px-4 gap-0">
              <CardTitle className="text-sm font-semibold text-zinc-800">디바이스</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-3">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(data?.devices ?? []).map((d) => {
                    const total = (data?.devices ?? []).reduce((s, x) => s + x.sessions, 0);
                    const pct = total > 0 ? Math.round((d.sessions / total) * 100) : 0;
                    const Icon = DEVICE_ICONS[d.device] || Monitor;
                    return (
                      <div key={d.device} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-zinc-700">
                            <Icon className="w-3.5 h-3.5 text-zinc-400" />
                            {DEVICE_LABELS[d.device] || d.device}
                          </span>
                          <span className="font-semibold text-zinc-900">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-800 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 트래픽 소스 */}
          <Card className="border-zinc-200/80 shadow-none">
            <CardHeader className="pb-0 pt-4 px-4 gap-0">
              <CardTitle className="text-sm font-semibold text-zinc-800">유입 채널</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3 pt-1">
              {loading ? (
                <Skeleton className="h-[120px] w-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={data?.sources}
                      dataKey="sessions"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={50}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {(data?.sources ?? []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e4e4e7",
                        fontSize: 11,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 트래픽 소스 상세 */}
        <Card className="border-zinc-200/80 shadow-none">
          <CardHeader className="pb-0 pt-4 px-4 gap-0">
            <CardTitle className="text-sm font-semibold text-zinc-800">유입 채널 상세</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(data?.sources ?? []).map((s, i) => {
                  const total = (data?.sources ?? []).reduce((sum, x) => sum + x.sessions, 0);
                  const pct = total > 0 ? Math.round((s.sessions / total) * 100) : 0;
                  return (
                    <div key={s.source} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-xs text-zinc-600 flex-1 truncate">{s.source}</span>
                      <span className="text-xs font-medium text-zinc-500">{s.sessions}</span>
                      <span className="text-xs font-semibold text-zinc-900 w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 전환율 (상담 신청) */}
        <Card className="border-zinc-200/80 shadow-none">
          <CardHeader className="pb-0 pt-4 px-4 gap-0">
            <CardTitle className="text-sm font-semibold text-zinc-800">
              상담 신청 전환
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            {loading ? (
              <Skeleton className="h-[180px] w-full rounded-lg" />
            ) : (
              <>
                {/* 전환 요약 수치 */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-[11px] text-zinc-500 mb-0.5">전환율</p>
                    <p className="text-xl font-bold text-zinc-900">
                      {data?.conversions.conversionRate ?? 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 mb-0.5">신청 수</p>
                    <div className="flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                      <p className="text-xl font-bold text-zinc-900">
                        {data?.conversions.totalLeads ?? 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 mb-0.5">총 세션</p>
                    <p className="text-xl font-bold text-zinc-900">
                      {(data?.conversions.totalSessions ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* 일별 전환 바 차트 */}
                <div className="space-y-1">
                  <p className="text-[11px] text-zinc-400 mb-1.5">일별 상담 신청</p>
                  <div className="flex items-end gap-[3px] h-[80px]">
                    {(data?.conversions?.daily ?? []).map((d) => {
                      const maxLeads = Math.max(
                        ...((data?.conversions?.daily ?? []).map((x) => x.leads)),
                        1
                      );
                      const h = d.leads > 0 ? Math.max((d.leads / maxLeads) * 100, 8) : 4;
                      return (
                        <div
                          key={d.date}
                          className="flex-1 flex flex-col items-center justify-end h-full"
                        >
                          <div
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              d.leads > 0 ? "bg-emerald-500" : "bg-zinc-200"
                            }`}
                            style={{ height: `${h}%` }}
                            title={`${formatDate(d.date)}: ${d.leads}건`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>
                      {data?.conversions.daily?.[0] && formatDate(data.conversions.daily[0].date)}
                    </span>
                    <span>
                      {data?.conversions.daily &&
                        data.conversions.daily.length > 0 &&
                        formatDate(data.conversions.daily[data.conversions.daily.length - 1].date)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

// ── 통계 카드 ──
function StatCard({
  label,
  value,
  prev,
  icon: Icon,
  loading,
  format,
}: {
  label: string;
  value?: number;
  prev?: number;
  icon: typeof Users;
  loading: boolean;
  format?: (v: number) => string;
}) {
  return (
    <Card className="border-zinc-200/80 shadow-none">
      <CardContent className="p-4 pb-3.5">
        {loading ? (
          <>
            <Skeleton className="h-3 w-12 mb-2" />
            <Skeleton className="h-7 w-16" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[11px] text-zinc-500 font-medium">{label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-zinc-900 leading-none">
                {format ? format(value ?? 0) : (value ?? 0).toLocaleString()}
              </span>
              <ChangeIndicator curr={value ?? 0} prev={prev ?? 0} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── 변화율 표시 ──
function ChangeIndicator({
  curr,
  prev,
  invert = false,
}: {
  curr: number;
  prev: number;
  invert?: boolean;
}) {
  const pct = pctChange(curr, prev);
  if (pct === 0) return null;

  const isUp = pct > 0;
  const isPositive = invert ? !isUp : isUp;
  const color = isPositive ? "text-emerald-600" : "text-red-500";
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <span className={`flex items-center gap-0.5 text-[11px] font-medium ${color} pb-0.5`}>
      <TrendIcon className="w-3 h-3" />
      {Math.abs(pct)}%
    </span>
  );
}
