interface ReportFeature {
  label: string;
  description: string;
}

const reportFeatures: ReportFeature[] = [
  {
    label: "Thesis strength",
    description:
      "A 0–100 score reflecting how strongly the four agents agree. Low scores surface genuine uncertainty — not a bug, a feature.",
  },
  {
    label: "Data confidence",
    description:
      "Calculated before any AI runs. Flags missing financials, stale news, or thin price history so you always know what the analysis is working with.",
  },
  {
    label: "Conflicting signals",
    description:
      "Where agents disagree is explicitly named. If Fundamentals says strong and Risk says fragile, you see both — not a smoothed average.",
  },
  {
    label: "Key tailwinds",
    description:
      "Specific catalysts drawn from the fundamental, sentiment, and competitive lenses — grounded in real data, not boilerplate.",
  },
  {
    label: "Key risks",
    description:
      "Non-obvious risks from the Risk/Macro and Competitive agents, anchored to recent news and financial figures.",
  },
  {
    label: "Time horizon",
    description:
      "Short, medium, or long-term framing from the Judge Agent, calibrated to the strength and recency of the evidence.",
  },
];

export default function ReportSummary() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <h2 className="font-mono text-xs tracking-widest text-(--brand) uppercase mb-4">
            Every report includes
          </h2>
          <h3 className="font-serif font-bold text-4xl text-(--ink) leading-tight">
            Structured reasoning,
            <br /> not a guess.
          </h3>
        </div>

        <div>
          {reportFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col md:flex-row gap-4 md:gap-12 py-6 border-t border-border"
            >
              <h4 className="font-semibold text-sm text-(--ink) w-full md:w-44 md:shrink-0">
                {feature.label}
              </h4>
              <p className="text-sm text-(--ink2) leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
}
