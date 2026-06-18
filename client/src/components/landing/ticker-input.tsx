import Button from '../ui/button'
import { LuSparkle } from 'react-icons/lu'

const containerStyles = `
  group
  flex justify-center
  w-[min(90vw,26rem)] sm:w-auto
  px-3 py-2.5 sm:py-3
  rounded-2xl
  border
  bg-[var(--input-background)]
  border-[var(--border-color)]
  shadow-xl/30
  transition-[border-color,box-shadow]
  duration-400
  focus-within:border-[#2d6e45]
  focus-within:shadow-[0_20px_70px_20px_rgba(15,60,28,0.3)]
`
type TickerInputProps = {
  ticker: string
  setTicker: (val: string) => void
  onAnalyse: () => void
}

function TickerInput({ ticker, setTicker, onAnalyse }: TickerInputProps) {
  return (
    <section className={containerStyles}>
      <form className="flex items-center gap-3 sm:gap-5 w-full" onSubmit={(e) => { e.preventDefault(); onAnalyse() }}>
        <span className="shrink-0 text-lg sm:text-2xl font-medium text-(--text-muted) transition-colors duration-400 group-focus-within:text-(--brand-primary)">
          {`>`}
        </span>

        <input
          type="text"
          placeholder="AAPL"
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="w-full min-w-0 flex-1 text-xl sm:text-3xl font-medium font-mono tracking-wider outline-none placeholder:text-(--text-muted)"
          value={ticker}
          maxLength={5}
        />

        <Button
          type="submit"
          disabled={!ticker.trim()}
          className="flex items-center gap-2 sm:gap-3 justify-center shrink-0 px-4 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LuSparkle /> Analyse
        </Button>
      </form>
    </section>
  )
}

export default TickerInput
