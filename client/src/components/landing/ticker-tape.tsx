import type { Quote } from '#/util/finnhub'

type TickerTapeProps = {
  quotes: Quote[]
}

function TickerTape({ quotes }: TickerTapeProps) {
  const doubled = [...quotes, ...quotes]

  return (
    <div className="w-full overflow-hidden py-3 border-t border-(--border-color) mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex items-center gap-10 w-max animate-[ticker-scroll_35s_linear_infinite]">
        {doubled.map((q, i) => (
          <TickerItem key={`${q.ticker}-${i}`} quote={q} />
        ))}
      </div>
    </div>
  )
}

function TickerItem({ quote }: { quote: Quote }) {
  const positive = quote.changePercent >= 0
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <span className="font-mono font-semibold text-sm tracking-wide text-(--text-primary)">
        {quote.ticker}
      </span>
      <span className="font-mono text-sm text-(--text-muted)">${quote.price.toFixed(2)}</span>
      <span className={`font-mono text-sm font-medium ${positive ? 'text-(--brand-primary)' : 'text-red-400'}`}>
        {positive ? '+' : ''}
        {quote.changePercent.toFixed(2)}%
      </span>
    </div>
  )
}

export default TickerTape
