import { useRef } from "react";
import { Check, Minus, X } from "lucide-react";
import { motion, useInView } from "motion/react";
import { cn } from "./ui/utils";

type Score = "good" | "bad" | "mid";

interface Row {
  feature: string;
  rental: string;
  loan: string;
  lease: string;
  scores: [Score, Score, Score];
}

const rows: Row[] = [
  { feature: "초기 자금 부담",    rental: "없음",       loan: "있음",           lease: "일부 있음",     scores: ["good", "bad",  "mid"] },
  { feature: "담보 여부",         rental: "무담보 가능", loan: "담보·신용 필요",  lease: "일부 담보 필요", scores: ["good", "bad",  "mid"] },
  { feature: "부가세 환급",       rental: "100%",      loan: "가능",           lease: "부분",          scores: ["good", "good", "mid"] },
  { feature: "비용처리",          rental: "100%",      loan: "감가상각",        lease: "부분 가능",     scores: ["good", "mid",  "mid"] },
  { feature: "신용등급 영향",     rental: "영향 최소",  loan: "부채 증가",       lease: "일부 영향",     scores: ["good", "bad",  "mid"] },
  { feature: "승인 속도",         rental: "당일~",     loan: "수일~수주",       lease: "수일",          scores: ["good", "bad",  "mid"] },
  { feature: "장비 교체 유연성",  rental: "높음",       loan: "낮음",           lease: "보통",          scores: ["good", "bad",  "mid"] },
];

function ScoreIcon({ score }: { score: Score }) {
  if (score === "good") return <Check className="w-4 h-4 text-sky-500" />;
  if (score === "bad")  return <X     className="w-4 h-4 text-zinc-300" />;
  return                       <Minus className="w-4 h-4 text-zinc-300" />;
}

export function ComparisonSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section id="comparison" className="py-16 sm:py-28 bg-zinc-950" ref={ref}>
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
              Comparison
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
              렌탈 vs 대출<br />vs 리스
            </h2>
          </motion.div>
          <motion.p
            className="text-zinc-400 text-base max-w-sm leading-relaxed lg:text-right"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            같은 장비, 어떻게 조달하느냐에 따라<br />병원 재무 구조가 달라집니다.
          </motion.p>
        </div>

        {/* Table — desktop */}
        <motion.div
          className="hidden sm:block overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left text-zinc-600 text-sm font-normal pb-6 w-[36%] border-b border-zinc-800" />
                <th className="pb-6 border-b-2 border-sky-500 w-[21%]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="bg-sky-600 text-white text-xs font-bold px-3 py-1 tracking-wider uppercase">추천</span>
                    <span className="text-white font-bold text-lg">렌탈</span>
                  </div>
                </th>
                <th className="pb-6 border-b border-zinc-800 text-zinc-500 font-normal w-[21%]">대출</th>
                <th className="pb-6 border-b border-zinc-800 text-zinc-500 font-normal w-[22%]">리스</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="py-5 text-zinc-300 text-base">{row.feature}</td>
                  <td className="py-5 text-center bg-sky-950/30">
                    <div className="flex flex-col items-center gap-2">
                      <ScoreIcon score={row.scores[0]} />
                      <span className="text-sky-300 font-semibold text-sm">{row.rental}</span>
                    </div>
                  </td>
                  <td className="py-5 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ScoreIcon score={row.scores[1]} />
                      <span className="text-zinc-400 text-sm">{row.loan}</span>
                    </div>
                  </td>
                  <td className="py-5 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ScoreIcon score={row.scores[2]} />
                      <span className="text-zinc-400 text-sm">{row.lease}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile card-style comparison */}
        <motion.div
          className="sm:hidden space-y-3"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {rows.map((row) => (
            <div key={row.feature} className="border border-zinc-800 p-4">
              <p className="text-zinc-300 text-sm font-semibold mb-3">{row.feature}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-sky-950/30 rounded p-2.5 text-center border border-sky-800/30">
                  <ScoreIcon score={row.scores[0]} />
                  <p className="text-sky-300 font-semibold text-xs mt-1.5">{row.rental}</p>
                  <p className="text-sky-500 text-[10px] mt-0.5">렌탈</p>
                </div>
                <div className="bg-zinc-900/50 rounded p-2.5 text-center">
                  <ScoreIcon score={row.scores[1]} />
                  <p className="text-zinc-400 text-xs mt-1.5">{row.loan}</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">대출</p>
                </div>
                <div className="bg-zinc-900/50 rounded p-2.5 text-center">
                  <ScoreIcon score={row.scores[2]} />
                  <p className="text-zinc-400 text-xs mt-1.5">{row.lease}</p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">리스</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom benefits */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-0 border border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { num: "0원",  title: "초기비용", desc: "일시불 대비 수억의 현금을 운영에 활용" },
            { num: "100%", title: "세금 절감", desc: "부가세 환급 + 전액 비용처리로 실질 부담 최소화" },
            { num: "자유", title: "장비 교체", desc: "기술 발전에 맞춰 계약 만료 후 최신 장비로 교체" },
          ].map((b, i) => (
            <div
              key={b.title}
              className={cn("p-6 sm:p-8 lg:p-10", i !== 0 ? "border-t sm:border-t-0 sm:border-l border-zinc-800" : "")}
            >
              <p
                className="text-white font-black mb-2"
                style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", letterSpacing: "-0.04em", lineHeight: 1 }}
              >
                {b.num}
              </p>
              <p className="text-zinc-300 font-semibold text-base mb-2">{b.title}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
