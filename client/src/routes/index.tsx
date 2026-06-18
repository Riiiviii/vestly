import AnalysisLoading from '#/components/analysis/analysis-loading'
import AnalysisReport from '#/components/analysis/analysis-report'
import Hero from '#/components/landing/hero'
import SampleTickers from '#/components/landing/sample-tickers'
import TickerInput from '#/components/landing/ticker-input'
import Button from '#/components/ui/button'
import type { AnalysisResult } from '#/util/analyse'
import { analyseStock } from '#/util/analyse'
import { container, item } from '#/util/motion'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

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
  const reduced = useReducedMotion()

  async function handleAnalyse() {
    const t = ticker.trim().toUpperCase()
    if (!t) return
    setAnalysis({ status: 'loading', ticker: t })
    try {
      const result = await analyseStock(t)
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
      <main className="relative flex flex-col items-center justify-center w-full flex-1 gap-6 px-6 text-center">
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
      <motion.div
        className="flex flex-col items-center gap-12 flex-1 justify-center"
        variants={container}
        initial={reduced ? false : 'hidden'}
        animate="show"
      >
        <div className="relative">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-(--brand-primary) blur-[180px] rounded-full -z-10"
            initial={{ opacity: 0.12 }}
            animate={reduced ? {} : { opacity: [0.12, 0.2, 0.12], scale: [1, 1.06, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Hero />
        </div>
        <motion.div variants={item} className="flex flex-col items-center gap-4">
          <TickerInput
            ticker={ticker}
            setTicker={setTicker}
            onAnalyse={handleAnalyse}
          />
        </motion.div>
        <motion.div variants={item}>
          <SampleTickers setTicker={setTicker} />
        </motion.div>
      </motion.div>
    </main>
  )
}
