import { PiArrowRight } from 'react-icons/pi'

interface AgentDescription {
  name: string
  description: string
}

const agents: AgentDescription[] = [
  {
    name: 'Fundamentals Agent',
    description:
      'Analyses revenue trends, profitability margins, and valuation signals — P/E ratios, EBITDA, and analyst recommendations.',
  },
  {
    name: 'Sentiment Agent',
    description:
      'Reads recent headlines to gauge news tone, volume, and the short-term narrative the market is forming around the company.',
  },
  {
    name: 'Risk / Macro Agent',
    description:
      'Surfaces external threats — macro headwinds, regulatory exposure, industry-specific risks, and red flags in the data.',
  },
  {
    name: 'Competitive Agent',
    description:
      'Maps likely competitive positioning using sector data and targeted news queries to identify rival signals and market threats.',
  },
]

export default function AgentPanel() {
  return (
    <section className="py-24 border-(--border-color) border-b">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 text-center">
          <p className="font-mono text-xs tracking-widest text-(--brand-primary) uppercase mb-3">
            Under the hood
          </p>
          <h2 className="font-serif font-bold text-4xl text-(--text-primary) mb-5">
            Not one AI. A panel of specialists.
          </h2>
          <p className="text-sm text-(--text-light) leading-relaxed max-w-xl mx-auto">
            Vestly runs four specialist agents in parallel, each with a distinct
            focus, then passes all four outputs to a Judge Agent that
            synthesises them into one structured thesis. Every analysis is
            grounded in live data from{' '}
            <strong className="text-(--text-primary)">yfinance</strong> and{' '}
            <strong className="text-(--text-primary)">Finnhub</strong>.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="flex-1 flex flex-col">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="py-5 border-t border-(--border-color)"
              >
                <h4 className="font-semibold text-sm text-(--text-primary) mb-1.5">
                  {agent.name}
                </h4>
                <p className="text-sm text-(--text-light) leading-relaxed">
                  {agent.description}
                </p>
              </div>
            ))}
            <div className="border-t border-(--border-color)" />
          </div>

          <div className="hidden md:flex items-center mx-3">
            <div className="self-stretch w-4 border-r border-t border-b border-(--border-color) rounded-r-lg" />
            <PiArrowRight className="w-4 h-4 text-(--text-muted) shrink-0" />
          </div>

          <div className="w-56 bg-(--brand-secondary) border border-(--border-color) rounded-xl p-6 flex flex-col justify-center shrink-0">
            <p className="font-mono text-xs tracking-widest text-(--brand-primary) uppercase mb-2">
              Synthesis
            </p>
            <h4 className="font-serif font-bold text-2xl text-(--text-primary) mb-3">
              Judge Agent
            </h4>
            <p className="text-sm text-(--text-light) leading-relaxed">
              Reads all four outputs, surfaces disagreements, and produces a
              structured thesis with a strength score, time horizon, and key
              risks.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
