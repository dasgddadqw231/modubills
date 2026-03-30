import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: 1200, suffix: "+", label: "누적 상담 건수", desc: "전국 병원 대상" },
  { value: 300,  suffix: "억+", label: "누적 지원 금액", desc: "실제 집행된 총액" },
  { value: 450,  suffix: "+", label: "협력 병원 수",   desc: "전국 파트너 병원" },
  { value: 98,   suffix: "%",  label: "고객 만족도",    desc: "재상담·추천률 기준" },
];

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t: number | null = null;
    const step = (ts: number) => {
      if (!t) t = ts;
      const p = Math.min((ts - t) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ s, animate, i }: { s: typeof stats[0]; animate: boolean; i: number }) {
  const n = useCountUp(s.value, 1600 + i * 60, animate);
  return (
    <motion.div
      className="relative flex flex-col justify-between py-7 px-5 sm:py-12 sm:px-10 border-zinc-800"
      initial={{ opacity: 0, y: 30 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.12 }}
    >
      {/* Decorative index */}
      <span className="text-zinc-600 text-sm sm:text-base font-mono mb-3 sm:mb-6">
        {String(i + 1).padStart(2, "0")}
      </span>

      {/* Number */}
      <p
        className="tabular-nums text-white mb-2 sm:mb-3"
        style={{
          fontSize: "clamp(2rem, 5.5vw, 5rem)",
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        {n.toLocaleString()}
        <span className="text-sky-500">{s.suffix}</span>
      </p>

      {/* Labels */}
      <div>
        <p className="text-white text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">{s.label}</p>
        <p className="text-zinc-400 text-xs sm:text-base">{s.desc}</p>
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimate(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-zinc-950 border-b border-zinc-800" ref={ref}>
      {/* Top label bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        <div className="flex items-center gap-4 sm:gap-6 py-4 sm:py-5 border-b border-zinc-800">
          <span className="text-zinc-500 text-sm sm:text-base tracking-[0.2em] uppercase">핵심 지표</span>
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-500 text-sm sm:text-base">2014 – 2025</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 [&>*:nth-child(odd)]:border-r [&>*:nth-child(n+3)]:border-t lg:[&>*:nth-child(odd)]:border-r-0 lg:[&>*:nth-child(n+3)]:border-t-0 lg:[&>*:not(:last-child)]:border-r border-zinc-800">
          {stats.map((s, i) => (
            <StatItem key={s.label} s={s} animate={animate} i={i} />
          ))}
        </div>
      </div>

      {/* Bottom marquee strip */}
      <div className="border-t border-zinc-800 py-3 sm:py-4 overflow-hidden">
        <div className="flex gap-6 sm:gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].flatMap(() => [
            "KB국민카드", "신협중앙회", "하나캐피탈", "우리금융캐피탈",
            "NH농협캐피탈", "BNK캐피탈", "10년 전문 의료금융", "전국 서비스",
          ]).map((text, i) => (
            <span key={i} className="text-zinc-500 text-sm sm:text-base shrink-0">
              {text} <span className="text-zinc-600 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
