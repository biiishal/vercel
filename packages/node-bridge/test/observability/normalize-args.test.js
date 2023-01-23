'use strict'

const normalizeArgs = require('../../observability/normalize-args')

test('passing `options` and `callback`', () => {
  const options = {
    maxRedirects: 10,
    method: 'GET',
    hostname: 'vercel.com',
    port: null,
    protocol: 'https:',
    auth: null,
    path: '/',
    headers: { 'accept-encoding': 'gzip, deflate' },
  }

  const cb = function () {}

  const args = normalizeArgs(options, cb, undefined)

  expect(args.uri).toBe('https://vercel.com/')
  expect(args.options).toStrictEqual(options)
  expect(args.callback).toStrictEqual(cb)
})
