const test = require('brittle')
const target = require('.')

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

  t.alike(dependencies, { 'bare-path': '^3.0.0', 'bare-stow-host': '^0.1.0' })
})

test('generate with client', (t) => {
  snapshot(t, './core.client.js')
})
