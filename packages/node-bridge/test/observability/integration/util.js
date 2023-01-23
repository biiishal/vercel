'use strict'

const delay = delay => new Promise(resolve => setTimeout(resolve, delay))

const createSpy = httpObserver => {
  let buffer

  httpObserver(args => {
    buffer = args
  })

  const getBuffer = () => {
    const payload = buffer
    buffer = null
    return payload
  }

  return async fn => {
    await fn()
    await delay(50)
    return getBuffer()
  }
}

module.exports = {
  createSpy,
}
