import { motion } from "motion/react";

export function YouTubeSection() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50">
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
            <span className="block w-6 h-px bg-red-500" />
            <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-medium">YouTube Shorts</p>
            <span className="block w-6 h-px bg-red-500" />
          </div>
          <h2
            className="text-zinc-900 mb-4"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            병원 자금, 영상으로 쉽게 알아보세요
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-lg mx-auto">
            모두빌스가 알려주는 병원 금융 꿀팁을 짧은 영상으로 확인하세요.
          </p>
        </motion.div>

        {/* Single Shorts embed */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-[320px] aspect-[9/16] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/xJcZzCJgHRU"
              title="모두빌스 YouTube Shorts"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
