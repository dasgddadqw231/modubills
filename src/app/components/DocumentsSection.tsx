import { motion } from "motion/react";
import { FileText, User, CheckCircle2, AlertCircle } from "lucide-react";

const businessDocs = [
  { no: 1, name: "사업자등록증명", note: "최근 1개월 내", source: "홈택스/민원24" },
  { no: 2, name: "사업자 명의 통장사본", note: "렌탈료 납부용", source: "해당 은행" },
  { no: 3, name: "이메일 주소", note: "전자세금계산서 수신용", source: "자체" },
  { no: 4, name: "사업장 임대차계약서 사본", note: null, source: "자체" },
  { no: 5, name: "표준재무제표증명", note: "최근 3년분 ※신규X", source: "홈택스" },
  { no: 9, name: "카드매출자료", note: "23, 24, 25년", source: "홈택스" },
  { no: 10, name: "부가세/면세사업자 수입금액증명원", note: "최근 4개년", source: "홈택스" },
  { no: 18, name: "월별 수입 통계", note: "23, 24, 25년", source: "자체/전산" },
];

const personalDocs = [
  { no: 21, name: "휴대폰번호 + 통신사", note: "NICE 점수 확인용", source: "자체" },
  { no: 22, name: "대표자 신분증 사본 / 개인 이메일", note: null, source: "자체" },
  { no: 23, name: "주민등록 등본 및 초본", note: "최근 1개월 내", source: "정부24" },
  { no: 24, name: "소득금액증명", note: "22, 23, 24년", source: "홈택스" },
  { no: 25, name: "지방세 납세증명서", note: null, source: "정부24" },
  { no: 26, name: "지방세 세목별 과세증명서", note: "23, 24, 25년", source: "정부24" },
  { no: 27, name: "국세 완납증명서", note: null, source: "정부24" },
  { no: 28, name: "금융거래확인서", note: "오늘 기준", source: "대출있는 은행" },
  { no: 30, name: "의사면허증 또는 전문의자격증 / 약력", note: null, source: "사본" },
  { no: 31, name: "의료기관 개설허가증", note: "이력사항 포함", source: "사본" },
  { no: 32, name: "건강보험 자격득실확인서", note: null, source: "건보공단" },
  { no: 33, name: "원견적서", note: "제조사, 모델명, 제품이미지", source: "제조/공급사" },
  { no: 36, name: "서울보증보험동의", note: "1, 2번 필수 동의", source: "온라인동의" },
];

const preScreeningDocs = [
  "사업자등록증 사본",
  "대표자 신분증 사본",
  "최근 3년치 재무제표와 카드매출 (홈택스 출력)",
];

function DocRow({ doc, index }: { doc: typeof businessDocs[0]; index: number }) {
  return (
    <motion.div
      className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-b-0"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <span className="flex-shrink-0 w-7 h-7 rounded bg-zinc-100 text-zinc-500 text-xs font-medium flex items-center justify-center mt-0.5">
        {doc.no}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-zinc-800 text-sm font-medium">{doc.name}</p>
        {doc.note && <p className="text-zinc-400 text-xs mt-0.5">{doc.note}</p>}
      </div>
      <span className="flex-shrink-0 text-xs text-sky-600 bg-sky-50 px-2 py-1 rounded font-medium mt-0.5">
        {doc.source}
      </span>
    </motion.div>
  );
}

export function DocumentsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-6 h-px bg-zinc-900" />
            <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase font-medium">Checklist</p>
            <span className="block w-6 h-px bg-zinc-900" />
          </div>
          <h2
            className="text-zinc-900 mb-4"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            공통 제출 서류 안내
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-lg mx-auto">
            상담 전 미리 준비하시면 더 빠른 진행이 가능합니다.
          </p>
        </motion.div>

        {/* Pre-screening highlight */}
        <motion.div
          className="mb-12 bg-sky-50 border border-sky-100 rounded-xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-sky-600" />
            <h3 className="text-sky-900 font-bold text-lg">가심사 서류 (자체 심사)</h3>
          </div>
          <p className="text-sky-700 text-sm mb-4">아래 3가지만 있으면 바로 가심사가 가능합니다.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {preScreeningDocs.map((doc, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-sky-100">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-zinc-800 text-sm font-medium">{doc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Business docs */}
          <motion.div
            className="bg-zinc-50 rounded-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center">
                <FileText className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-zinc-900 font-bold text-base">사업자 관련 서류</h3>
                <p className="text-zinc-400 text-xs">Business</p>
              </div>
            </div>
            {businessDocs.map((doc, i) => (
              <DocRow key={doc.no} doc={doc} index={i} />
            ))}
          </motion.div>

          {/* Personal docs */}
          <motion.div
            className="bg-zinc-50 rounded-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-zinc-900 font-bold text-base">대표자 관련 서류</h3>
                <p className="text-zinc-400 text-xs">Personal</p>
              </div>
            </div>
            {personalDocs.map((doc, i) => (
              <DocRow key={doc.no} doc={doc} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Notice */}
        <motion.div
          className="mt-8 flex items-start gap-2.5 text-zinc-400 text-sm bg-zinc-50 rounded-lg px-5 py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            모든 서류는 <span className="text-zinc-600 font-medium">최근 3개월 이내</span> 발급분이어야 하며,
            심사 과정에서 추가 서류를 요청할 수 있습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
