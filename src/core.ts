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
