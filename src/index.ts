export const OK_TAG = 'ok@dethrow' as const
export const ERR_TAG = 'err@dethrow' as const

export interface Ok<T> {
  readonly _tag: typeof OK_TAG
  readonly val: T
}

export interface Err<E = unknown> {
  readonly _tag: typeof ERR_TAG
  readonly err: E
}

export function ok<T>(value: T): Ok<T> {
  return {
    _tag: OK_TAG,
    val: value,
  }
}

export function err<E = unknown>(error: E): Err<E> {
  return {
    _tag: ERR_TAG,
    err: error,
  }
}

export function isOk<T, E = unknown>(r: Ok<T> | Err<E>) {
  return r._tag === OK_TAG
}

export function isErr<T, E = unknown>(r: Ok<T> | Err<E>) {
  return r._tag === ERR_TAG
}

/** shorthand for `err(new Error("message"))` */
export const newErr = <E = Error>(message: string) => err(new Error(message) as E)

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
