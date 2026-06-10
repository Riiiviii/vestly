function Hero() {
  return (
    <section className="flex flex-col gap-4 justify-center items-center min-h-max text-center">
      <p className="flex items-center gap-2.25 font-mono text-[11.5px] text-(--text-muted) tracking-[0.22em] uppercase">
        Stock analysis simplified
      </p>

      <h1 className="font-serif font-bold text-[clamp(64px,8.2vw,82px)] leading-[1.02] tracking-[-0.035em] mb-[0.3em] mt-4">
        Every stock, <br />
        <em className="text-(--brand-primary) font-semibold not-italic">
          <i>decoded.</i>
        </em>
      </h1>

      <p className="text-[clamp(13px,2.6vw,17px)] max-w-120 text-(--text-light) leading-[1.7]">
        Type a ticker. A panel of AI agents reads the financials, news and risk
        — and hands back one clear verdict.
      </p>
    </section>
  )
}

export default Hero
