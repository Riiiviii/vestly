import Hero from '#/components/landing/hero'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex-1 flex items-center justify-center w-full">
      <Hero />
    </div>
  )
}
