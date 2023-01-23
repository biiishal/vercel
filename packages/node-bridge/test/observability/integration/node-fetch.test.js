'use strict'

const nodeFetch = require('node-fetch')

const { createSpy } = require('./util')

const observability = require('../../../observability')

test('GET', async () => {
  const spy = createSpy(observability)

  const { req, res, duration } = await spy(() =>
    nodeFetch('https://httpbin.org/get')
  )

  expect(!!req).toBe(true)
  expect(!!res).toBe(true)
  expect(!!duration).toBe(true)
  expect(res.statusCode).toBe(200)
  expect(req.method).toBe('GET')
})

test('POST', async () => {
  const spy = createSpy(observability)

  const { req, res, duration } = await spy(() =>
    nodeFetch('https://httpbin.org/post', { method: 'post' })
  )

  expect(!!req).toBe(true)
  expect(!!res).toBe(true)
  expect(!!duration).toBe(true)
  expect(res.statusCode).toBe(200)
  expect(req.method).toBe('POST')
})

test('HEAD', async () => {
  const spy = createSpy(observability)

  const { req, res, duration } = await spy(() =>
    nodeFetch('https://httpbin.org', { method: 'head' })
  )
  expect(!!req).toBe(true)
  expect(!!res).toBe(true)
  expect(!!duration).toBe(true)
  expect(res.statusCode).toBe(200)
  expect(req.method).toBe('HEAD')
})

test('PUT', async () => {
  const spy = createSpy(observability)

  const { req, res, duration } = await spy(() =>
    nodeFetch('https://httpbin.org/put', { method: 'put' })
  )
  expect(!!req).toBe(true)
  expect(!!res).toBe(true)
  expect(!!duration).toBe(true)
  expect(res.statusCode).toBe(200)
  expect(req.method).toBe('PUT')
})

test('PATCH', async () => {
  const spy = createSpy(observability)

  const { req, res, duration } = await spy(() =>
    nodeFetch('https://httpbin.org/patch', { method: 'patch' })
  )
  expect(!!req).toBe(true)
  expect(!!res).toBe(true)
  expect(!!duration).toBe(true)
  expect(res.statusCode).toBe(200)
  expect(req.method).toBe('PATCH')
})

test('DELETE', async () => {
  const spy = createSpy(observability)

  const { req, res, duration } = await spy(() =>
    nodeFetch('https://httpbin.org/delete', { method: 'delete' })
  )
  expect(!!req).toBe(true)
  expect(!!res).toBe(true)
  expect(!!duration).toBe(true)
  expect(res.statusCode).toBe(200)
  expect(req.method).toBe('DELETE')
})
