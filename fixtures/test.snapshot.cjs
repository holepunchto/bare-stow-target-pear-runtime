/* eslint-disable */

exports['generate - harness - 0'] = `const path = require('path')
const stow = require('bare-stow/host')

const bundle = path.join(__dirname, "./core.bundle")

module.exports = {
  async start(pear) {
    const ipc = stow.wrap(pear.run(bundle))

    await ipc.ready

    return { ipc }
  }
}
`

exports['generate - types - 0'] =
  `export function start(pear: unknown): Promise<{ ipc: import('bare-stow/host').IPC }>
`

exports['generate with client - harness - 0'] = `const path = require('path')
const stow = require('bare-stow/host')

const bundle = path.join(__dirname, "./core.bundle")

module.exports = {
  async start(pear) {
    const ipc = stow.wrap(pear.run(bundle))

    const RPC = require('bare-rpc')

    const router = new RPC.CommandRouter()
    const rpc = new RPC(ipc, router)

    rpc.respond = router.respond.bind(router)

    await ipc.ready

    return { ipc, rpc }
  }
}
`

exports['generate with client - types - 0'] =
  `export function start(pear: unknown): Promise<{ ipc: import('bare-stow/host').IPC; rpc: import('bare-rpc') }>
`

/* eslint-enable */
