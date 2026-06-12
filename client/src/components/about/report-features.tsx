interface ReportFeature {
  label: string
  description: string
}

const reportFeatures: ReportFeature[] = [
  {
    label: 'Thesis strength',
    description:
      'A 0–100 score reflecting how strongly the four agents agree. Low scores surface genuine uncertainty — not a bug, a feature.',
  },
  {
    label: 'Data confidence',
    description:
      'Calculated before any AI runs. Flags missing financials, stale news, or thin price history so you always know what the analysis is working with.',
  },
  {
    label: 'Conflicting signals',
    description:
      'Where agents disagree is explicitly named. If Fundamentals says strong and Risk says fragile, you see both — not a smoothed average.',
  },
  {
    label: 'Key tailwinds',
    description:
      'Specific catalysts drawn from the fundamental, sentiment, and competitive lenses — grounded in real data, not boilerplate.',
  },
  {
    label: 'Key risks',
    description:
      'Non-obvious risks from the Risk/Macro and Competitive agents, anchored to recent news and financial figures.',
  },
  {
    label: 'Time horizon',
    description:
      'Short, medium, or long-term framing from the Judge Agent, calibrated to the strength and recency of the evidence.',
  },
]

export default function ReportFeatures() {
  return (
    <section className="py-20 bg-[#0f1310] border-t border-(--border-color)">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest text-(--brand-primary) uppercase mb-4">
            Every report includes
          </p>
          <h2 className="font-serif font-bold text-4xl text-(--text-primary) leading-tight">
            Structured reasoning,
            <br /> not a guess.
          </h2>
        </div>

        <div>
          {reportFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex gap-12 py-6 border-t border-(--border-color)"
            >
              <h4 className="font-semibold text-sm text-(--text-primary) w-44 shrink-0">
                {feature.label}
              </h4>
              <p className="text-sm text-(--text-light) leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
          <div className="border-t border-(--border-color)" />
        </div>
      </div>
    </section>
  )
}
