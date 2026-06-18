const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(
  /\/+$/,
  '',
)

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
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const entry: CacheEntry = JSON.parse(raw)
        if (Date.now() - entry.cachedAt < CACHE_TTL) return entry.quotes
      }
    } catch {
      // cache corrupted or unavailable
    }
  }

  let results: Quote[]
  try {
    const res = await fetch(`${API_URL}/quotes?tickers=${tickers.join(',')}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    results = await res.json()
  } catch {
    return []
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ quotes: results, cachedAt: Date.now() }))
    } catch {
      // quota exceeded or storage unavailable
    }
  }
  return results
}
