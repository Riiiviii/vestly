import type { AnalysisResult } from '#/util/analyze'

type Props = {
  signals: AnalysisResult['conflicting_signals']
}

const AGENT_TAG_STYLES: Record<string, string> = {
  fundamentals: 'text-purple-400 border-purple-400',
  sentiment: 'text-blue-500 border-blue-500',
  risk: 'text-blue-300 border-blue-300',
  competition: 'text-violet-400 border-violet-400',
}

export default function ConflictingSignals({ signals }: Props) {
  if (signals.length === 0) return null

  return (
    <div className="border-t border-(--border-color) pt-8">
      <p className="font-mono text-sm tracking-widest text-amber-400 uppercase mb-5">
        Conflicting Signals
      </p>
      <div className="flex flex-col">
        {signals.map((signal, i) => (
          <div
            key={i}
            className="flex gap-6 py-5 border-t border-(--border-color) first:border-0 first:pt-0"
          >
            <div className="flex gap-1.5 shrink-0 pt-0.5">
              {signal.agents.map((a) => (
                <span
                  key={a}
                  className={`font-mono text-xs px-2 py-0.5 rounded border uppercase ${AGENT_TAG_STYLES[a] ?? 'text-(--text-muted) border-(--border-color)'}`}
                >
                  {a.slice(0, 4)}
                </span>
              ))}
            </div>
            <p className="text-base text-(--text-light) leading-relaxed">{signal.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
