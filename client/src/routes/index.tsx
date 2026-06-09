import Hero from '#/components/landing/hero'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center w-full">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-(--brand-primary) opacity-[0.05] blur-[120px] rounded-full" />
      </div>
      <Hero />
    </main>
  )
}
