const BASE = 'https://finnhub.io/api/v1'
const KEY = import.meta.env.VITE_FINNHUB_API_KEY

export type Quote = {
  ticker: string
  price: number
  change: number
  changePercent: number
}

const CACHE_KEY = 'vestly_quotes'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

type CacheEntry = { quotes: Quote[]; cachedAt: number }

export async function fetchQuotes(tickers: string[]): Promise<Quote[]> {
  if (typeof window !== 'undefined') {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw)
      if (Date.now() - entry.cachedAt < CACHE_TTL) return entry.quotes
    }
  }

  const results = await Promise.all(
    tickers.map(async (ticker) => {
      const res = await fetch(`${BASE}/quote?symbol=${ticker}&token=${KEY}`)
      const data = await res.json()
      return {
        ticker,
        price: data.c as number,
        change: data.d as number,
        changePercent: data.dp as number,
      }
    }),
  )

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ quotes: results, cachedAt: Date.now() }))
  }
  return results
}
