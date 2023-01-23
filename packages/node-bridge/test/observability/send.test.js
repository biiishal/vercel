'use strict'

const createSendMetrics = require('../../observability/send')
const { createDeferred, runServer } = require('../run-test-server')

test('send metrics to remote endpoint', async () => {
  const token = '1111'
  const received = {}

  const { deferred, resolve } = createDeferred()

  const httpMetricsServer = await runServer({
    handler: (req, res) => {
      const authToken = req.headers['authorization'].split(' ')[1]

      if (authToken !== token) {
        res.statusCode = received.statusCode = 403
        res.end()
      }

      const chunks = []
      req.on('data', chunk => chunks.push(chunk.toString()))
      req.on('close', () => {
        received.data = JSON.parse(chunks)
        received.statusCode = 200
        res.writeHead(received.statusCode, 'OK', {
          'content-type': 'application/json',
        })
        res.end()
        resolve()
      })
    },
  })

  const sendMetrics = createSendMetrics({
    url: httpMetricsServer.url,
    token,
  })

  sendMetrics({ foo: 'bar' })

  await deferred

  expect(received.statusCode).toBe(200)
  expect(received.data).toStrictEqual({ foo: 'bar' })

  await httpMetricsServer.close()
})

test("don't throw an error under expected behavior", async () => {
  const httpMetricsServer = await runServer({
    handler: () => {
      throw new Error('oh no!')
    },
  })

  const sendMetrics = createSendMetrics({
    url: httpMetricsServer.url,
    token: '',
  })

  sendMetrics({ foo: 'bar' })

  await httpMetricsServer.close()
})
