# bare-stow-target-pear-runtime

The Pear Runtime target for `bare-stow` (<https://github.com/holepunchto/bare-stow>). It generates a harness that boots a stowed bundle with `pear.run()`.

```
npm i bare-stow-target-pear-runtime
```

## Usage

Pass the target to `stow()`:

```js
const stow = require('bare-stow')
const target = require('bare-stow-target-pear-runtime')

const entry = new URL('file:///app/core.js')
const out = new URL('file:///app/out/index.js')

for await (const artifact of stow(entry, target, out)) {
  console.log(artifact.url.href)
}
```

On the command line, `bare-stow` resolves `--target pear-runtime` to this package:

```console
$ bare-stow --target pear-runtime --out ./out/index.js ./core.js
```

## License

Apache-2.0
