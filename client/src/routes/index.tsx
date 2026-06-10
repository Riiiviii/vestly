import Hero from '#/components/landing/hero'
import InputTicker from '#/components/landing/input-ticker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center w-full gap-12">
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-(--brand-primary) opacity-[0.18] blur-[180px] rounded-full -z-10" />
        <Hero />
      </div>
      <InputTicker />
    </main>
  )
}
