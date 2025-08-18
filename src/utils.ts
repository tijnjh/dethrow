import { err } from './core'

/** shorthand for `err(new Error("message"))` */
export const newErr = <E = Error>(message: string) => err(new Error(message) as E)
