# .gitignore

```
node_modules/
dist/
DS_Store
```

# eslint.config.js

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-throw-literal': 'off',
  },
})

```

# package.json

```json
{
  "name": "dethrow",
  "version": "0.2.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./package.json": "./package.json"
  },
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "devDependencies": {
    "@antfu/eslint-config": "^5.2.1",
    "eslint": "^9.33.0",
    "tsdown": "latest"
  }
}
```

# README.md

```md
# dethrow

simple error handling for typescript.  


## install

\`\`\`bash
npm install dethrow
\`\`\`


## usage

### sync

\`\`\`ts
import { newErr, ok } from 'dethrow'

function mayFail() {
  // inferred: Ok<string> | Err<Error>
  return Math.random() > 0.5 ? ok('success') : newErr('failed')
}

const result = mayFail()

if (result.isErr()) {
  console.error(result.err.message)
  return
}

console.log(result.val.toUpperCase())
\`\`\`

### async

\`\`\`ts
async function mayFailAsync() {
  if (Math.random() > 0.5) {
    return 42
  }
  else {
    throw new Error('nope')
  }
}

const result = await dethrow(mayFailAsync())

if (result.isErr()) {
  console.error(result.err)
}
else {
  console.log(result.val + 1)
}
\`\`\`

### dethrow

\`\`\`ts
// wrap a function that might throw
const safe = dethrow(() => {
  if (Math.random() > 0.5) 
    throw new Error('boom')

  return 'ok'
})

// or a promise
const safeAsync = await dethrow(fetch('https://example.com'))
\`\`\`
```

# src/core.ts

```ts
interface Shared<T, E> {
  readonly isErr: () => this is Err<E>
  readonly unw: <R>(or: R) => T | R
}

export class Ok<T> implements Shared<T, never> {
  readonly val: T

  constructor(value: T) {
    this.val = value
  }

  isErr(): this is Err<never> {
    return false
  }

  unw<R = never>(_or?: R): T {
    return this.val
  }
}

export const ok = <T>(value: T) => new Ok(value)

export class Err<E = unknown> implements Shared<never, E> {
  readonly err: E

  constructor(error: E) {
    this.err = error
  }

  isErr(): this is Err<E> {
    return true
  }

  unw<R>(or?: R): R {
    if (or !== undefined) {
      return or
    }
    throw this.err
  }
}

export const err = <E>(error: E) => new Err(error)

```

# src/dethrow.ts

```ts
import type { Err, Ok } from './core'
import { err, ok } from './core'
import { newErr } from './utils'

/** transforms a thrown exception into a returned `Err` */
export function dethrow<T, E = unknown>(fn: () => T): Ok<T> | Err<E>
export function dethrow<T, E = unknown>(fn: () => Promise<T>): Promise<Ok<T> | Err<E>>
export function dethrow<T, E = unknown>(promise: Promise<T>): Promise<Ok<T> | Err<E>>
export function dethrow<T, E = unknown>(input: (() => T) | (() => Promise<T>) | Promise<T>) {
  try {
    if (typeof input === 'function') {
      const result = input()

      if (result instanceof Promise) {
        return result.then(r => ok(r)).catch(e => err(e as E))
      }

      return ok(result)
    }

    if (input instanceof Promise) {
      return input.then(r => ok(r)).catch(e => err(e as E))
    }

    return newErr<E>('invalid input')
  }
  catch (e) {
    return err(e as E)
  }
}

```

# src/index.ts

```ts
export { err, Err, ok, Ok } from './core'
export { dethrow } from './dethrow'
export { newErr } from './utils'

```

# src/utils.ts

```ts
import { err } from './core'

/** shorthand for `err(new Error("message"))` */
export const newErr = <E = Error>(message: string) => err(new Error(message) as E)

```

# tsdown.config.ts

```ts
import { defineConfig } from 'tsdown'
import pkg from './package.json'

const banner = `/**
* ${pkg.name} v${pkg.version}
* tijn.dev
* @license ${pkg.license}
*/`

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  outputOptions: { banner },
})

```

