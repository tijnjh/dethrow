import type { Err, Ok } from './core'
import { err, ok } from './core'

/** shorthand for `err(new Error("message"))` */
export const newErr = <E = Error>(message: string) => err(new Error(message) as E)

export function all<T, E>(results: (Ok<T> | Err<E>)[]) {
  const vals: T[] = []

  for (const r of results) {
    if (r.isErr()) {
      return r
    }
    vals.push(r.val)
  }

  return ok(vals)
}
