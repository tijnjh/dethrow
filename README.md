# dethrow

simple error handling for typescript.  


## install

```bash
npm install dethrow
```


## usage

### sync

```ts
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
```

### async

```ts
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
```

### dethrow

```ts
// wrap a function that might throw
const safe = dethrow(() => {
  if (Math.random() > 0.5) 
    throw new Error('boom')

  return 'ok'
})

// or a promise
const safeAsync = await dethrow(fetch('https://example.com'))
```