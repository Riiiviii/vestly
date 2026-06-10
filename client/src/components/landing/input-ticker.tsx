import Button from '../ui/button'

const containerStyles = `
  group
  flex justify-center
  px-7 py-4
  rounded-2xl
  border
  bg-[var(--input-background)]
  border-[var(--border-color)]
  shadow-xl/20
  transition-[border-color,box-shadow]
  duration-400
  focus-within:border-[#2d6e45]
  focus-within:shadow-[0_20px_70px_20px_rgba(15,60,28,0.3)]
`

function InputTicker() {
  return (
    <section className={containerStyles}>
      <form className="flex items-center gap-5">
        <span className="text-2xl font-medium text-(--text-muted) transition-colors duration-400 group-focus-within:text-(--brand-primary)">
          {`>`}
        </span>

        <input
          type="text"
          placeholder="AAPL"
          className="text-3xl font-medium font-mono tracking-wider outline-none placeholder:text-(--text-muted)"
        />

        <Button type="submit">Analyse</Button>
      </form>
    </section>
  )
}

export default InputTicker
