'use strict'

const normalizeArgs = require('./normalize-args.js')

let listeners = []

const addListener = cb => {
  listeners.push(cb)
  return () => (listeners = listeners.filter(i => cb !== i))
}

;['http', 'https'].forEach(protocol => {
  const mod = require(protocol)

  const { request: nativeRequest } = mod

  mod.request = function () {
    const { uri, options, callback } = normalizeArgs.apply(null, arguments)
    const req = nativeRequest.apply(mod, [uri, options, callback])
    const time = process.hrtime.bigint()

    req.once('response', res => {
      res.resume()
      res.once('end', () => {
        const duration = Number(process.hrtime.bigint() - time) / 1e6
        listeners.forEach(listener => listener({ req, res, duration }))
      })
    })

    return req
  }

  mod.get = function () {
    return mod.request.apply(mod, arguments).end()
  }
})

module.exports = addListener
