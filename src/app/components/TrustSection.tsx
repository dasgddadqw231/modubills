import { useRef } from "react";
import { ShieldCheck, Users, FileText, Award, ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";

const IMG_DOCTOR   = "https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900";
const IMG_INTERIOR = "https://images.unsplash.com/photo-1579488081688-3dbbbae7893e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700";

const pillars = [
  {
    icon: ShieldCheck,
    title: "공식 금융기관 파트너십",
    desc: "KB국민카드·신협·하나캐피탈 등 주요 금융기관과의 공식 파트너십으로 안정적인 자금 조달 구조를 보장합니다.",
  },
  {
    icon: Users,
    title: "1:1 전담 컨설턴트",
    desc: "상담 신청 즉시 배정. 상담→자금집행→사후관리까지 같은 담당자가 끝까지 책임집니다.",
  },
  {
    icon: FileText,
    title: "투명한 계약 조건",
    desc: "숨겨진 수수료 없이 모든 조건을 사전에 명확히 안내. 불리한 조항은 먼저 짚어드립니다.",
  },
  {
    icon: Award,
    title: "10년 의료금융 전문성",
    desc: "병원 재무 구조를 깊이 이해하는 전문 컨설턴트. 단순 중개가 아닌 병원 운영 파트너입니다.",
  },
];

const partners = ["KB국민카드", "신협중앙회", "하나캐피탈", "우리금융캐피탈", "NH농협캐피탈", "BNK캐피탈"];

export function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="overflow-hidden bg-zinc-50" ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left: Full-bleed image stack ─────────────────── */}
        <div className="relative h-[360px] sm:h-[520px] lg:h-auto lg:min-h-[760px] overflow-hidden">
          {/* Background image fills entire left */}
          <img
            src={IMG_DOCTOR}
            alt="모두빌스 전문 컨설턴트"
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-zinc-950/20" />

          {/* Decorative watermark */}
          <div
            className="absolute bottom-0 left-0 right-0 text-white/8 font-black select-none leading-none overflow-hidden"
            style={{ fontSize: "clamp(5rem, 12vw, 10rem)", letterSpacing: "-0.05em" }}
            aria-hidden="true"
          >
            TRUST
          </div>

          {/* Floating stat card */}
          <motion.div
            className="absolute top-4 right-4 sm:top-10 sm:right-10 bg-white p-4 sm:p-5 w-36 sm:w-48"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2 sm:mb-3">분쟁·민원</p>
            <p className="text-zinc-950 font-black mb-1" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", letterSpacing: "-0.04em", lineHeight: 1 }}>
              0건
            </p>
            <p className="text-zinc-400 text-sm">최근 3년 기준</p>
          </motion.div>

          {/* Inset secondary image */}
          <motion.div
            className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-24 sm:w-36 aspect-square overflow-hidden border-2 sm:border-4 border-white shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <img src={IMG_INTERIOR} alt="병원 내부" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </motion.div>
        </div>

        {/* ── Right: Content ───────────────────────────────── */}
        <div className="px-5 sm:px-10 lg:px-16 py-12 sm:py-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-zinc-300" />
              Why Modubills
            </p>
            <h2
              className="text-zinc-950 mb-4"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              단순한 금융사가<br />
              아닌, 병원의<br />
              <span className="text-sky-600">운영 파트너</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12 max-w-md">
              10년 이상 의료금융 분야에서 쌓은 전문성과 450개 이상의 병원
              협력 경험을 바탕으로, 원장님 상황에 가장 현실적인 자금 전략을 제시합니다.
            </p>
          </motion.div>

          {/* Pillars */}
          <div className="space-y-5 sm:space-y-6 mb-10 sm:mb-14">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  className="flex gap-3 sm:gap-5 group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <div className="w-10 h-10 bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-sky-600 transition-colors">
                    <Icon className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-zinc-900 font-semibold text-sm mb-1">{p.title}</h3>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Partner badges */}
          <motion.div
            className="border-t border-zinc-200 pt-8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">공식 협약 금융기관</p>
            <div className="flex flex-wrap gap-2">
              {partners.map((name) => (
                <span key={name} className="text-sm text-zinc-600 bg-white border border-zinc-200 px-3 py-1.5 font-medium hover:border-zinc-400 transition-colors cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}