const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const CACHE_KEY = 'vestly_quotes'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export type Quote = {
  ticker: string
  price: number
  change: number
  changePercent: number
}

type CacheEntry = { quotes: Quote[]; cachedAt: number }

export async function fetchQuotes(tickers: string[]): Promise<Quote[]> {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw)
      if (Date.now() - entry.cachedAt < CACHE_TTL) return entry.quotes
    }
  }

  const res = await fetch(`${API_URL}/quotes?tickers=${tickers.join(',')}`)
  const results: Quote[] = await res.json()

  if (typeof window !== 'undefined') {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ quotes: results, cachedAt: Date.now() }))
  }
  return results
}
