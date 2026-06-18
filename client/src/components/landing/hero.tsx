import { item } from '#/util/motion'
import { motion } from 'motion/react'

function Hero() {
  return (
    <section className="flex flex-col gap-4 justify-center items-center min-h-max text-center px-6">
      <motion.p
        variants={item}
        className="flex items-center gap-2.25 font-mono text-xs sm:text-sm text-(--text-muted) tracking-[0.16em] sm:tracking-[0.22em] uppercase"
      >
        Stock analysis simplified
      </motion.p>

      <motion.h1
        variants={item}
        className="font-serif font-bold text-[clamp(42px,7vw,80px)] leading-[1.04] tracking-[-0.035em] mb-[0.3em] mt-4"
      >
        Any stock, <br />
        <em className="text-(--brand-primary) font-semibold not-italic">
          explained.
        </em>
      </motion.h1>

      <motion.p
        variants={item}
        className="text-[clamp(13px,2.4vw,16px)] max-w-130 text-(--text-light) leading-[1.65]"
      >
        Type a ticker. A panel of AI agents reads the financials, news and risk
        — and hands back one clear verdict.
      </motion.p>
    </section>
  )
}

export default Hero
