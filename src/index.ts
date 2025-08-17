export const ERR_TAG = 'err@dethrow' as const

export interface Err<E = unknown> {
  readonly _tag: typeof ERR_TAG
  readonly error: E
}

export function err<E = unknown>(error: E): Err<E> {
  return {
    _tag: ERR_TAG,
    error,
  }
}

export function isErr<E = unknown>(r: unknown): r is Err<E> {
  return (
    typeof r === 'object'
    && r !== null
    && (r as any)._tag === ERR_TAG
  )
}

/** shorthand for `err(new Error("message"))` */
export const newErr = (message: string) => err(new Error(message))

/** transforms a thrown exception into a returned `Err` */
export function dethrow<T, E = unknown>(fn: () => T): T | Err<E>
export function dethrow<T, E = unknown>(fn: () => Promise<T>): Promise<T | Err<E>>
export function dethrow<T, E = unknown>(promise: Promise<T>): Promise<T | Err<E>>
export function dethrow<T, E = unknown>(input: (() => T) | (() => Promise<T>) | Promise<T>) {
  try {
    if (typeof input === 'function') {
      const result = input()
      if (result instanceof Promise) {
        return result.then(r => r).catch(e => err(e as E))
      }
      return result
    }

    if (input instanceof Promise) {
      return input.then(r => r).catch(e => err(e as E))
    }

    return err(new Error('invalid input') as E)
  }
  catch (e) {
    return err(e as E)
  }
}
