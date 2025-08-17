export interface Ok<T> {
  value: T
  error: null
}

export interface Err<E = Error> {
  value: null
  error: E
}

export function ok<T>(value: T) {
  return { value, error: null } as Ok<T>
}

export function err<E = Error>(error: E) {
  return { value: null, error } as Err<E>
}

export function dethrow<T>(fn: () => T) {
  try {
    const result = fn()
    return ok(result)
  }
  catch (error) {
    return err(error)
  }
}

export async function dethrowAsync<T>(promise: Promise<T>) {
  try {
    const result = await promise
    return result
  }
  catch (error) {
    return err(error)
  }
}
