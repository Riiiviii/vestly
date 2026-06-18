import Button from '../ui/button'

const tickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META']

type SampleTickersProps = {
  setTicker: (val: string) => void
}

function SampleTickers({ setTicker }: SampleTickersProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className=" tracking-widest uppercase text-(--text-muted)">
        Try
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tickers.map((t) => (
          <Button
            key={t}
            type="button"
            variant="secondary"
            onClick={() => setTicker(t)}
          >
            {t}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SampleTickers
