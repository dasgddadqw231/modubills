import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "./ui/utils";

/* ────────────────────────────────────────────
   비금융 자금 솔루션 (01 – 08)
──────────────────────────────────────────── */
const nonFinancialServices = [
  {
    num: "01",
    title: "구매자금",
    tag: "장비 필수",
    badge: null,
    amount: "3억 이하",
    period: "12 – 48개월",
    meta: [
      { label: "한도", value: "3억 이하" },
      { label: "기간", value: "12~48개월" },
      { label: "조건", value: "무담보", highlight: true },
      { label: "특징", value: "100% 비용처리" },
    ],
    points: [
      "신규구매(의료기기·전자제품·가구 등) 전용",
      "무담보 조건 최대 3억 지원",
      "100% 비용처리 가능",
      "초기 현금 부담 없이 장비 도입",
    ],
    desc: "신규 구매(의료기기, 전자제품, 가구 등)에 활용 가능한 비금융 자금 상품입니다. 무담보 조건으로 최대 3억까지 지원하며 100% 용처리가 가능합니다.",
  },
  {
    num: "02",
    title: "신규렌탈",
    tag: "장비 필수",
    badge: null,
    amount: "2 – 3억",
    period: "36개월",
    meta: [
      { label: "한도", value: "2~3억" },
      { label: "기간", value: "36개월" },
      { label: "특징", value: "비용처리 최적화" },
    ],
    points: [
      "신규 장비 도입 시 36개월 분할 이용",
      "2~3억 한도 렌탈 지원",
      "비용처리 최적화 구조",
      "초기비용 절감 효과",
    ],
    desc: "신규 장비 도입 시 36개월 분할 이용으로 비용처리를 최적화하세요. 2~3억 한도의 렌탈 상품으로 초기 자금 부담을 줄일 수 있습니다.",
  },
  {
    num: "03",
    title: "임차보증금 담보상품",
    tag: "보증금 활용",
    badge: null,
    amount: "보증금 100%",
    period: "12 – 48개월",
    meta: [
      { label: "한도", value: "보증금 100%" },
      { label: "기간", value: "12~48개월" },
      { label: "조건", value: "임대인 동의 필요" },
    ],
    points: [
      "임대인의 권리보호까지 보장",
      "보증금 기반 최대 100% 지원",
      "임대인 동의 시 빠른 승인",
      "운영자금·장비구매·인테리어 활용",
    ],
    desc: "임대인의 권리보호까지 보장드리는 상품으로 최대 100%까지 지원합니다. 병원 임차보증금에 묶인 자금을 즉시 유동화해 운영자금·장비구매에 활용하세요.",
  },
  {
    num: "04",
    title: "카드매출 담보상품",
    tag: "매출 활용",
    badge: null,
    amount: "월카드매출 200%",
    period: "12 – 48개월",
    meta: [
      { label: "한도", value: "월카드매출 200%", highlight: true },
      { label: "기간", value: "12~48개월" },
      { label: "대상", value: "개원 1년↑" },
      { label: "특징", value: "100% 비용처리" },
    ],
    points: [
      "개원 1년 이상 병원 대상",
      "신용등급 하락 없이 지원 가능",
      "월 카드매출 최대 200% 한도",
      "100% 비용처리 가능",
    ],
    desc: "개원 1년 이상이라면 신용등급 하락 없이 월 카드매출의 최대 200%까지 지원받을 수 있습니다. 유연한 납부 구조로 운영자금을 조달하세요.",
  },
  {
    num: "05",
    title: "KT 병원 솔루션 구축사업",
    tag: "장비 필수",
    badge: "최대 100억 지원 가능",
    amount: "1억 – 100억",
    period: "SGI 증권발급",
    meta: [
      { label: "한도", value: "1억~100억" },
      { label: "조건", value: "병원 외 가능" },
      { label: "특징", value: "SGI 증권발급", highlight: true },
    ],
    points: [
      "대출상품 아님 / 총비용 계산서 전액 발행",
      "병원 외 다양한 사업장도 가능",
      "SGI 증권 발급 방식",
      "최대 100억까지 지원",
    ],
    desc: "대출상품이 아닌 총비용 계산서 전액 발행 방식입니다. 병원뿐만 아니라 다양한 사업장에 활용 가능하며 SGI 증권발급으로 최대 100억까지 지원합니다.",
  },
  {
    num: "06",
    title: "신탁 자금",
    tag: "단기 운용",
    badge: null,
    amount: "최대 10억",
    period: "3 – 5개월",
    meta: [
      { label: "한도", value: "최대 10억", highlight: true },
      { label: "기간", value: "3~5개월" },
      { label: "금리", value: "월 4%" },
      { label: "조건", value: "카드매출 30~50%" },
    ],
    points: [
      "카드매출 30~50% 집행 조건",
      "3~5개월 단기 운용 특화",
      "월 4% 금리",
      "최대 10억 지원",
    ],
    desc: "카드매출의 30~50%를 집행 조건으로 3~5개월 단기 운용이 가능한 신탁 자금 상품입니다. 빠른 자금 회전이 필요한 경우 최대 10억까지 지원합니다.",
  },
  {
    num: "07",
    title: "렌탈백 (Rental-back)",
    tag: "장비 필수",
    badge: null,
    amount: "장비가치 80%",
    period: "12개월",
    meta: [
      { label: "한도", value: "장비가치 80%" },
      { label: "기간", value: "12개월" },
      { label: "특징", value: "비용처리·DSR미포함" },
    ],
    points: [
      "보유 장비 매각 후 재렌탈",
      "3년 이내 장비 가치의 80% 즉시 현금화",
      "100% 비용처리 가능",
      "DSR 규제 미포함",
    ],
    desc: "보유 장비를 매각한 뒤 재렌탈하여 즉시 현금을 확보하는 구조입니다. 3년 이내 장비 가치의 80%를 즉시 현금화하며 DSR 규제 미포함 상품입니다.",
  },
  {
    num: "08",
    title: "중고장비 매입",
    tag: "장비 필수",
    badge: null,
    amount: "구입가 80%",
    period: "즉시 현금화",
    meta: [
      { label: "한도", value: "구입가 80%" },
      { label: "대상", value: "7년 이내 장비" },
      { label: "특징", value: "즉시 현금화" },
    ],
    points: [
      "의료장비 구입가(7년 이내) 최대 80% 매입",
      "7년 이내 장비 우선 매입",
      "즉시 현금화",
      "당일 상담·당일 견적",
    ],
    desc: "의료장비 구입가(7년 이내)의 최대 80%를 매입합니다. 즉시 현금화로 운영자금 공백을 빠르게 해결하세요.",
  },
  {
    num: "09",
    title: "개인사업자 특별한도 상품",
    tag: "장비 필수",
    badge: "KB · 하나 · 신한",
    amount: "최대 2억",
    period: "최대 60개월",
    meta: [
      { label: "한도", value: "최대 2억" },
      { label: "기간", value: "최대 60개월" },
      { label: "대상", value: "개인사업자 전용" },
      { label: "제휴은행", value: "KB · 하나 · 신한", highlight: true },
      { label: "특징", value: "정산일 결제후 D+5일" },
    ],
    points: [
      "KB국민카드 · 하나카드 · 신한카드 제휴",
      "병원·약국 개인사업자 전용 (법인/재단 불가)",
      "최대 2억 / 최대 60개월",
      "정산일 결제 후 D+5일 입금",
    ],
    desc: "KB국민카드·하나카드·신한카드와 제휴한 개인사업자 전용 특별한도 상품입니다. 정산일 결제 후 D+5일 내 최대 2억을 지원받을 수 있으며 최대 60개월 분할이 가능합니다.",
  },
];

