import { useState, forwardRef } from "react";
import { Loader2, Check, Phone, Clock, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "./ui/utils";

const serviceGroups = [
  {
    label: "비금융 상품",
    options: [
      "구매자금",
      "신규렌탈",
      "KT 병원 솔루션 구축사업",
      "렌탈백 (Rental-back)",
      "중고장비 매입",
      "신탁 자금",
      "개인사업자 특별한도 (KB·하나·신한)",
      "신협 데일리론",
      "수협 행복대출",
    ],
  },
  {
    label: "금융 상품",
    options: [
      "임차보증금 담보상품",
      "카드매출 담보상품",
    ],
  },
  {
    label: "정책자금",
    options: [
      "신용보증 재단",
      "신용보증 기금",
      "기술보증 재단",
      "기술보증기금",
      "중소기업 벤처부",
      "지자체 및 지역 신보",
    ],
  },
];

const etcOption = "어떤 상품이 맞는지 모르겠음";

const amountOptions = ["5천만원 이하", "5천만원~1억", "1억~2억", "2억~3억", "3억 이상"];

interface FormData {
  name: string;
  hospital: string;
  phone: string;
  services: string[];
  amount: string;
  message: string;
  agree: boolean;
}

const empty: FormData = {
  name: "", hospital: "", phone: "", services: [], amount: "", message: "", agree: false,
};

export const ConsultationForm = forwardRef<HTMLElement>((_, ref) => {
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof FormData, v: string | boolean | string[]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const toggleService = (s: string) => {
    const next = form.services.includes(s)
      ? form.services.filter((x) => x !== s)
      : [...form.services, s];
    set("services", next);
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim())        e.name     = "필수 항목입니다";
    if (!form.phone.trim())       e.phone    = "필수 항목입니다";
    if (!form.hospital.trim())    e.hospital = "필수 항목입니다";
    if (form.services.length === 0) e.services = "최소 1개 선택해주세요";
    if (!form.agree)              e.agree    = "동의가 필요합니다";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const BASE_URL =
        "https://script.google.com/macros/s/AKfycbyWEY1-SEpEvEIYpHuJMuDV8azc_nELFA0Z4P8SXRn2ZNn_9U2GSM1jP2gWJxMu8gnH/exec";

      const params = new URLSearchParams({
        name: form.name,
        phone: form.phone,
        hospital: form.hospital,
        amount: form.amount || "미입력",
        services: form.services.join(", "),
        message: form.message || "",
      });

      await fetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      setDone(true);

      // GA4 전환 이벤트
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          event_category: "consultation",
          event_label: form.services.join(", "),
          value: 1,
        });
      }
    } catch {
      alert("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consult" ref={ref} className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-5">

        {/* ── Left dark panel ──────────────────────────────── */}
        <div className="lg:col-span-2 bg-zinc-950 px-5 sm:px-10 lg:px-14 py-12 sm:py-20 flex flex-col justify-between">
          <div>
            <p className="text-zinc-500 text-xs tracking-[0.25em] uppercase mb-8 flex items-center gap-3">
              <span className="w-6 h-px bg-zinc-700" />
              Free Consultation
            </p>
            <h2
              className="text-white mb-6"
              style={{
                fontSize: "clamp(2rem, 3vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              무료 상담<br />신청
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12">
              간단한 정보 입력으로 맞춤 자금 솔루션을 안내받으세요.
              <br />
              영업일 기준
              <br />
              <span className="text-white font-semibold">24시간 내</span> 전담 컨설턴트가 직접 연락드립니다.
            </p>

            {/* Guarantees */}
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-14">
              {[
                { icon: Clock,       text: "영업일 24시간 내 응답 보장" },
                { icon: ShieldCheck, text: "상담료 전액 무료 · 숨겨진 비용 없음" },
                { icon: Check,       text: "원하시면 언제든 취소 가능" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="w-8 h-8 border border-zinc-800 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-sky-500" />
                  </span>
                  <span className="text-zinc-400 text-base">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact links */}
          <div className="space-y-5 sm:space-y-6 border-t border-zinc-800 pt-6 sm:pt-10">
            {[
              { label: "전화 문의", value: "010-9892-1927", href: "tel:010-9892-1927", sub: "평일 09:00 – 18:00", icon: Phone },
              { label: "이메일", value: "modubills1102@naver.com", href: "mailto:modubills1102@naver.com", sub: "", icon: null },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label}>
                  <p className="text-zinc-600 text-xs mb-1.5 uppercase tracking-widest">{c.label}</p>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-zinc-200 font-medium text-base hover:text-sky-400 transition-colors flex items-center gap-1.5"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {c.value}
                  </a>
                  {c.sub && <p className="text-zinc-600 text-sm mt-0.5">{c.sub}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right form panel ─────────────────────────────── */}
        <div className="lg:col-span-3 px-5 sm:px-10 lg:px-16 py-12 sm:py-20">
          {done ? (
            <motion.div
              className="flex flex-col items-start h-full justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 bg-sky-600 flex items-center justify-center mb-8">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3
                className="text-zinc-900 mb-4"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}
              >
                상담 신청<br />완료됐습니다
              </h3>
              <p className="text-zinc-500 text-base leading-relaxed mb-2">
                <span className="text-zinc-900 font-semibold">{form.name}</span> 원장님, 신청이 접수되었습니다.
              </p>
              <p className="text-zinc-500 text-base mb-10">
                담당 컨설턴트가 <span className="text-zinc-900 font-semibold">영업일 24시간 내</span> 연락드리겠습니다.
              </p>
              <div className="w-full space-y-3 border-t border-zinc-100 pt-8 mb-10">
                {[
                  { l: "병원명",      v: form.hospital },
                  { l: "연락처",      v: form.phone },
                  { l: "관심 서비스", v: form.services.join(", ") },
                  { l: "필요 자금",   v: form.amount || "미입력" },
                ].map((r) => (
                  <div key={r.l} className="flex gap-6 text-base">
                    <span className="text-zinc-400 w-24 shrink-0">{r.l}</span>
                    <span className="text-zinc-700">{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setDone(false); setForm(empty); }}
                  className="text-base text-zinc-500 border border-zinc-200 px-6 py-3 hover:border-zinc-400 transition-colors"
                >
                  추가 신청
                </button>
                <a
                  href="tel:010-9892-1927"
                  className="text-base bg-zinc-950 text-white px-6 py-3 hover:bg-zinc-700 transition-colors"
                >
                  직접 전화하기
                </a>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit}>
              <h3
                className="text-zinc-900 mb-10"
                style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                기본 정보를 입력해주세요
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">
                    성함 <span className="text-zinc-900">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="원장님 성함"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={cn(
                      "w-full border px-4 py-3.5 text-base outline-none transition-colors bg-white text-zinc-900 placeholder-zinc-300",
                      errors.name ? "border-red-300" : "border-zinc-200 focus:border-zinc-900"
                    )}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1.5">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">
                    연락처 <span className="text-zinc-900">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={cn(
                      "w-full border px-4 py-3.5 text-base outline-none transition-colors bg-white text-zinc-900 placeholder-zinc-300",
                      errors.phone ? "border-red-300" : "border-zinc-200 focus:border-zinc-900"
                    )}
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1.5">{errors.phone}</p>}
                </div>

                {/* Hospital */}
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">
                    병원명 <span className="text-zinc-900">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="병원 이름"
                    value={form.hospital}
                    onChange={(e) => set("hospital", e.target.value)}
                    className={cn(
                      "w-full border px-4 py-3.5 text-base outline-none transition-colors bg-white text-zinc-900 placeholder-zinc-300",
                      errors.hospital ? "border-red-300" : "border-zinc-200 focus:border-zinc-900"
                    )}
                  />
                  {errors.hospital && <p className="text-red-400 text-sm mt-1.5">{errors.hospital}</p>}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">필요 자금 규모</label>
                  <select
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className="w-full border border-zinc-200 focus:border-zinc-900 px-4 py-3.5 text-base outline-none transition-colors bg-white text-zinc-900"
                  >
                    <option value="">선택해주세요</option>
                    {amountOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              {/* Service chips */}
              <div className="mb-5">
                <label className="block text-sm text-zinc-500 mb-4">
                  관심 서비스 <span className="text-zinc-900">*</span>
                  <span className="text-zinc-400 font-normal ml-1">(중복 선택 가능)</span>
                </label>
                <div className="space-y-4">
                  {serviceGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleService(s)}
                            className={cn(
                              "text-sm px-3.5 sm:px-4 py-2.5 border transition-colors active:scale-95",
                              form.services.includes(s)
                                ? "border-zinc-950 bg-zinc-950 text-white"
                                : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleService(etcOption)}
                      className={cn(
                        "text-sm px-4 py-2.5 border transition-colors",
                        form.services.includes(etcOption)
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                      )}
                    >
                      {etcOption}
                    </button>
                  </div>
                </div>
                {errors.services && <p className="text-red-400 text-sm mt-2">{errors.services}</p>}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-500 mb-2">
                  문의 내용 <span className="text-zinc-400 font-normal">(선택)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="병원 상황이나 궁금한 사항을 자유롭게 작성해주세요."
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="w-full border border-zinc-200 focus:border-zinc-900 px-4 py-3.5 text-base outline-none transition-colors bg-white text-zinc-900 placeholder-zinc-300 resize-none"
                />
              </div>

              {/* Privacy */}
              <div className="mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => set("agree", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-zinc-900"
                  />
                  <div>
                    <span className="text-zinc-700 text-base">개인정보 수집 및 이용에 동의합니다.</span>
                    <p className="text-zinc-400 text-sm mt-0.5 leading-relaxed">
                      수집 항목: 성명·연락처·병원정보 | 목적: 상담 서비스 제공 | 보유: 상담 완료 후 1년
                    </p>
                  </div>
                </label>
                {errors.agree && <p className="text-red-400 text-sm mt-1.5 pl-7">{errors.agree}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-950 text-white py-4.5 text-base font-bold hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "무료 상담 신청하기"
                )}
              </button>

              <p className="text-center text-zinc-400 text-xs sm:text-sm mt-4">
                상담은 완전 무료입니다. 원하시지 않으면 언제든 취소하실 수 있습니다.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});

ConsultationForm.displayName = "ConsultationForm";