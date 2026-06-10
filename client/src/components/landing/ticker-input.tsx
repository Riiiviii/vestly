import Button from '../ui/button'
import { LuSparkle } from 'react-icons/lu'

const containerStyles = `
  group
  flex justify-center
  px-3 py-3
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
}

function TickerInput({ ticker, setTicker }: TickerInputProps) {
  return (
    <section className={containerStyles}>
      <form className="flex items-center gap-5">
        <span className="text-2xl font-medium text-(--text-muted) transition-colors duration-400 group-focus-within:text-(--brand-primary)">
          {`>`}
        </span>

        <input
          type="text"
          placeholder="AAPL"
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="text-3xl font-medium font-mono tracking-wider outline-none placeholder:text-(--text-muted)"
          value={ticker}
          maxLength={5}
        />

        <Button
          type="submit"
          className="flex items-center gap-3 justify-center"
        >
          <LuSparkle /> Analyse
        </Button>
      </form>
    </section>
  )
}

export default TickerInput
