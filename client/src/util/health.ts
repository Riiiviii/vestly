const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(
  /\/+$/,
  '',
)

export async function checkBackendStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/`)
    if (!res.ok) return false
    const data = await res.json()
    return data?.status === 'ok'
  } catch {
    return false
  }
}
