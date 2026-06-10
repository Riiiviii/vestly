import Button from '../ui/button'

const TICKERS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META']

type SampleTickersProps = {
  setTicker: (val: string) => void
}

function SampleTickers({ setTicker }: SampleTickersProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs tracking-widest uppercase text-(--text-muted)">Try</span>
      <div className="flex items-center gap-2">
        {TICKERS.map((t) => (
          <Button key={t} type="button" variant="secondary" onClick={() => setTicker(t)}>
            {t}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SampleTickers
