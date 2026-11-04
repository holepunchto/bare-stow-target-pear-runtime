/* eslint-disable */

exports['generate - harness - 0'] = `const stow = require('bare-stow-host')

const bundle = require.resolve("./index.bundle")

module.exports = {
  async start(pear, { timeout, grace } = {}) {
    const sidecar = pear.run(bundle, [], { stdio: 'inherit' })

    const ipc = stow.wrap(sidecar, { kill: () => sidecar.kill('SIGKILL'), timeout, grace })

    sidecar.on('exit', (code, signal) => ipc.exited(code, signal))

    await ipc.ready

    return { ipc }
  }
}
`

exports['generate - types - 0'] = `export function start(
  pear: import('pear-runtime'),
  opts?: Omit<import('bare-stow-host').IPCOptions, 'kill'>
): Promise<{ ipc: import('bare-stow-host').IPC }>
`

exports['generate with client - harness - 0'] = `const stow = require('bare-stow-host')
const client = require("./core.client.js")

const bundle = require.resolve("./index.bundle")

module.exports = {
  async start(pear, { timeout, grace, handlers = () => {} } = {}) {
    const sidecar = pear.run(bundle, [], { stdio: 'inherit' })

    const ipc = stow.wrap(sidecar, { kill: () => sidecar.kill('SIGKILL'), timeout, grace })

    sidecar.on('exit', (code, signal) => ipc.exited(code, signal))

    const rpc = client.attach(ipc, handlers)

    await ipc.ready

    return { ipc, rpc }
  }
}
`

exports['generate with client - types - 0'] = `export function start(
  pear: import('pear-runtime'),
  opts?: Omit<import('bare-stow-host').IPCOptions, 'kill'> & { handlers?: import("./core.client.js").Handlers }
): Promise<{ ipc: import('bare-stow-host').IPC; rpc: ReturnType<typeof import("./core.client.js").attach> }>
`

/* eslint-enable */
