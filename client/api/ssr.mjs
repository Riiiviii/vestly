import { Readable } from 'node:stream'
import server from '../dist/server/server.js'

export default async function handler(req, res) {
  try {
    const proto = req.headers['x-forwarded-proto'] ?? 'https'
    const url = `${proto}://${req.headers.host}${req.url}`

    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value == null) continue
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v)
      } else {
        headers.set(key, value)
      }
    }

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
    const request = new Request(url, {
      method: req.method,
      headers,
      body: hasBody ? Readable.toWeb(req) : undefined,
      duplex: hasBody ? 'half' : undefined,
    })

    const response = await server.fetch(request)

    res.statusCode = response.status
    for (const [key, value] of response.headers) {
      res.setHeader(key, value)
    }

    if (response.body) {
      Readable.fromWeb(response.body).pipe(res)
    } else {
      res.end()
    }
  } catch (err) {
    console.error('SSR handler error:', err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.end('Internal Server Error')
    } else {
      res.destroy(err)
    }
  }
}
