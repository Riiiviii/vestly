import AnalysisLoading from '#/components/analysis/analysis-loading'
import AnalysisReport from '#/components/analysis/analysis-report'
import Hero from '#/components/landing/hero'
import SampleTickers from '#/components/landing/sample-tickers'
import TickerInput from '#/components/landing/ticker-input'
import Button from '#/components/ui/button'
import type { AnalysisResult } from '#/util/analyze'
import { analyzeStock } from '#/util/analyze'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading'; ticker: string }
  | { status: 'success'; ticker: string; result: AnalysisResult }
  | { status: 'error'; ticker: string; message: string }

function Home() {
  const [ticker, setTicker] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: 'idle' })

  async function handleAnalyse() {
    const t = ticker.trim().toUpperCase()
    if (!t) return
    setAnalysis({ status: 'loading', ticker: t })
    try {
      const result = await analyzeStock(t)
      setAnalysis({ status: 'success', ticker: t, result })
    } catch (err) {
      setAnalysis({
        status: 'error',
        ticker: t,
        message: err instanceof Error ? err.message : 'Something went wrong.',
      })
    }
  }

  function handleReset() {
    setTicker('')
    setAnalysis({ status: 'idle' })
  }

  if (analysis.status === 'loading') {
    return (
      <main className="relative flex flex-col items-center w-full flex-1">
        <AnalysisLoading ticker={analysis.ticker} />
      </main>
    )
  }

  if (analysis.status === 'success') {
    return (
      <main className="relative flex flex-col items-center w-full flex-1">
        <AnalysisReport
          ticker={analysis.ticker}
          result={analysis.result}
          onReset={handleReset}
        />
      </main>
    )
  }

  if (analysis.status === 'error') {
    return (
      <main className="relative flex flex-col items-center w-full flex-1 justify-center gap-6">
        <p className="font-mono text-sm text-(--text-muted)">
          Failed to analyse{' '}
          <span className="text-(--text-primary)">{analysis.ticker}</span>.{' '}
          {analysis.message}
        </p>
        <Button variant="secondary" onClick={handleReset}>
          Try again
        </Button>
      </main>
    )
  }

  return (
    <main className="relative flex flex-col items-center w-full flex-1">
      <div className="flex flex-col items-center gap-12 flex-1 justify-center">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-(--brand-primary) opacity-[0.18] blur-[180px] rounded-full -z-10" />
          <Hero />
        </div>
        <div className="flex flex-col items-center gap-4">
          <TickerInput ticker={ticker} setTicker={setTicker} onAnalyse={handleAnalyse} />
          <SampleTickers setTicker={setTicker} />
        </div>
      </div>
    </main>
  )
}
