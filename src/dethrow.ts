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
