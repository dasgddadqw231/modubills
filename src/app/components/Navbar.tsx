import { useState, useEffect } from "react";
import { cn } from "./ui/utils";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "@/assets/2066e5bc2e29e193960f863a8c936b577328ad8c.png";

interface NavbarProps {
  onConsultClick: () => void;
}

const navLinks = [
  { label: "서비스", href: "#services" },
  { label: "도입 사례", href: "#cases" },
  { label: "상품 비교", href: "#comparison" },
  { label: "고객 후기", href: "#testimonials" },
];

export function Navbar({ onConsultClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-400 bg-white",
          scrolled
            ? "border-b border-zinc-100 shadow-sm"
            : ""
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-[3.5rem] sm:h-[4.5rem] flex items-center justify-between gap-4 sm:gap-8">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="shrink-0"
          >
            <img src={logoImg} alt="모두빌스" className="h-8 sm:h-11 w-auto" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-zinc-500 hover:text-zinc-900 text-base transition-colors tracking-tight"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:010-9892-1927"
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 text-base transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              010-9892-1927
            </a>
            <button
              onClick={onConsultClick}
              className="text-base px-6 py-2.5 bg-zinc-950 text-white font-semibold hover:bg-zinc-700 transition-colors"
            >
              무료 상담
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center border border-zinc-200 hover:border-zinc-400 transition-colors active:bg-zinc-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            {menuOpen ? <X className="w-4 h-4 text-zinc-700" /> : <Menu className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[110] bg-white flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header row */}
            <div className="h-[3.5rem] sm:h-[4.5rem] flex items-center justify-between px-5 sm:px-8 border-b border-zinc-100">
              <img src={logoImg} alt="모두빌스" className="h-7 w-auto" />
              <button
                className="w-9 h-9 flex items-center justify-center border border-zinc-200"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-4 h-4 text-zinc-700" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-5 sm:px-8 pt-8 sm:pt-10 space-y-1">
              {navLinks.map((l, i) => (
                <motion.button
                  key={l.href}
                  onClick={() => { scrollTo(l.href); setMenuOpen(false); }}
                  className="block w-full text-left py-4 border-b border-zinc-50 text-zinc-800 font-semibold"
                  style={{ fontSize: "clamp(1.1rem, 4vw, 1.4rem)", letterSpacing: "-0.025em" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07 }}
                >
                  {l.label}
                </motion.button>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="px-5 sm:px-8 pb-8 sm:pb-10 space-y-3 border-t border-zinc-100 pt-6 sm:pt-8">
              <a
                href="tel:010-9892-1927"
                className="flex items-center gap-2 text-zinc-600 text-base"
              >
                <Phone className="w-3.5 h-3.5" /> 010-9892-1927
              </a>
              <button
                onClick={() => { onConsultClick(); setMenuOpen(false); }}
                className="w-full bg-zinc-950 text-white text-base font-bold py-3.5"
              >
                무료 상담 신청
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}