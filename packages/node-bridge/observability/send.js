'use strict'

const https = require('https')
const http = require('http')

const AGENT = {
  'https:': new https.Agent({ keepAlive: true }),
  'http:': new http.Agent({ keepAlive: true }),
}

module.exports =
  ({ url, token }) =>
  payload => {
    const data = `${JSON.stringify(payload)}\n`
    const protocol = url.protocol === 'https:' ? https : http

    const promise = new Promise((resolve, reject) => {
      const req = protocol.request(
        url,
        {
          method: 'POST',
          agent: AGENT[url.protocol],
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/x-ndjson',
            'content-length': Buffer.byteLength(data),
          },
        },
        resolve
      )

      req.on('error', reject)
      req.write(data)
      req.end()
    })

    // silently ignore any error
    promise.catch(() => {})
  }
