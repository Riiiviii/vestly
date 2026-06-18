import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import Navbar from '#/components/layout/navbar/navbar.tsx'
import TickerTape from '#/components/ui/ticker-tape'
import { fetchQuotes, type Quote } from '#/util/finnhub'

const TAPE_TICKERS = [
  'AAPL',
  'TSLA',
  'NVDA',
  'MSFT',
  'AMZN',
  'GOOGL',
  'META',
  'SPY',
  'AMD',
  'NFLX',
]

export const Route = createRootRoute({
  loader: () =>
    Promise.race([
      fetchQuotes(TAPE_TICKERS),
      new Promise<Quote[]>((resolve) => setTimeout(() => resolve([]), 5000)),
    ]),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Vestly',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootLayout() {
  const quotes = Route.useLoaderData()
  return (
    <>
      <Outlet />
      {quotes.length > 0 && (
        <div className="fixed bottom-0 w-full z-50 bg-[rgba(11,14,12,0.9)] backdrop-blur-md">
          <TickerTape quotes={quotes} />
        </div>
      )}
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col items-center pt-16 pb-14">
        <Navbar />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
