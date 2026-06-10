const BASE = 'https://finnhub.io/api/v1'
const KEY = import.meta.env.VITE_FINNHUB_API_KEY

export type Quote = {
  ticker: string
  price: number
  change: number
  changePercent: number
}

export async function fetchQuotes(tickers: string[]): Promise<Quote[]> {
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
  return results
}