/* ────────────────────────────────────────────
   제휴 금융권 상품 (10 – 11)
──────────────────────────────────────────── */
const financialServices = [
  {
    num: "10",
    title: "신협 데일리론",
    tag: "제휴 금융",
    badge: null,
    amount: "최대 1.5억",
    period: "금리 5.3~6%",
    meta: [
      { label: "한도", value: "최대 1.5억" },
      { label: "금리", value: "5.3~6%", highlight: true },
      { label: "대상", value: "6개월↑ 사업자" },
      { label: "특징", value: "중도상환수수료 무" },
    ],
    points: [
      "6개월 이상 사업자 대상",
      "금리 5.3~6% (최저 수준)",
      "중도상환수수료 없음",
      "카드매출 기반 일일공제 방식",
    ],
    desc: "6개월 이상 사업자를 대상으로 금리 5.3~6%로 최대 1.5억을 지원합니다. 중도상환수수료가 없어 유연하게 활용할 수 있습니다.",
  },
  {
    num: "11",
    title: "수협 행복대출",
    tag: "제휴 금융",
    badge: null,
    amount: "최대 2.5억",
    period: "최장 10년",
    meta: [
      { label: "한도", value: "최대 2.5억" },
      { label: "금리", value: "최저 5.5%~" },
      { label: "기간", value: "최장 10년" },
      { label: "특징", value: "매일상환" },
    ],
    points: [
      "최근 1년 카드매출 40~70% 기준",
      "최대 2.5억 지원",
      "최저 금리 5.5%~",
      "최장 10년 / 매일상환 방식",
    ],
    desc: "최근 1년 카드매출의 40~70%를 기준으로 최대 2.5억을 지원합니다. 최저 금리 5.5%로 최장 10년 상환 가능한 매일상환 방식입니다.",
  },
];

