import { useEffect } from "react";

// ── 상수 — 모듈 로드 시 딱 한 번만 생성 ────────────────────────────────────
const SITE_URL = "https://www.modubills.com"; // 실제 도메인으로 교체
const OG_IMAGE = "https://www.modubills.com/og-image.jpg"; // 실제 OG 이미지로 교체

const DEFAULT_TITLE =
  "모두빌스 | 병원 의료기기 금융 전문 — 신규개원·장비구매·긴급자금";
const DEFAULT_DESCRIPTION =
  "개원 준비부터 확장·리모델링까지. KB국민카드·신협중앙회·하나캐피탈 공식 파트너. 의료기기 렌탈, 중고장비 매입, 긴급자금 D+5일 집행. 누적 지원금액 300억+, 협력병원 450+.";

const KEYWORDS =
  "의료기기 렌탈, 병원 금융, 신규개원 자금, 의료기기 구매, 장비 매입, 병원 리모델링 대출, 긴급자금, KB국민카드 병원, 신협 데일리론, 하나캐피탈 의료, 개원 준비 자금, 모두빌스, 병원 확장이전, 의료기기 금융, MRI 렌탈, CT 렌탈";

// JSON-LD — 모듈 레벨에서 stringify까지 완료
const LD_ORGANIZATION = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "모두빌스",
  alternateName: "modubills",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "병원 의료기기 금융 전문 기업. 신규개원, 장비구매, 장비매입, 리모델링, 확장이전, 긴급자금 솔루션 제공.",
  telephone: "010-9892-1927",
  address: { "@type": "PostalAddress", addressCountry: "KR" },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "010-9892-1927",
    contactType: "customer service",
    availableLanguage: "Korean",
  },
});

const LD_FINANCIAL_SERVICE = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "모두빌스",
  image: OG_IMAGE,
  url: SITE_URL,
  telephone: "010-9892-1927",
  priceRange: "무료 상담",
  description: "병원 의료기기 렌탈·금융 전문 기업. KB국민카드, 신협중앙회, 하나캐피탈 공식 파트너.",
  address: { "@type": "PostalAddress", addressCountry: "KR" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "450",
  },
});

const LD_SERVICE_LIST = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "모두빌스 병원금융 서비스",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "신규개원 구매자금", description: "초기 비용 0원. 장비 렌탈부터 시작해 운영 안정화 후 소유권 이전.", url: `${SITE_URL}/#services` },
    { "@type": "ListItem", position: 2, name: "중고장비 매입", description: "사용 중인 의료장비를 감정 평가 후 즉시 현금화. 당일 협의 가능.", url: `${SITE_URL}/#services` },
    { "@type": "ListItem", position: 3, name: "KB 개인사업자 긴급자금", description: "KB국민카드 공식 파트너. 최단 D+5일 자금 집행.", url: `${SITE_URL}/#services` },
    { "@type": "ListItem", position: 4, name: "신협 데일리론", description: "신협중앙회 연계. 일 단위 상환으로 이자 최소화.", url: `${SITE_URL}/#services` },
  ],
});

const LD_FAQ = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "신규개원 시 의료기기 초기 비용 없이 구매 가능한가요?",
      acceptedAnswer: { "@type": "Answer", text: "네. 모두빌스의 렌탈 프로그램을 통해 초기 비용 0원으로 장비를 도입하고, 운영 안정화 이후 소유권을 이전받는 구조로 진행됩니다." },
    },
    {
      "@type": "Question",
      name: "긴급자금은 얼마나 빠르게 집행되나요?",
      acceptedAnswer: { "@type": "Answer", text: "KB국민카드 공식 파트너십을 통해 최단 D+5일(영업일 기준) 자금 집행이 가능합니다. 서류 준비부터 집행까지 전담 컨설턴트가 동행합니다." },
    },
    {
      "@type": "Question",
      name: "중고 의료기기 매입 기준은 어떻게 되나요?",
      acceptedAnswer: { "@type": "Answer", text: "전문 감정평가를 통해 장비 상태·연식·시장 수요를 종합 평가합니다. 당일 협의 후 신속 입금 가능하며, MRI·CT·초음파 등 대부분의 의료장비를 취급합니다." },
    },
    {
      "@type": "Question",
      name: "어떤 금융 파트너사와 협력하고 있나요?",
      acceptedAnswer: { "@type": "Answer", text: "KB국민카드, 신협중앙회, 하나캐피탈과 공식 파트너십을 맺고 있으며, 각 기관의 조건에 맞는 최적 상품을 비교하여 제안드립니다." },
    },
  ],
});

// ── 헬퍼: meta 태그 upsert ───────────────────────────────────────────────────
function setMeta(selector: string, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    // property 또는 name 속성 추출
    const propMatch = selector.match(/\[property="([^"]+)"\]/);
    const nameMatch = selector.match(/\[name="([^"]+)"\]/);
    if (propMatch) el.setAttribute("property", propMatch[1]);
    else if (nameMatch) el.setAttribute("name", nameMatch[1]);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, attrs: Record<string, string>) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

function setJsonLd(id: string, content: string) {
  let el = document.head.querySelector(`script[data-id="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-id", id);
    document.head.appendChild(el);
  }
  el.textContent = content;
}

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────
interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = SITE_URL,
  ogImage = OG_IMAGE,
  noIndex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // ── Title ────────────────────────────────────────────────────────────
    document.title = title;
    document.documentElement.lang = "ko";

    // ── 기본 Meta ────────────────────────────────────────────────────────
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="keywords"]', KEYWORDS);
    setMeta('meta[name="author"]', "모두빌스");
    setMeta(
      'meta[name="robots"]',
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    );
    setMeta('meta[name="geo.region"]', "KR");
    setMeta('meta[name="geo.placename"]', "대한민국");
    setMeta('meta[name="theme-color"]', "#09090b");
    setMeta('meta[name="color-scheme"]', "dark");

    // ── Canonical ────────────────────────────────────────────────────────
    setLink("canonical", { href: canonical });

    // ── Open Graph ───────────────────────────────────────────────────────
    setMeta('meta[property="og:type"]', "website");
    setMeta('meta[property="og:site_name"]', "모두빌스");
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:image:width"]', "1200");
    setMeta('meta[property="og:image:height"]', "630");
    setMeta('meta[property="og:image:alt"]', "모두빌스 — 병원 의료기기 금융 전문");
    setMeta('meta[property="og:locale"]', "ko_KR");

    // ── Twitter Card ─────────────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);

    // ── Manifest ─────────────────────────────────────────────────────────
    setLink("manifest", { href: "/site.webmanifest" });

    // ── JSON-LD 구조화 데이터 ─────────────────────────────────────────────
    setJsonLd("ld-organization", LD_ORGANIZATION);
    setJsonLd("ld-financial", LD_FINANCIAL_SERVICE);
    setJsonLd("ld-services", LD_SERVICE_LIST);
    setJsonLd("ld-faq", LD_FAQ);
  }, [title, description, canonical, ogImage, noIndex]);

  // 렌더링 결과물 없음 — 순수 side-effect 컴포넌트
  return null;
}
