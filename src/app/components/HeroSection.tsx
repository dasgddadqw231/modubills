import { useEffect, useRef, useState, useCallback } from "react";
import { Phone, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";

const HERO_IMG = "https://images.unsplash.com/photo-1674471361370-fb3363674a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920";

interface HeroSectionProps {
  onConsultClick: () => void;
}

const CYCLING_WORDS = ["신규개원", "장비구매", "장비렌탈", "리모델링", "확장이전", "긴급자금", "보증금활용", "매출담보"];

const stats = [
  { value: 1200, suffix: "+", label: "누적 상담" },
  { value: 300,  suffix: "억+", label: "지원 금액" },
  { value: 450,  suffix: "+", label: "협력 병원" },
  { value: 98,   suffix: "%", label: "재상담률" },
];

const services = [
  { id: "purchase",  tag: "01", title: "구매자금",             desc: "무담보 최대 3억. 의료기기·전자제품·가구 등 신규 구매 전용. 100% 비용처리 가능." },
  { id: "rental",    tag: "02", title: "신규렌탈",             desc: "36개월 분할 이용으로 비용처리 최적화. 2~3억 한도로 초기 자금 부담을 최소화." },
  { id: "deposit",   tag: "03", title: "임차보증금 담보상품",  desc: "보증금 최대 100% 유동화. 임대인 권리보호 보장, 빠른 승인으로 운영자금 즉시 확보." },
  { id: "sales",     tag: "04", title: "카드매출 담보상품",    desc: "개원 1년 이상 병원 대상. 월 카드매출 최대 200%, 신용등급 하락 없이 지원." },
  { id: "kt",        tag: "05", title: "KT 병원 솔루션",      desc: "1억~100억 대규모 지원. SGI 증권발급 방식, 병원 외 다양한 사업장도 가능." },
  { id: "trust",     tag: "06", title: "신탁 자금",           desc: "최대 10억, 월 4% 금리. 카드매출 30~50% 집행 조건, 3~5개월 단기 운용." },
  { id: "rentalback",tag: "07", title: "렌탈백",              desc: "보유 장비 매각 후 재렌탈. 3년 이내 장비가치 80% 즉시 현금화, DSR 미포함." },
  { id: "used",      tag: "08", title: "중고장비 매입",        desc: "7년 이내 의료장비 구입가 최대 80% 매입. 당일 상담·당일 견적, 즉시 현금화." },
  { id: "kb",        tag: "09", title: "개인사업자 특별한도",    desc: "KB·하나·신한 제휴. 개인사업자 전용 최대 2억, 60개월. 결제 후 D+5일 집행." },
  { id: "daily",     tag: "10", title: "신협 데일리론",       desc: "6개월 이상 사업자 대상. 금리 5.3~6%, 최대 1.5억. 중도상환수수료 없음." },
  { id: "happy",     tag: "11", title: "수협 행복대출",       desc: "카드매출 40~70% 기준 최대 2.5억. 최저 금리 5.5%~, 최장 10년 매일상환." },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const controls = animate(0, target, {
            duration: 1.8,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

export function HeroSection({ onConsultClick }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null); // ← RAF throttle용

  // Parallax mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const imgX = useTransform(springX, [-1, 1], [-18, 18]);
  const imgY = useTransform(springY, [-1, 1], [-10, 10]);

  // RAF 기반 throttle — 프레임당 1회만 motion value 업데이트
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafId.current !== null) return;
    const { clientX, clientY } = e;
    rafId.current = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(((clientX - rect.left) / rect.width) * 2 - 1);
        mouseY.set(((clientY - rect.top) / rect.height) * 2 - 1);
      }
      rafId.current = null;
    });
  }, [mouseX, mouseY]);

  // Tab scroll state check
  const updateScrollState = useCallback(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollTabs = useCallback((dir: "left" | "right") => {
    const el = tabScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  }, []);

  // Scroll active tab into view
  useEffect(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    const btn = el.children[activeTab] as HTMLElement | undefined;
    if (btn) {
      const left = btn.offsetLeft - el.offsetLeft;
      const right = left + btn.offsetWidth;
      if (left < el.scrollLeft) {
        el.scrollTo({ left: left - 16, behavior: "smooth" });
      } else if (right > el.scrollLeft + el.clientWidth) {
        el.scrollTo({ left: right - el.clientWidth + 16, behavior: "smooth" });
      }
    }
    updateScrollState();
  }, [activeTab, updateScrollState]);

  // Word cycling
  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate tabs
  useEffect(() => {
    const t = setInterval(() => {
      setActiveTab((i) => (i + 1) % services.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-zinc-950 flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* ── Background image with parallax ─────── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ x: imgX, y: imgY, scale: 1.06 }}
      >
        <img
          src={HERO_IMG}
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ── 딤드 오버레이 — 패럴랙스 밖, 네비바(4.5rem) 아래부터만 적용 ── */}
      <div className="absolute inset-0 z-[1] bg-zinc-950/50" />
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(ellipse at 60% 50%, transparent 20%, rgba(9,9,11,0.40) 100%)" }}
      />

      {/* ── Vertical rule left ───────────────── */}
      <motion.div
        className="absolute left-4 sm:left-8 lg:left-16 top-0 bottom-0 w-px bg-white/12 z-10"
        initial={{ scaleY: 0, originY: 0 }}
        animate={loaded ? { scaleY: 1 } : {}}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Main content ─────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full pl-4 pr-4 sm:pl-14 sm:pr-8 lg:pl-24 lg:pr-16 pt-16 sm:pt-24 pb-0">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={loaded ? "show" : "hidden"}
          className="flex-1"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4 sm:mb-10">
            <span className="block w-6 h-px bg-sky-500" />
            <p className="text-sky-400 text-xs tracking-[0.3em] uppercase">
              의료장비렌탈 &amp; 병원금융 전문
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-white mb-3"
            style={{
              fontSize: "clamp(2.2rem, 7vw, 6.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
            }}
          >
            병원
            {/* Cycling word */}
            <span className="inline-block mx-1.5 sm:mx-3 relative">
              <motion.span
                key={wordIndex}
                className="text-sky-400 inline-block"
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={wordVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {CYCLING_WORDS[wordIndex]}
              </motion.span>
            </span>
            ,<br />
            지금 바로.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-zinc-300 max-w-lg mb-6 sm:mb-10 text-[0.85rem] sm:text-[1.15rem]"
            style={{ lineHeight: 1.85 }}
          >
            개원 준비부터 확장·리모델링까지. 모두빌스 전담 컨설턴트가 병원 상황에 맞는 최적의 자금 솔루션을
            <br />
            제시합니다.
          </motion.p>

          {/* SNS icons */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <a
              href="https://www.instagram.com/modubills_official"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center border border-white/20 text-zinc-400 hover:text-white hover:border-white/50 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a
              href="https://www.facebook.com/share/18JdB8do7g/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center border border-white/20 text-zinc-400 hover:text-white hover:border-white/50 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href="https://blog.naver.com/modubills1102"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center border border-white/20 text-zinc-400 hover:text-white hover:border-white/50 transition-colors"
              aria-label="네이버 블로그"
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/></svg>
            </a>
          </motion.div>

          {/* CTAs — 모바일에서는 하단 고정바가 있으므로 CTA 숨김 */}
          <motion.div variants={fadeUp} className="hidden sm:flex flex-wrap gap-3 mb-16">
            <motion.button
              onClick={onConsultClick}
              className="group relative overflow-hidden bg-sky-600 text-white text-base font-semibold px-8 py-4 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="relative z-10">무료 상담 신청</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-sky-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.a
              href="tel:010-9892-1927"
              className="flex items-center gap-2 border border-white/30 text-zinc-200 text-base px-6 py-4 hover:border-white/50 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Phone className="w-3.5 h-3.5" />
              010-9892-1927
            </motion.a>
          </motion.div>

        </motion.div>

        {/* ── Interactive service tabs ────────── */}
        <motion.div
          className="mt-8 sm:mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {/* Tab nav */}
          <div className="relative border-t border-white/10">
            {/* Left scroll arrow */}
            {canScrollLeft && (
              <button
                onClick={() => scrollTabs("left")}
                className="absolute left-0 top-0 bottom-0 z-20 w-10 flex items-center justify-center bg-gradient-to-r from-zinc-950 to-transparent"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            {/* Right scroll arrow */}
            {canScrollRight && (
              <button
                onClick={() => scrollTabs("right")}
                className="absolute right-0 top-0 bottom-0 z-20 w-10 flex items-center justify-center bg-gradient-to-l from-zinc-950 to-transparent"
              >
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            <div
              ref={tabScrollRef}
              onScroll={updateScrollState}
              className="flex overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {services.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(i)}
                  className="relative flex-shrink-0 min-w-[72px] sm:min-w-[140px] text-left px-3 sm:px-6 py-3 sm:py-5 transition-colors group"
                >
                  {/* Active indicator line */}
                  {activeTab === i && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute top-0 left-0 right-0 h-[2px] bg-sky-500"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <p className={`text-xs mb-1.5 transition-colors ${activeTab === i ? "text-sky-400" : "text-zinc-500"}`}>
                    {s.tag}
                  </p>
                  <p className={`text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${activeTab === i ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                    {s.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="overflow-hidden border-t border-white/10">
            {services.map((s, i) =>
              activeTab === i ? (
                <motion.div
                  key={s.id}
                  className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">{s.desc}</p>
                  <button
                    onClick={onConsultClick}
                    className="flex items-center gap-1.5 text-sky-400 text-sm font-medium shrink-0 hover:text-sky-300 transition-colors self-end sm:self-auto"
                  >
                    상세보기 <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ) : null
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Stats bar ───────────────────────────── */}
      <motion.div
        className="relative z-10 border-t border-white/10 bg-zinc-950/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={`py-4 sm:py-7 ${i !== 0 ? "sm:border-l sm:pl-8" : ""} ${i >= 2 ? "border-t sm:border-t-0" : ""} ${i % 2 !== 0 ? "border-l pl-4 sm:pl-8" : ""} border-white/12 group cursor-default`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <p
                  className="text-white tabular-nums group-hover:text-sky-400 transition-colors"
                  style={{ fontSize: "clamp(1.25rem, 2.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  <CountUp target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator — 모바일에서는 하단바와 겹치므로 숨김 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-zinc-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}