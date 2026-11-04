exports.name = 'pear-runtime'
exports.isolation = 'process'
exports.linked = false
exports.offload = true
exports.format = 'bundle'
exports.encoding = null
exports.extension = '.bundle'
exports.hosts = [
  'darwin-arm64',
  'darwin-x64',
  'linux-arm64',
  'linux-x64',
  'win32-arm64',
  'win32-x64'
]

exports.languages = {
  javascript: {
    options: { module: 'cjs' },
    generate: javascript
  }
}

function javascript(context) {
  const { bundle, client } = context

  const handle = client
    ? `{ ipc: import('bare-stow-host').IPC; rpc: ReturnType<typeof import(${JSON.stringify(client)}).attach> }`
    : `{ ipc: import('bare-stow-host').IPC }`

  const source = `\
const stow = require('bare-stow-host')
${client ? `const client = require(${JSON.stringify(client)})\n` : ''}
const bundle = require.resolve(${JSON.stringify(bundle)})

module.exports = {
  async start(pear, { timeout, grace${client ? ', handlers = () => {}' : ''} } = {}) {
    const sidecar = pear.run(bundle, [], { stdio: 'inherit' })

    const ipc = stow.wrap(sidecar, { kill: () => sidecar.kill('SIGKILL'), timeout, grace })

    sidecar.on('exit', (code, signal) => ipc.exited(code, signal))
${client ? '\n    const rpc = client.attach(ipc, handlers)\n' : ''}
    await ipc.ready

    return ${client ? '{ ipc, rpc }' : '{ ipc }'}
  }
}
`

  const types = `\
export function start(
  pear: import('pear-runtime'),
  opts?: Omit<import('bare-stow-host').IPCOptions, 'kill'>${
    client ? ` & { handlers?: import(${JSON.stringify(client)}).Handlers }` : ''
  }
): Promise<${handle}>
`

  return {
    source,
    types,
    dependencies: {
      'bare-stow-host': '^0.2.0'
    }
  }
}
