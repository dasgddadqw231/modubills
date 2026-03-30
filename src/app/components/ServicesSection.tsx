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
    title: "KB 국민카드",
    tag: "장비 필수",
    badge: "국내 유일 초장기",
    amount: "최대 2억",
    period: "최대 60개월",
    meta: [
      { label: "한도", value: "최대 2억" },
      { label: "기간", value: "최대 60개월" },
      { label: "대상", value: "개인사업자 전용" },
      { label: "특징", value: "정산일 결제후 D+5일" },
    ],
    points: [
      "병원·약국 개인사업자 전용 (법인/재단 불가)",
      "최대 2억 / 최대 60개월",
      "정산일 결제 후 D+5일 입금",
      "간편 심사 절차",
    ],
    desc: "병원·약국 개인사업자 전용(법인/재단 불가) 상품입니다. 정산일 결제 후 D+5일 내 최대 2억을 지원받을 수 있으며 최대 60개월 분할이 가능합니다.",
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
  setActive,
  inView,
  indexOffset,
  onConsultClick,
}: {
  label: string;
  services: ServiceItem[];
  active: string | null;
  setActive: (v: string | null) => void;
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
          const isActive = active === svc.num;
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
                onClick={() => setActive(isActive ? null : svc.num)}
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
                        <div className="mt-10 border border-dashed border-sky-200 rounded-lg p-6 bg-sky-50/30">
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
   핵심 특장점 블록
──────────────────────────────────────────── */
function CoreAdvantages() {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 핵심 특장점 */}
      <div className="border-2 border-sky-100 rounded-2xl p-8 bg-gradient-to-br from-sky-50/60 to-white">
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
      <div className="border border-dashed border-sky-200 rounded-2xl p-8 bg-white">
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
  const [active, setActive] = useState<string | null>(null);
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
              11가지<br />자금 솔루션
            </h2>
          </motion.div>

          <motion.div
            className="lg:col-span-5 flex flex-col justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-zinc-500 text-base leading-relaxed mb-6">
              비금융 8종 + 제휴 금융권 3종.<br />
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
          setActive={setActive}
          inView={inView}
          indexOffset={0}
          onConsultClick={onConsultClick}
        />

        {/* 제휴 금융권 상품 */}
        <ServiceGroup
          label="제휴 금융권 상품"
          services={financialServices}
          active={active}
          setActive={setActive}
          inView={inView}
          indexOffset={9}
          onConsultClick={onConsultClick}
        />
      </div>
    </section>
  );
}