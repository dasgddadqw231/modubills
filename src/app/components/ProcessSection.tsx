import { useRef } from "react";
import { motion, useInView } from "motion/react";

const steps = [
  {
    num: "01",
    title: "무료 상담 신청",
    desc: "전화 또는 온라인 폼으로 신청. 5분 이내로 완료됩니다.",
    sub: "당일 상담 가능",
    detail: "신청 즉시 담당 컨설턴트 배정",
  },
  {
    num: "02",
    title: "병원 상황 분석",
    desc: "전담 컨설턴트가 병원 규모, 매출 흐름, 필요 자금을 기반으로 최적 상품을 분석합니다.",
    sub: "1:1 맞춤 분석",
    detail: "24시간 내 분석 리포트 전달",
  },
  {
    num: "03",
    title: "맞춤 솔루션 제안",
    desc: "6가지 상품 중 가장 유리한 조건의 자금 계획을 구체적인 수치와 함께 제안합니다.",
    sub: "비용 구조 완전 공개",
    detail: "수수료·이자·조건 전부 사전 공개",
  },
  {
    num: "04",
    title: "신속 승인 및 집행",
    desc: "간소화된 심사로 최단 기간 내 자금을 집행합니다. KB 긴급자금은 D+5일 입금.",
    sub: "최단 D+5일",
    detail: "투명한 계약서 + 사후 관리 지원",
  },
];

export function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section className="py-16 sm:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-20">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-zinc-300" />
              Process
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
              상담부터<br />집행까지<br />4단계
            </h2>
          </motion.div>
          <motion.div
            className="lg:col-span-7 flex flex-col justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md">
              복잡한 서류와 기다림 없이 진행됩니다.<br />
              전담 컨설턴트가 각 단계마다 직접 안내합니다.
            </p>
            <div className="flex flex-wrap gap-6">
              {["완전 무료 상담", "24시간 내 응답", "숨겨진 비용 없음"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                  <span className="text-zinc-500 text-base">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Steps — large editorial numbered list */}
        <div>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.1 }}
            >
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-6 py-6 sm:py-10 border-t border-zinc-100 items-start group-hover:bg-zinc-50 transition-colors px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-sm">

                {/* Top row on mobile: number + title + desc */}
                <div className="flex items-start gap-3 sm:contents">
                  {/* Big number */}
                  <div className="sm:col-span-2 lg:col-span-1 shrink-0">
                    <span
                      className="text-zinc-150 font-black tabular-nums block group-hover:text-sky-100 transition-colors"
                      style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)", letterSpacing: "-0.06em", lineHeight: 1, color: "#e2e8f0" }}
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="sm:col-span-10 lg:col-span-6 min-w-0">
                    <h3
                      className="text-zinc-900 font-bold mb-1 sm:mb-2"
                      style={{ fontSize: "clamp(1rem, 1.8vw, 1.35rem)", letterSpacing: "-0.025em" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Right: sub + detail */}
                <div className="sm:col-span-12 lg:col-span-5 lg:flex lg:items-center lg:justify-end gap-6 pl-[calc(1.5rem+0.75rem)] sm:pl-0 mt-2 sm:mt-0">
                  <div className="flex sm:flex-row lg:flex-col items-center lg:items-end gap-2 sm:gap-4 lg:gap-2 sm:text-right">
                    <span className="text-xs text-zinc-400 border border-zinc-200 px-2.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap">
                      {step.sub}
                    </span>
                    <span className="text-zinc-400 text-xs sm:text-sm">{step.detail}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA bar */}
        <motion.div
          className="mt-16 bg-zinc-950 grid grid-cols-1 md:grid-cols-2 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {/* Left: phone */}
          <div className="p-4 sm:p-10 border-b md:border-b-0 md:border-r border-zinc-800">
            <p className="text-zinc-500 text-sm mb-2 uppercase tracking-widest">전화 문의</p>
            <a
              href="tel:010-9892-1927"
              className="text-white font-black hover:text-sky-400 transition-colors block"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.03em" }}
            >
              010-9892-1927
            </a>
            <p className="text-zinc-500 text-sm mt-2">평일 09:00 – 18:00</p>
          </div>

          {/* Right: online */}
          <div className="p-4 sm:p-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="#consult"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("consult")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 bg-white text-zinc-900 text-base font-semibold px-6 py-3.5 hover:bg-zinc-100 transition-colors"
            >
              온라인 상담 신청
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}