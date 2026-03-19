// Vercel Node handler that forwards to the TanStack Start server (fetch-based)
const { default: server } = require('../dist/server/server.js')

module.exports = async function handler(req, res) {
  try {
    const url = `https://${req.headers.host}${req.url}`
    const init = {
      method: req.method,
      headers: req.headers,
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = req
    }

    const response = await server.fetch(new Request(url, init))

    res.status(response.status)
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    const arrayBuffer = await response.arrayBuffer()
    res.end(Buffer.from(arrayBuffer))
  } catch (error) {
    res.status(500).send(error?.message ?? 'SSR handler error')
  }
}
