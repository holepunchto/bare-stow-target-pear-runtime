exports.name = 'pear-runtime'
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
const path = require('bare-path')
const stow = require('bare-stow-host')
${client ? `const client = require(${JSON.stringify(client)})\n` : ''}
const bundle = path.join(__dirname, ${JSON.stringify(bundle)})

module.exports = {
  async start(pear${client ? ', { handlers = () => {} } = {}' : ''}) {
    const ipc = stow.wrap(pear.run(bundle))
${client ? '\n    const rpc = client.attach(ipc, handlers)\n' : ''}
    await ipc.ready

    return ${client ? '{ ipc, rpc }' : '{ ipc }'}
  }
}
`

  const types = `\
export function start(
  pear: import('pear-runtime')${
    client
      ? `,
  opts?: { handlers?: import(${JSON.stringify(client)}).Handlers }`
      : ''
  }
): Promise<${handle}>
`

  return {
    source,
    types,
    dependencies: {
      'bare-path': '^3.0.0',
      'bare-stow-host': '^0.1.0'
    }
  }
}
