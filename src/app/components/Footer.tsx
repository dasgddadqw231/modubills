import { Phone } from "lucide-react";
import logoImg from "@/assets/2066e5bc2e29e193960f863a8c936b577328ad8c.png";

const links = [
  { label: "서비스", href: "#services" },
  { label: "도입 사례", href: "#cases" },
  { label: "상품 비교", href: "#comparison" },
  { label: "고객 후기", href: "#testimonials" },
  { label: "무료 상담", href: "#consult" },
];

const nonFinancialServices = [
  "구매자금",
  "신규렌탈",
  "임차보증금 담보상품",
  "카드매출 담보상품",
  "KT 병원 솔루션 구축사업",
  "신탁 자금",
  "렌탈백 (Rental-back)",
  "중고장비 매입",
  "KB 국민카드",
];

const financialServices = [
  "신협 데일리론",
  "수협 행복대출",
];

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-500">
      {/* Top strip */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <p className="text-zinc-500 text-sm mb-2">지금 시작하세요</p>
            <p
              className="text-white"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              무료 상담 · 당일 답변 · 전국 서비스
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <img
              src={logoImg}
              alt="모두빌스"
              className="h-8 w-auto mb-5 bg-white px-3 py-1.5 rounded"
            />
            <p className="text-zinc-500 text-base leading-relaxed mb-6 max-w-xs">
              의료장비렌탈 &amp; 병원금융 전문.<br />
              복잡한 절차 없이, 필요할 때 정확한 자금지원.
            </p>
            <div className="space-y-2.5 mb-6">
              <a
                href="tel:010-9892-1927"
                className="flex items-center gap-2 text-zinc-400 hover:text-white text-base transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                010-9892-1927
              </a>
              <a
                href="mailto:modubills1102@naver.com"
                className="flex items-center gap-2 text-zinc-400 hover:text-white text-base transition-colors"
              >
                <span className="w-3.5 h-3.5 flex items-center justify-center text-xs border border-zinc-600 rounded-sm shrink-0">@</span>
                modubills1102@naver.com
              </a>
            </div>
            <p className="text-zinc-600 text-sm">평일 09:00 – 18:00 (주말·공휴일 휴무)</p>
          </div>

          {/* Nav */}
          <div className="col-span-1 md:col-span-3">
            <p className="text-zinc-400 text-sm font-medium mb-4 tracking-wider uppercase">메뉴</p>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      const id = l.href.replace("#", "");
                      const el = document.getElementById(id);
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-zinc-500 hover:text-zinc-200 text-base transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 비금융 서비스 — 모바일에서 숨김 처리(정보 과다 방지) */}
          <div className="hidden md:block md:col-span-3">
            <p className="text-zinc-400 text-sm font-medium mb-4 tracking-wider uppercase">비금융 상품</p>
            <ul className="space-y-3">
              {nonFinancialServices.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-zinc-500 hover:text-zinc-200 text-base transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 금융 서비스 — 모바일에서 숨김 처리(정보 과다 방지) */}
          <div className="hidden md:block md:col-span-2">
            <p className="text-zinc-400 text-sm font-medium mb-4 tracking-wider uppercase">제휴 금융</p>
            <ul className="space-y-3">
              {financialServices.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-zinc-500 hover:text-zinc-200 text-base transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 사업자 정보 - 신뢰의 핵심 */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-600 mb-2">
            <span>상호: 모두빌스</span>
            <span>대표: 박정미</span>
            <span>사업자등록번호: 296-39-01309</span>
            <span>개업연월일: 2025년 11월 08일</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-600">
            <span>주소: 경기도 수원시 영통구 광교중앙로 145, 17층 에이1702호 (아의동, 광교엘포트아이파크)</span>
            <span>대표번호: 010-9892-1927</span>
            <span>이메일: modubills1102@naver.com</span>
          </div>
          <p className="text-xs text-zinc-700 mt-3 leading-relaxed max-w-2xl">
            모두빌스는 「여신전문금융업법」에 의거하여 금융기관과의 공식 파트너십을 통해 자금 중개 서비스를 제공합니다.
            <br />
            제공되는 금융상품은 고객의 신용상태 및 자격 요건에 따라 조건이 달라질 수 있습니다.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-sm">
            © 2025 Modubills. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <a
              href="https://www.instagram.com/modubills_official"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/18JdB8do7g/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://blog.naver.com/modubills1102"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              네이버 블로그
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}