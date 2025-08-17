# dethrow

simple error handling for typescript.  

instead of wrapping values in `Result<T, E>` or `Ok<T>`, dethrow just gives you:  

- a value `T`, or  
- an `Err<E>`  

no extra `.value` access, no boilerplate. works with sync and async.  

---

## install

```bash
npm install dethrow
```

---

## usage

### sync

```ts
import { newErr, isErr } from 'dethrow'

function mayFail() {
  // inferred: string | Err<Error>
  return Math.random() > 0.5 ? 'ok' : newErr('failed')
}

const result = mayFail()

if (isErr(result)) {
  console.error(result.error.message)
  return
}

console.log(result.toUpperCase())
```

### async

```ts
import { dethrow, isErr } from 'dethrow'

async function mayFailAsync() {
  return Math.random() > 0.5 ? 42 : newErr('nope')
}

const result = await dethrow(mayFailAsync)

if (isErr(result)) {
  console.error(result.error)
} else {
  console.log(result + 1)
}
```

### dethrow

```ts
// wrap a function that might throw
const safe = dethrow(() => {
  if (Math.random() > 0.5) throw new Error('boom')
  return 'ok'
})

// or a promise
const safeAsync = await dethrow(fetch('https://example.com'))
```

## api

- `err(error)` → wrap any error value  
- `newErr(message)` → shorthand for `err(new Error(message))`  
- `isErr(value)` → type guard for `Err<E>`  
- `dethrow(fn | promise)` → catch exceptions and return `Err`  

