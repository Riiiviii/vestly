interface WorkingStep {
  step: number
  title: string
  description: string
}

const workingSteps: WorkingStep[] = [
  {
    step: 1,
    title: 'Enter a ticker',
    description:
      'Type any stock symbol. Vestly pulls live data — financials, price history, analyst ratings, insider transactions, and recent news.',
  },
  {
    step: 2,
    title: 'Four agents analyse',
    description:
      'Specialist agents examine fundamentals, sentiment, macro risk, and competitive positioning — all running in parallel.',
  },
  {
    step: 3,
    title: 'Judge delivers verdict',
    description:
      'A final Judge Agent weighs every perspective and produces a single, structured investment thesis.',
  },
  {
    step: 4,
    title: 'Save & revisit',
    description:
      'Save analyses to your history. Return any time to review the reasoning or run a fresh report.',
  },
]

export default function WorkingSummary() {
  return (
    <section className="py-20 border-b bg-[#0f1310] border-(--border-color)">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-20">
          <p className="font-mono text-xs tracking-widest text-(--brand-primary) uppercase mb-3">
            How it works
          </p>
          <h2 className="font-serif font-bold text-4xl text-(--text-primary)">
            Analysis in four steps
          </h2>
        </div>

        <div className="flex">
          {workingSteps.map((step, index) => (
            <div
              key={step.step}
              className="flex-1 flex flex-col items-center text-center gap-5"
            >
              <div className="relative w-full h-10 flex items-center justify-center">
                {index > 0 && (
                  <div className="absolute right-1/2 left-0 top-1/2 h-px bg-(--border-color)" />
                )}
                {index < workingSteps.length - 1 && (
                  <div className="absolute left-1/2 right-0 top-1/2 h-px bg-(--border-color)" />
                )}
                <div className="relative z-10 w-10 h-10 rounded-full border border-(--border-color) bg-[#0b0e0c] flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-(--brand-primary)">
                    {String(step.step).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-base text-(--text-primary) px-2">
                {step.title}
              </h3>
              <p className="text-sm text-(--text-light) leading-relaxed px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
