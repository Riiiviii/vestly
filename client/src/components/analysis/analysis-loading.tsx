type Props = {
  ticker: string
}

export default function AnalysisLoading({ ticker }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 py-24">
      <p className="font-mono text-xs tracking-widest text-(--brand-primary) uppercase">
        Analysing
      </p>
      <h2 className="font-serif font-bold text-[clamp(48px,6vw,80px)] text-(--text-primary) leading-none">
        {ticker}
      </h2>
      <div className="w-6 h-6 rounded-full border-2 border-(--border-color) border-t-(--brand-primary) animate-spin mt-2" />
      <p className="font-mono text-xs text-(--text-muted)">
        This usually takes 1–3 minutes
      </p>
    </div>
  )
}
