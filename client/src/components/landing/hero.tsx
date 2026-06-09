function Hero() {
  return (
    <section className="flex flex-col gap-4 justify-center items-center min-h-max text-center">
      <h2 className="font-mono text-(--text-secondary) tracking-[0.3em] text-[0.8rem] font-medium">
        STOCK ANALYSIS, SIMPLIFIED
      </h2>
      <h1 className="font-serif font-extrabold text-[clamp(4rem,7vw,7rem)] leading-none mb-[0.3em] mt-4">
        Every Stock, <br />
        <span className="text-(--brand-primary) font-semibold">
          <i> decoded.</i>
        </span>
      </h1>
      <p className="text-[clamp(1.1rem,1.4vw,1.2rem)]  max-w-[30em] text-(--text-muted)">
        Type a ticker. A panel of AI agents reads the financials, news and risk
        — and hands back one clear verdict.
      </p>
    </section>
  )
}

export default Hero
