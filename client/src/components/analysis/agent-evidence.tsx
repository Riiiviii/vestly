import type { AnalysisResult } from '#/util/analyze'

type Props = {
  evidence: AnalysisResult['agent_evidence']
}

const AGENT_LABELS: Record<string, string> = {
  fundamentals: 'Fundamentals',
  sentiment: 'Sentiment',
  risk: 'Risk / Macro',
  competition: 'Competitive',
}

const IMPACT_STYLES: Record<AnalysisResult['agent_evidence'][number]['impact'], string> = {
  positive: 'text-(--brand-primary)',
  negative: 'text-red-400',
  neutral: 'text-(--text-muted)',
  mixed: 'text-amber-400',
}

export default function AgentEvidence({ evidence }: Props) {
  return (
    <div className="border-t border-(--border-color) pt-8">
      <p className="font-mono text-sm tracking-widest text-(--text-primary) uppercase mb-6">
        Agent Evidence
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidence.map((e) => (
          <div
            key={e.agent}
            className="border border-(--border-color) rounded-xl p-5 flex flex-col gap-3 bg-[#0f1310]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-(--text-secondary) uppercase">
                {AGENT_LABELS[e.agent]}
              </span>
              <span className={`font-mono text-xs uppercase ${IMPACT_STYLES[e.impact]}`}>
                {e.impact}
              </span>
            </div>
            <p className="text-base text-(--text-light) leading-relaxed">{e.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
