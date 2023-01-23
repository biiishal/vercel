'use strict'

const url = require('url')
const http = require('http')

const formatUrl = url =>
  new URL(url.path, `${url.protocol}//${url.hostname}`).toString()

/**
 * https://github.com/DataDog/dd-trace-js/blob/8c86a71e7f8f4e8f16c0bdd1e8d0ebf5393b98a5/packages/datadog-instrumentations/src/http/client.js#L103
 */
function normalizeArgs (inputURL, inputOptions, cb) {
  inputURL = normalizeOptions(inputURL)
  const [callback, inputOptionsNormalized] = normalizeCallback(
    inputOptions,
    cb,
    inputURL
  )
  const options = combineOptions(inputURL, inputOptionsNormalized)
  normalizeHeaders(options)

  // TODO: it used to be `url.format(options)` but it's depcreated
  // be sure the replacement is working as expected
  const uri = formatUrl(options)

  return { uri, options, callback }
}

function combineOptions (inputURL, inputOptions) {
  if (typeof inputOptions === 'object') {
    return Object.assign(inputURL || {}, inputOptions)
  } else {
    return inputURL
  }
}
function normalizeHeaders (options) {
  options.headers = options.headers || {}
}

function normalizeCallback (inputOptions, callback, inputURL) {
  if (typeof inputOptions === 'function') {
    return [inputOptions, inputURL || {}]
  } else {
    return [callback, inputOptions]
  }
}

function normalizeOptions (inputURL) {
  if (typeof inputURL === 'string') {
    try {
      return urlToOptions(new url.URL(inputURL))
    } catch (e) {
      // TODO: It used to be `url.parse(inputURL)`
      // be sure the replacement is working as expected
      return new URL(inputURL)
    }
  } else if (inputURL instanceof url.URL) {
    return urlToOptions(inputURL)
  } else {
    return inputURL
  }
}

function urlToOptions (url) {
  const agent = url.agent || http.globalAgent
  const options = {
    protocol: url.protocol || agent.protocol,
    hostname:
      typeof url.hostname === 'string' && url.hostname.startsWith('[')
        ? url.hostname.slice(1, -1)
        : url.hostname || url.host || 'localhost',
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    path: `${url.pathname || ''}${url.search || ''}`,
    href: url.href,
  }
  if (url.port !== '') {
    options.port = Number(url.port)
  }
  if (url.username || url.password) {
    options.auth = `${url.username}:${url.password}`
  }
  return options
}

module.exports = normalizeArgs
