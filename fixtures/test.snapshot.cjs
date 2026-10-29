/* eslint-disable */

exports['generate - harness - 0'] = `const path = require('bare-path')
const stow = require('bare-stow-host')

const bundle = path.join(__dirname, "./index.bundle")

module.exports = {
  async start(pear) {
    const ipc = stow.wrap(pear.run(bundle))

    await ipc.ready

    return { ipc }
  }
}
`

exports['generate - types - 0'] = `export function start(
  pear: import('pear-runtime')
): Promise<{ ipc: import('bare-stow-host').IPC }>
`

exports['generate with client - harness - 0'] = `const path = require('bare-path')
const stow = require('bare-stow-host')
const client = require("./core.client.js")

const bundle = path.join(__dirname, "./index.bundle")

module.exports = {
  async start(pear, { handlers = () => {} } = {}) {
    const ipc = stow.wrap(pear.run(bundle))

    const rpc = client.attach(ipc, handlers)

    await ipc.ready

    return { ipc, rpc }
  }
}
`

exports['generate with client - types - 0'] = `export function start(
  pear: import('pear-runtime'),
  opts?: { handlers?: import("./core.client.js").Handlers }
): Promise<{ ipc: import('bare-stow-host').IPC; rpc: ReturnType<typeof import("./core.client.js").attach> }>
`

/* eslint-enable */
