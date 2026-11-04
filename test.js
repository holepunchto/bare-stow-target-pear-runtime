const path = require('path')
const { pathToFileURL, fileURLToPath } = require('url')
const test = require('brittle')
const { isBare } = require('which-runtime')
const stow = require('bare-stow')
const target = require('.')

const fixtures = pathToFileURL(path.join(__dirname, 'fixtures') + '/')

// Pear Runtime runs bundles in sidecars only outside of Bare.
const sidecars = { skip: isBare }

function snapshot(t, client = null) {
  const { source, types } = target.languages.javascript.generate({
    bundle: './index.bundle',
    client,
    options: target.languages.javascript.options
  })

  t.snapshot(source, 'harness')
  t.snapshot(types, 'types')
}

test('generate', (t) => {
  t.is(target.name, 'pear-runtime')
  t.is(target.format, 'bundle')
  t.alike(target.languages.javascript.options, { module: 'cjs' })
  snapshot(t)
})

test('generate declares the packages the harness imports', (t) => {
  const { dependencies } = target.languages.javascript.generate({
    bundle: './index.bundle',
    client: null,
    options: target.languages.javascript.options
  })

  t.alike(dependencies, { 'bare-stow-host': '^0.2.0' })
})

test('generate with client', (t) => {
  snapshot(t, './core.client.js')
})

test('start boots the bundle in a sidecar', sidecars, async (t) => {
  const harness = await build('echo')
  const { ipc } = await harness.start(require('pear-runtime'))

  const echo = new Promise((resolve) => ipc.once('data', resolve))

  ipc.write(Buffer.from('hello'))

  t.alike(await echo, Buffer.from('hello'))
  t.is(await ipc.terminate(), 0)
})

test('start rejects when ready times out', sidecars, async (t) => {
  const harness = await build('hang')

  await t.exception(harness.start(require('pear-runtime'), { timeout: 100 }))
})

test('start reports a worker that exits abruptly', sidecars, async (t) => {
  const harness = await build('crash')
  const { ipc } = await harness.start(require('pear-runtime'))

  const err = await new Promise((resolve) => ipc.once('error', resolve))

  t.is(err.exitCode, 5)
})

test('start kills a worker that ignores terminate', sidecars, async (t) => {
  const harness = await build('stall')
  const { ipc } = await harness.start(require('pear-runtime'), { grace: 100 })

  t.is(await ipc.terminate(), undefined)
})

async function build(name) {
  const dir = new URL(name + '/', fixtures)
  const out = new URL('out/', dir)

  for await (const _ of stow(new URL('core.js', dir), target, out)) {
    //
  }

  return require(fileURLToPath(new URL('index.js', out)))
}
