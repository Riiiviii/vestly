const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type TimeHorizon = 'short-term' | 'medium-term' | 'long-term'
export type Recommendation =
  | 'highly recommended'
  | 'recommended'
  | 'neutral'
  | 'caution advised'
  | 'not recommended'
export type AgentName = 'fundamentals' | 'sentiment' | 'risk' | 'competition'
export type Impact = 'positive' | 'negative' | 'neutral' | 'mixed'

export type ConflictingSignal = {
  description: string
  agents: AgentName[]
}

export type AgentEvidence = {
  agent: AgentName
  summary: string
  impact: Impact
}

export type AnalysisResult = {
  thesis: string
  time_horizon: TimeHorizon
  strengths: string[]
  risks: string[]
  conflicting_signals: ConflictingSignal[]
  data_gaps: string[]
  agent_evidence: AgentEvidence[]
  summary: string
  recommendation: Recommendation
}

export async function analyseStock(ticker: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_URL}/analyze?ticker=${encodeURIComponent(ticker)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
