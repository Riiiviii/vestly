import Hero from '#/components/landing/hero'
import SampleTickers from '#/components/landing/sample-tickers'
import TickerInput from '#/components/landing/ticker-input'
import TickerTape from '#/components/landing/ticker-tape'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [ticker, setTicker] = useState('')

  return (
    <main className="relative flex flex-col items-center w-full flex-1">
      <div className="flex flex-col items-center gap-12 flex-1 justify-center">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-(--brand-primary) opacity-[0.18] blur-[180px] rounded-full -z-10" />
          <Hero />
        </div>
        <div className="flex flex-col items-center gap-4">
          <TickerInput ticker={ticker} setTicker={setTicker} />
          <SampleTickers setTicker={setTicker} />
        </div>
      </div>
      <TickerTape />
    </main>
  )
}