/* ────────────────────────────────────────────
   신규렌탈 연 회수율 테이블 (09번 아이템 하단)
──────────────────────────────────────────── */
const rentalRates = {
  prepayment: [
    { label: "무선납", rate: "12.06" },
    { label: "8%", rate: "7.79" },
    { label: "17%", rate: "3.58" },
    { label: "25%", rate: "0.67" },
  ],
  deposit: [
    { label: "무보증", rate: "12.55" },
    { label: "10%", rate: "9.47" },
    { label: "20%", rate: "6.90" },
    { label: "30%", rate: "4.85" },
  ],
};

type ServiceItem = {
  num: string;
  title: string;
  tag: string;
  badge: string | null;
  amount: string;
  period: string;
  meta: { label: string; value: string; highlight?: boolean }[];
  points: string[];
  desc: string;
};

interface ServicesSectionProps {
  onConsultClick: () => void;
}

function ServiceGroup({
  label,
  services,
  active,
  toggle,
  inView,
  indexOffset,
  onConsultClick,
}: {
  label: string;
  services: ServiceItem[];
  active: Set<string>;
  toggle: (v: string) => void;
  inView: boolean;
  indexOffset: number;
  onConsultClick: () => void;
}) {
  return (
    <div className="mb-16">
      {/* Category label */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-zinc-400 font-medium">
          {label}
        </span>
        <span className="flex-1 h-px bg-zinc-100" />
      </div>

      <div className="border-t-2 border-zinc-950">
        {services.map((svc, i) => {
          const isActive = active.has(svc.num);
          return (
            <motion.div
              key={svc.num}
              className="border-b border-zinc-100"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + (indexOffset + i) * 0.06 }}
            >
              <button
                className={cn(
                  "w-full text-left py-5 sm:py-6 px-0 flex items-center gap-3 sm:gap-5 group transition-all active:bg-zinc-50",
                  isActive ? "bg-zinc-50 px-4 sm:px-6 -mx-4 sm:-mx-6" : "hover:bg-zinc-50/70 hover:px-6 hover:-mx-6"
                )}
                onClick={() => toggle(svc.num)}
              >
                {/* Number */}
                <span
                  className="text-zinc-200 font-mono shrink-0 transition-colors group-hover:text-zinc-400"
                  style={{
                    fontSize: "clamp(1.3rem, 2.5vw, 2.25rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    minWidth: "2.2rem",
                  }}
                >
                  {svc.num}
                </span>

                {/* Title + badge + tag */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-3 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="text-zinc-900 font-bold shrink-0"
                      style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)", letterSpacing: "-0.02em" }}
                    >
                      {svc.title}
                    </h3>
                    {svc.tag === "장비 필수" && (
                      <span className="text-[11px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                        장비 필수
                      </span>
                    )}
                    {svc.badge && (
                      <span className="text-[11px] bg-sky-600 text-white px-2 py-0.5 rounded-full font-semibold shrink-0">
                        {svc.badge}
                      </span>
                    )}
                  </div>
                  {svc.tag !== "장비 필수" && (
                    <span className="hidden sm:inline text-xs text-zinc-400 border border-zinc-200 px-2 py-0.5 shrink-0 mt-1 sm:mt-0">
                      {svc.tag}
                    </span>
                  )}
                </div>

                {/* Amount + period */}
                <div className="hidden md:flex items-center gap-8 shrink-0">
                  <div className="text-right">
                    <p className="text-sky-600 font-bold text-base">{svc.amount}</p>
                    <p className="text-zinc-400 text-sm mt-0.5">{svc.period}</p>
                  </div>
                </div>

                {/* Toggle */}
                <span className="shrink-0 w-7 h-7 border border-zinc-200 flex items-center justify-center transition-colors group-hover:border-zinc-400">
                  {isActive
                    ? <Minus className="w-3 h-3 text-zinc-700" />
                    : <Plus className="w-3 h-3 text-zinc-400" />}
                </span>
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 sm:pb-10 pt-2 sm:pt-3 px-2 sm:px-6 md:px-0 md:pl-[4.5rem]">
                      {/* Meta chips */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                        {svc.meta.map((m) => (
                          <span
                            key={m.label}
                            className="inline-flex items-center gap-1.5 text-sm border border-zinc-100 px-3 py-1.5 bg-white"
                          >
                            <span className="text-zinc-400">{m.label}</span>
                            <span
                              className={cn(
                                "font-semibold",
                                m.highlight ? "text-sky-600" : "text-zinc-700"
                              )}
                            >
                              {m.value}
                            </span>
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                        <div>
                          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
                            {svc.desc}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onConsultClick();
                            }}
                            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold bg-zinc-950 text-white px-5 sm:px-6 py-3 hover:bg-zinc-700 active:bg-zinc-800 transition-colors w-full sm:w-auto justify-center sm:justify-start"
                          >
                            이 상품으로 상담 신청
                          </button>
                        </div>
                        <ul className="space-y-2.5 sm:space-y-3">
                          {svc.points.map((pt) => (
                            <li key={pt} className="flex items-start gap-2.5 sm:gap-3 text-sm sm:text-base">
                              <span className="w-4 h-4 sm:w-5 sm:h-5 bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-sky-500 rounded-full" />
                              </span>
                              <span className="text-zinc-600">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 신규렌탈 연 회수율 테이블 (02번 전용) */}
                      {svc.num === "02" && (
                        <div className="mt-8 sm:mt-10 border border-dashed border-sky-200 rounded-lg p-4 sm:p-6 bg-sky-50/30">
                          <div className="flex items-center gap-3 mb-5">
                            <span className="text-[11px] bg-sky-600 text-white px-2 py-0.5 rounded font-semibold tracking-widest">
                              RATE TABLE
                            </span>
                            <p className="text-zinc-800 font-bold text-base">신규렌탈 연 회수율</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* 선납금 기준 */}
                            <div>
                              <div className="flex justify-between items-baseline mb-3">
                                <p className="text-sm text-zinc-600 font-semibold">선납금 기준</p>
                                <p className="text-xs text-zinc-400">(단위: %)</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {rentalRates.prepayment.map((r) => (
                                  <div
                                    key={r.label}
                                    className="bg-white border border-zinc-100 rounded px-3 py-2 flex items-center justify-between"
                                  >
                                    <span className="text-sm text-zinc-500">{r.label}</span>
                                    <span className="text-sky-600 font-bold text-base">{r.rate}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* 보증금 기준 */}
                            <div>
                              <div className="flex justify-between items-baseline mb-3">
                                <p className="text-sm text-zinc-600 font-semibold">보증금 기준</p>
                                <p className="text-xs text-zinc-400">(단위: %)</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {rentalRates.deposit.map((r) => (
                                  <div
                                    key={r.label}
                                    className="bg-white border border-zinc-100 rounded px-3 py-2 flex items-center justify-between"
                                  >
                                    <span className="text-sm text-zinc-500">{r.label}</span>
                                    <span className="text-sky-600 font-bold text-base">{r.rate}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   정책자금 상품 데이터
──────────────────────────────────────────── */
const policyFunds = [
  {
    name: "신용보증 재단",
    desc: "지역 기반 병의원\n운전자금 중심 검토",
    color: "from-sky-400 to-sky-500",
  },
  {
    name: "신용보증 기금",
    desc: "중소기업 신용보증 전문\n대출 보증서 발급 지원",
    color: "from-sky-500 to-sky-600",
  },
  {
    name: "기술보증 재단",
    desc: "지역 기술기업 대상\n기술평가 기반 보증 지원",
    color: "from-sky-400 to-blue-500",
  },
  {
    name: "기술보증기금",
    desc: "기술성·성장성\n특화 구조 검토",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "중소기업 벤처부",
    desc: "중소기업 정책자금\n직접 대출·융자 지원",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "지자체 및 지역 신보",
    desc: "지자체 협약자금\n지역 특화 자금 지원",
    color: "from-indigo-400 to-indigo-600",
  },
];

const policyStats = [
  { stat: "5~40억", label: "병원별 최대한도" },
  { stat: "150+", label: "지원 받은 병원수" },
  { stat: "22억", label: "평균 승인 금액" },
];

const policyProcess = [
  { step: "01", title: "상담 및 접수", desc: "기업 현황과 자금 수요를\n기초적으로 확인합니다." },
  { step: "02", title: "정밀 진단", desc: "재무상태, 신용도, 업종 특성,\n기존 차입 구조를 분석합니다." },
  { step: "03", title: "가능성 검토", desc: "기관별 지원 가능 여부와\n예상 한도, 적합 상품을 검토합니다." },
  { step: "04", title: "맞춤 전략 설계", desc: "최적의 자금 조달 구조와\n진행 방향을 제안합니다." },
  { step: "05", title: "실행 지원", desc: "서류 준비, 접수, 심사 대응,\n승인 및 실행까지 지원합니다." },
];

const fundTypes = [
  { name: "시설자금", desc: "공사 견적서, 공사내역서, 시공 계약서,\n임대차계약서 등", icon: "🏗️" },
  { name: "장비자금", desc: "장비 견적서, 발주서, 제품 설명자료", icon: "⚙️" },
  { name: "운전자금", desc: "자금사용계획서, 매출추이자료, 입출금내역", icon: "💰" },
  { name: "보증연계", desc: "보증신청 관련 확인서류, 기존 금융거래 자료", icon: "🛡️" },
];

/* ────────────────────────────────────────────
   정책자금 소개 블록
──────────────────────────────────────────── */
function PolicyFundsSection({ onConsultClick, inView }: { onConsultClick: () => void; inView: boolean }) {
  return (
    <div className="mt-8 mb-16">
      {/* Category label */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-zinc-400 font-medium">
          정책자금 상품
        </span>
        <span className="flex-1 h-px bg-zinc-100" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        {/* 헤더 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm text-zinc-400">메디컬론 한도가 차있어도?</span>
            </div>
            <h3
              className="text-zinc-950"
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.15,
              }}
            >
              정책자금으로<br />
              <span className="text-sky-600">추가 집행 가능</span>
            </h3>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-zinc-500 text-base leading-relaxed">
              병원은 일반 소상공인 자금보다, 의료기관에 맞는<br className="hidden sm:inline" />
              보증·은행·특화사업 구조로 접근해야 합니다.<br className="hidden sm:inline" />
              모두빌스가 최적 경로를 설계합니다.
            </p>
          </div>
        </div>

        {/* 정책자금 6종 기관 */}
        <div className="relative">
          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 relative z-10 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {policyFunds.map((fund, i) => (
              <motion.div
                key={fund.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="flex flex-col items-center shrink-0 w-[160px] sm:w-auto"
              >
                {/* 라벨 칩 */}
                <div className={`bg-gradient-to-r ${fund.color} text-white text-sm font-bold px-5 py-2 rounded-full mb-4 shadow-sm`}>
                  {fund.name}
                </div>
                {/* 카드 */}
                <div className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
                  <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                    {fund.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 자금 유형 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <h4 className="text-lg font-bold text-zinc-800 mb-4">자금 유형별 안내</h4>
          <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto md:overflow-visible pb-3 md:pb-0 scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {fundTypes.map((type) => (
              <div
                key={type.name}
                className="bg-white border border-zinc-100 rounded-xl p-5 text-center hover:shadow-md transition-shadow shrink-0 w-[160px] md:w-auto"
              >
                <span className="text-2xl mb-2 block">{type.icon}</span>
                <p className="text-sm font-bold text-zinc-800 mb-1">{type.name}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 맞춤형 진단 프로세스 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10"
        >
          <h4 className="text-lg font-bold text-zinc-800 mb-4">맞춤형 진단 프로세스</h4>
          <div className="relative">
            {/* 연결선 (데스크톱) */}
            <div className="hidden md:block absolute top-[2.75rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-sky-200 via-sky-300 to-blue-300 z-0" />
            <div className="flex md:grid md:grid-cols-5 gap-3 sm:gap-4 relative z-10 overflow-x-auto md:overflow-visible pb-3 md:pb-0 scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {policyProcess.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                  className="flex flex-col items-center text-center shrink-0 w-[130px] md:w-auto"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center mb-3 shadow-sm">
                    {item.step}
                  </div>
                  <p className="text-sm font-bold text-zinc-800 mb-1">{item.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed whitespace-pre-line">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {policyStats.map((item) => (
            <div
              key={item.label}
              className="bg-white border border-zinc-100 rounded-xl p-5 sm:p-6 text-center shrink-0 w-[200px] sm:w-auto"
            >
              <p className="text-zinc-400 text-sm mb-2">{item.label}</p>
              <p
                className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-500 font-extrabold"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.04em" }}
              >
                {item.stat}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={onConsultClick}
            className="inline-flex items-center gap-2 text-base font-semibold bg-zinc-950 text-white px-8 py-3.5 hover:bg-zinc-700 active:bg-zinc-800 transition-colors"
          >
            정책자금 가능 여부 무료 진단 받기
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────
   핵심 특장점 블록
──────────────────────────────────────────── */
function CoreAdvantages() {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 핵심 특장점 */}
      <div className="border-2 border-sky-100 rounded-2xl p-5 sm:p-8 bg-gradient-to-br from-sky-50/60 to-white">
        <div className="flex items-center gap-3 mb-7">
          <span className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h4 className="text-zinc-900 font-bold" style={{ fontSize: "1.2rem", letterSpacing: "-0.03em" }}>
            핵심 특장점
          </h4>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-sky-500 pl-4">
            <p className="text-sky-700 font-bold text-base mb-1">DSR 규제 미포함</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              비금융상품으로{" "}
              <span className="text-sky-600 font-semibold">개인/법인 대출한도 미포함</span>
              <br />
              (신협 협약 상품 제외)
            </p>
          </div>
          <div className="border-l-4 border-sky-500 pl-4">
            <p className="text-sky-700 font-bold text-base mb-1">100% 비용처리 가능</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              <span className="text-sky-600 font-semibold">절세 효과 극대화</span> 및<br />
              합법적 비용 처리 전액 지원
            </p>
          </div>
        </div>

        {/* 통계 */}
        <div className="mt-8 pt-6 border-t border-sky-100 grid grid-cols-3 gap-4">
          {[
            { stat: "500+", label: "거래 병원" },
            { stat: "99%", label: "재계약률" },
            { stat: "전국", label: "지원 범위" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-zinc-400 text-xs mb-1">{item.label}</p>
              <p className="text-zinc-900 font-bold" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", letterSpacing: "-0.04em" }}>
                {item.stat}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 신규렌탈 연 회수율 요약 */}
      <div className="border border-dashed border-sky-200 rounded-2xl p-5 sm:p-8 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[11px] bg-sky-600 text-white px-2.5 py-1 rounded font-semibold tracking-widest">
            RATE TABLE
          </span>
          <h4 className="text-zinc-900 font-bold" style={{ fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
            신규렌탈 연 회수율
          </h4>
        </div>

        <div className="space-y-6">
          {/* 선납금 기준 */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <p className="text-sm text-zinc-700 font-semibold">선납금 기준</p>
              <p className="text-xs text-zinc-400">(단위: %)</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {rentalRates.prepayment.map((r) => (
                <div key={r.label} className="bg-zinc-50 border border-zinc-100 rounded px-2 py-2.5 text-center">
                  <p className="text-xs text-zinc-400 mb-1">{r.label}</p>
                  <p className="text-sky-600 font-bold text-base">{r.rate}</p>
                </div>
              ))}
            </div>
          </div>
          {/* 보증금 기준 */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <p className="text-sm text-zinc-700 font-semibold">보증금 기준</p>
              <p className="text-xs text-zinc-400">(단위: %)</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {rentalRates.deposit.map((r) => (
                <div key={r.label} className="bg-zinc-50 border border-zinc-100 rounded px-2 py-2.5 text-center">
                  <p className="text-xs text-zinc-400 mb-1">{r.label}</p>
                  <p className="text-sky-600 font-bold text-base">{r.rate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   메인 섹션
──────────────────────────────────────────── */
export function ServicesSection({ onConsultClick }: ServicesSectionProps) {
  const [active, setActive] = useState<Set<string>>(new Set());
  const toggle = (num: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="services" className="py-16 sm:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-20">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-zinc-300 inline-block" />
              Services
            </p>
            <h2
              className="text-zinc-950"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
              }}
            >
              11가지 자금 솔루션<br />+ 정책자금
            </h2>
          </motion.div>

          <motion.div
            className="lg:col-span-5 flex flex-col justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-zinc-500 text-base leading-relaxed mb-6">
              비금융 9종 + 제휴 금융권 2종 + 정책자금.<br />
              병원 상황에 따라 가장 유리한 상품이 다릅니다.<br />
              전담 컨설턴트가 최적 조합을 무료로 분석합니다.
            </p>
            <button
              onClick={onConsultClick}
              className="self-start text-base font-semibold text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-sky-600 hover:border-sky-600 transition-colors"
            >
              맞춤 상품 분석 받기 →
            </button>
          </motion.div>
        </div>

        {/* 비금융 자금 솔루션 */}
        <ServiceGroup
          label="비금융 자금 솔루션"
          services={nonFinancialServices}
          active={active}
          toggle={toggle}
          inView={inView}
          indexOffset={0}
          onConsultClick={onConsultClick}
        />

        {/* 제휴 금융권 상품 */}
        <ServiceGroup
          label="제휴 금융권 상품"
          services={financialServices}
          active={active}
          toggle={toggle}
          inView={inView}
          indexOffset={9}
          onConsultClick={onConsultClick}
        />

        {/* 정책자금 상품 소개 */}
        <PolicyFundsSection onConsultClick={onConsultClick} inView={inView} />
      </div>
    </section>
  );
}