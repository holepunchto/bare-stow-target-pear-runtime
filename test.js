const test = require('brittle')
const target = require('.')

const client = {
  source: `const RPC = require('bare-rpc')

const router = new RPC.CommandRouter()
const rpc = new RPC(ipc, router)

rpc.respond = router.respond.bind(router)
`,
  type: "import('bare-rpc')"
}

function snapshot(t, bundleSpecifier, client = null) {
  const [harness, types] = target.generate({
    bundleSpecifier,
    ipc: 'ipc',
    rpc: 'rpc',
    client
  })

  t.snapshot(harness.source, 'harness')
  t.snapshot(types.source, 'types')
}

test('generate', (t) => {
  t.is(target.name, 'pear-runtime')
  t.is(target.format, 'bundle')
  snapshot(t, './core.bundle')
})

test('generate with client', (t) => {
  snapshot(t, './core.bundle', client)
})
