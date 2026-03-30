import { useRef } from "react";
import { motion, useInView } from "motion/react";
import cardImg from "@/assets/modubills-card.jpeg";

const testimonials = [
  {
    name: "김○○ 원장",
    specialty: "내과 · 경기도 수원",
    type: "신규개원",
    date: "2024년 11월",
    text: "개원 준비 중 자금 문제로 막막했는데, 모두빌스 상담 후 당일에 방향이 잡혔습니다. 무담보로 MRI까지 도입할 수 있다는 게 믿기지 않았어요. 개원 초기 현금 여유가 생겨 마케팅에 집중할 수 있었고, 3개월 만에 손익분기를 넘겼습니다.",
    highlight: "무담보 MRI 도입 · 3개월 손익분기",
    stars: 5,
  },
  {
    name: "이○○ 원장",
    specialty: "피부과 · 서울 강남",
    type: "병원확장",
    date: "2024년 09월",
    text: "카드매출 담보상품을 활용했어요. 숨겨진 조건이 있는지 담당자가 먼저 알려주셔서 정말 신뢰가 갔습니다. 생각보다 빠른 승인이 났고, 장비 도입 후 3개월 만에 투자를 전액 회수했습니다.",
    highlight: "3개월 내 투자 전액 회수",
    stars: 5,
  },
  {
    name: "박○○ 원장",
    specialty: "치과 · 인천 부평",
    type: "리모델링",
    date: "2025년 02월",
    text: "임차보증금 담보상품으로 묶여있던 자금을 유동화했습니다. 담당 컨설턴트가 처음부터 끝까지 한 분이 책임지고 진행해주셔서 안심이 됐어요. 리모델링 후 매출이 40% 이상 올랐습니다.",
    highlight: "보증금 유동화 · 매출 40% 상승",
    stars: 5,
  },
];


export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="testimonials" className="bg-zinc-50 overflow-hidden" ref={ref}>

      {/* ── Giant pullquote banner ──────────────────────────── */}
      <div className="bg-zinc-950 py-12 sm:py-20 px-5 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
          {/* Left — quote + stats */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              {/* Opening quotation mark */}
              <span
                className="text-sky-800 select-none block mb-2"
                style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 0.7, fontFamily: "Georgia, serif" }}
                aria-hidden="true"
              >
                "
              </span>
              <p
                className="text-white mb-8"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.3,
                  maxWidth: "820px",
                }}
              >
                병원은 자본력이 아니라,<br />자본 운용 능력이 만든다.
              </p>
              <p className="text-zinc-300 text-sm sm:text-base">
                자금 문제로 좋은 기회를 미루지 마세요. 모두빌스가 함께합니다.
              </p>
            </motion.div>

            {/* Stats row in dark */}
            <motion.div
              className="grid grid-cols-3 gap-0 mt-10 sm:mt-16 border-t border-zinc-800 pt-8 sm:pt-12 max-w-lg"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {[
                { v: "98%",    l: "재상담·추천률" },
                { v: "1,200+", l: "누적 상담" },
                { v: "450+",   l: "협력 병원" },
              ].map((s, i) => (
                <div key={s.l} className={i !== 0 ? "border-l border-zinc-800 pl-4 sm:pl-8" : ""}>
                  <p className="text-white font-bold tabular-nums" style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {s.v}
                  </p>
                  <p className="text-zinc-400 text-sm mt-2">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — business card */}
          <motion.div
            className="flex-shrink-0 w-full lg:w-[540px]"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src={cardImg}
              alt="모두빌스 명함 — 대표이사 박태서"
              className="w-full rounded-lg shadow-2xl shadow-black/40"
            />
          </motion.div>
        </div>
      </div>

      {/* ── Testimonial cards ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase mb-12 flex items-center gap-3">
            <span className="w-6 h-px bg-zinc-300" />
            원장님들의 이야기
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white border border-zinc-100 p-5 sm:p-8 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.12 }}
            >
              {/* Top: type + date */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-zinc-400 border border-zinc-200 px-2.5 py-1">{t.type}</span>
                <span className="text-zinc-300 text-sm">{t.date}</span>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <span key={si} style={{ color: "#F59E0B", fontSize: "1rem" }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 flex-1"
                style={{ lineHeight: 1.9 }}
              >
                "{t.text}"
              </blockquote>

              {/* Footer */}
              <div className="pt-5 border-t border-zinc-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                  <p className="text-sky-600 text-sm font-semibold">{t.highlight}</p>
                </div>
                <p className="text-zinc-900 text-base font-semibold">{t.name}</p>
                <p className="text-zinc-400 text-sm mt-0.5">{t.specialty}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
