import { useRef } from "react";
import { motion, useInView } from "motion/react";

const IMG_MRI    = "https://images.unsplash.com/photo-1658351354155-e854d19233e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
const IMG_XRAY   = "https://images.unsplash.com/photo-1559000357-f6b52ddfbe37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";
const IMG_CLINIC = "https://images.unsplash.com/photo-1579488081688-3dbbbae7893e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

const cases = [
  {
    tag: "신규개원",
    region: "충북 A병원",
    equipment: "MRI 장비 도입",
    lump: "6억 7,000만원",
    monthly: "25,312,100원",
    period: "36개월",
    result: "초기 6.7억 부담 없이 개원. 운영 3개월 내 손익분기 달성.",
    img: IMG_MRI,
    index: "01",
  },
  {
    tag: "병원확장",
    region: "경기 B병원",
    equipment: "X-RAY 장비 도입",
    lump: "3억 3,000만원",
    monthly: "12,467,400원",
    period: "36개월",
    result: "장비 도입 후 6개월 내 매출 30% 증가. 초기비용 전액 절감.",
    img: IMG_XRAY,
    index: "02",
  },
  {
    tag: "리모델링",
    region: "인천 C병원",
    equipment: "피부 레이저장비",
    lump: "1억 3,000만원",
    monthly: "4,911,500원",
    period: "36개월",
    result: "레이저 시술 도입 후 3개월 내 투자비용 전액 회수.",
    img: IMG_CLINIC,
    index: "03",
  },
];

export function CaseStudiesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="cases" className="bg-zinc-950 py-16 sm:py-28" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8 mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-zinc-500" />
              Case Studies
            </p>
            <h2
              className="text-white"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
              }}
            >
              실제 도입 사례
            </h2>
          </motion.div>
          <motion.p
            className="text-zinc-400 text-sm max-w-xs leading-relaxed lg:text-right"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            * 실제 진행 사례를 기반으로 작성되었습니다.<br />
            병원 상황에 따라 조건이 달라질 수 있습니다.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-800">
          {cases.map((c, i) => (
            <motion.div
              key={c.region}
              className="bg-zinc-950 flex flex-col group overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={c.img}
                  alt={c.equipment}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-zinc-950/30 group-hover:bg-zinc-950/15 transition-colors duration-500" />

                {/* Index watermark */}
                <div
                  className="absolute bottom-0 right-0 text-white/15 font-black select-none leading-none"
                  style={{ fontSize: "5rem", letterSpacing: "-0.05em", lineHeight: 0.9 }}
                  aria-hidden="true"
                >
                  {c.index}
                </div>

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-sky-600 text-white text-xs font-semibold px-3 py-1.5 tracking-wider uppercase">
                    {c.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-zinc-400 text-sm mb-1">{c.region}</p>
                    <h3 className="text-white font-bold" style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
                      {c.equipment}
                    </h3>
                  </div>
                </div>

                {/* Finance numbers */}
                <div className="space-y-0 mb-6 border border-zinc-800 divide-y divide-zinc-800">
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-zinc-400 text-sm">일시불 구매가</span>
                    <span className="text-zinc-500 text-sm line-through">{c.lump}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-zinc-400 text-sm">렌탈 초기비용</span>
                    <span className="text-sky-400 font-bold text-base">0원</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-zinc-400 text-sm">월 납입 ({c.period})</span>
                    <span className="text-white font-semibold text-base">{c.monthly}</span>
                  </div>
                </div>

                {/* Result */}
                <div className="mt-auto pt-5 border-t border-zinc-800">
                  <p className="text-zinc-300 text-sm leading-relaxed">{c.result}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom statement */}
        <motion.div
          className="mt-10 sm:mt-16 pt-8 sm:pt-10 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <p
            className="text-zinc-300 max-w-lg"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.5 }}
          >
            "초기 비용 없이 최신 장비를 도입하고,<br />
            <span className="text-white">수익으로 비용을 충당하세요."</span>
          </p>
          <a
            href="#consult"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("consult")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="shrink-0 bg-sky-600 text-white text-base font-semibold px-8 py-4 hover:bg-sky-700 active:bg-sky-800 transition-colors w-full sm:w-auto text-center"
          >
            무료 상담 신청
          </a>
        </motion.div>
      </div>
    </section>
  );
}