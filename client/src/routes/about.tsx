import AgentPanel from '#/components/about/agent-panel'
import ReportFeatures from '#/components/about/report-features'
import WorkingSummary from '#/components/about/working-summary'
import Footer from '#/components/layout/footer/footer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <main className="w-full">
      <section className="py-24 border-b border-(--border-color)">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs tracking-widest text-(--brand-primary) uppercase mb-6">
            About Vestly
          </p>
          <h1 className="font-serif font-bold text-[clamp(40px,5vw,60px)] leading-[1.08] tracking-[-0.02em] text-(--text-primary) mb-8">
            Institutional analysis,
            <br />
            <em className="text-(--brand-primary) font-semibold not-italic">
              <i>without the jargon.</i>
            </em>
          </h1>
          <p className="text-[clamp(14px,1.6vw,17px)] text-(--text-light) leading-[1.75] max-w-xl">
            Good stock research shouldn't require a finance degree or hours of
            reading. Vestly runs a panel of AI agents over live market data and
            turns it into clear, honest guidance — grounded in real numbers,
            written in plain language.
          </p>
        </div>
      </section>
      <WorkingSummary />
      <AgentPanel />
      <ReportFeatures />
      <Footer />
    </main>
  )
}
